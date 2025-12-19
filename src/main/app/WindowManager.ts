import { BrowserWindow, shell } from 'electron';
import path from 'path';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  private isDev: boolean;

  constructor(isDev: boolean) {
    this.isDev = isDev;
  }

  createMainWindow(): BrowserWindow {
    console.log('Creating main window...');
    console.log('isDev:', this.isDev);
    console.log('Preload path:', path.join(__dirname, '../../preload/index.js'));

    // Create the browser window
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1024,
      minHeight: 700,
      frame: false, // Custom titlebar
      titleBarStyle: 'hidden',
      backgroundColor: '#1a1a1a',
      show: this.isDev, // Show immediately in dev mode to prevent app exit
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false, // Disabled for development - preload compatibility
        preload: path.join(__dirname, '../../preload/index.js'),
      },
    });

    // Load the app
    if (this.isDev) {
      console.log('Loading dev URL: http://localhost:5173');
      this.loadDevURL(this.mainWindow);
      // Open DevTools in development
      this.mainWindow.webContents.openDevTools();
    } else {
      const htmlPath = path.join(__dirname, '../../renderer/index.html');
      console.log('Loading file:', htmlPath);
      this.mainWindow.loadFile(htmlPath).catch((err) => {
        console.error('Failed to load file:', err);
      });
    }

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
      this.mainWindow?.focus();
    });

    // Fallback: show window after a delay if ready-to-show doesn't fire (dev mode)
    if (this.isDev) {
      setTimeout(() => {
        if (this.mainWindow && !this.mainWindow.isVisible()) {
          console.log('Showing window via fallback...');
          this.mainWindow.show();
        }
      }, 5000);
    }

    // Handle external links
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      // Open external links in default browser
      if (url.startsWith('http://') || url.startsWith('https://')) {
        shell.openExternal(url);
      }
      return { action: 'deny' };
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Security: Prevent navigation to external URLs
    this.mainWindow.webContents.on('will-navigate', (event, url) => {
      const appUrl = this.isDev ? 'http://localhost:5173' : 'file://';
      if (!url.startsWith(appUrl)) {
        event.preventDefault();
        shell.openExternal(url);
      }
    });

    return this.mainWindow;
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  sendToRenderer(channel: string, ...args: unknown[]): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(channel, ...args);
    }
  }

  isMainWindowFocused(): boolean {
    return this.mainWindow?.isFocused() ?? false;
  }

  showMainWindow(): void {
    if (this.mainWindow) {
      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore();
      }
      this.mainWindow.show();
      this.mainWindow.focus();
    }
  }

  hideMainWindow(): void {
    this.mainWindow?.hide();
  }

  toggleMainWindow(): void {
    if (this.mainWindow?.isVisible()) {
      this.hideMainWindow();
    } else {
      this.showMainWindow();
    }
  }

  private loadDevURL(window: BrowserWindow, maxRetries = 10): void {
    const url = 'http://localhost:5173';
    let retryCount = 0;

    // Handle failed loads and retry - set up BEFORE initial load
    window.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      if (!isMainFrame) return; // Only handle main frame failures

      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Failed to load (${errorDescription}). Retrying ${retryCount}/${maxRetries}...`);
        setTimeout(() => {
          if (!window.isDestroyed()) {
            window.loadURL(url).catch(() => {});
          }
        }, 2000);
      } else {
        console.error('Max retries reached. Please check that Vite dev server is running.');
      }
    });

    // Add a small delay before initial load to ensure Vite is fully ready
    setTimeout(() => {
      window.loadURL(url).catch((err) => {
        console.log('Initial load attempt:', err.message);
        // The did-fail-load handler will retry
      });
    }, 1000);
  }
}
