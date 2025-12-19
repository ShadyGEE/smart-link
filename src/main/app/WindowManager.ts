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
      show: false, // Don't show until ready
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
      this.mainWindow.loadURL('http://localhost:5173').catch((err) => {
        console.error('Failed to load URL:', err);
      });
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
}
