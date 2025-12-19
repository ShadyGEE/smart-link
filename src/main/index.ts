import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { WindowManager } from './app/WindowManager';
import { TrayManager } from './app/TrayManager';
import { registerIpcHandlers } from './ipc';
import { IPC_CHANNELS } from '../shared/constants/channels';

// Disable GPU cache to avoid permission errors on Windows
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disable-gpu-program-cache');

console.log('SmartLink starting...');

// Handle creating/removing shortcuts on Windows when installing/uninstalling
try {
  if (require('electron-squirrel-startup')) {
    app.quit();
  }
} catch (e) {
  // electron-squirrel-startup not installed, skip
  console.log('Squirrel startup check skipped');
}

class Application {
  private windowManager: WindowManager;
  private trayManager: TrayManager | null = null;
  private isDev: boolean;

  constructor() {
    this.isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
    this.windowManager = new WindowManager(this.isDev);

    this.setupAppEvents();
    this.setupIpcHandlers();
  }

  private setupAppEvents(): void {
    // App ready
    app.whenReady().then(() => {
      console.log('App is ready, creating main window...');
      this.createMainWindow();
      console.log('Main window created');
      this.setupTray();

      app.on('activate', () => {
        // On macOS, re-create window when dock icon is clicked
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });
    });

    // Quit when all windows are closed (except on macOS)
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Security: Prevent new window creation
    app.on('web-contents-created', (_, contents) => {
      contents.setWindowOpenHandler(() => {
        return { action: 'deny' };
      });
    });

    // Handle second instance
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.quit();
    } else {
      app.on('second-instance', () => {
        const mainWindow = this.windowManager.getMainWindow();
        if (mainWindow) {
          if (mainWindow.isMinimized()) mainWindow.restore();
          mainWindow.focus();
        }
      });
    }
  }

  private createMainWindow(): void {
    this.windowManager.createMainWindow();
  }

  private setupTray(): void {
    // Tray setup can be implemented later
    // this.trayManager = new TrayManager(this.windowManager);
  }

  private setupIpcHandlers(): void {
    // Register all IPC handlers
    registerIpcHandlers();

    // System controls
    ipcMain.handle(IPC_CHANNELS.SYSTEM.MINIMIZE, () => {
      const mainWindow = this.windowManager.getMainWindow();
      mainWindow?.minimize();
    });

    ipcMain.handle(IPC_CHANNELS.SYSTEM.MAXIMIZE, () => {
      const mainWindow = this.windowManager.getMainWindow();
      if (mainWindow?.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow?.maximize();
      }
    });

    ipcMain.handle(IPC_CHANNELS.SYSTEM.CLOSE, () => {
      const mainWindow = this.windowManager.getMainWindow();
      mainWindow?.close();
    });

    // Theme handling
    ipcMain.handle(IPC_CHANNELS.SETTINGS.GET_THEME, () => {
      return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
    });

    ipcMain.handle(IPC_CHANNELS.SETTINGS.SET_THEME, (_, theme: 'light' | 'dark' | 'system') => {
      if (theme === 'system') {
        nativeTheme.themeSource = 'system';
      } else {
        nativeTheme.themeSource = theme;
      }
      return true;
    });

    // System status
    ipcMain.handle(IPC_CHANNELS.SYSTEM.GET_STATUS, () => {
      return {
        platform: process.platform,
        version: app.getVersion(),
        isPackaged: app.isPackaged,
        isDev: this.isDev,
      };
    });

    ipcMain.handle(IPC_CHANNELS.SYSTEM.GET_OFFLINE_STATUS, () => {
      return {
        isOnline: require('dns').promises
          .lookup('google.com')
          .then(() => true)
          .catch(() => false),
      };
    });
  }
}

// Create application instance
new Application();
