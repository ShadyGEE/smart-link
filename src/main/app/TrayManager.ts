import { Tray, Menu, nativeImage, app } from 'electron';
import path from 'path';
import { WindowManager } from './WindowManager';

export class TrayManager {
  private tray: Tray | null = null;
  private windowManager: WindowManager;

  constructor(windowManager: WindowManager) {
    this.windowManager = windowManager;
    this.createTray();
  }

  private createTray(): void {
    // Create tray icon
    const iconPath = path.join(__dirname, '../../assets/icons/tray-icon.png');
    const icon = nativeImage.createFromPath(iconPath);

    this.tray = new Tray(icon.resize({ width: 16, height: 16 }));
    this.tray.setToolTip('SmartLink - AI Management Assistant');

    // Create context menu
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open SmartLink',
        click: () => {
          this.windowManager.showMainWindow();
        },
      },
      {
        label: 'Quick Actions',
        submenu: [
          {
            label: 'New Task',
            click: () => {
              this.windowManager.showMainWindow();
              this.windowManager.sendToRenderer('quick-action', 'new-task');
            },
          },
          {
            label: 'New Meeting',
            click: () => {
              this.windowManager.showMainWindow();
              this.windowManager.sendToRenderer('quick-action', 'new-meeting');
            },
          },
          {
            label: 'Voice Command',
            click: () => {
              this.windowManager.showMainWindow();
              this.windowManager.sendToRenderer('quick-action', 'voice-command');
            },
          },
        ],
      },
      { type: 'separator' },
      {
        label: 'Settings',
        click: () => {
          this.windowManager.showMainWindow();
          this.windowManager.sendToRenderer('navigate', '/settings');
        },
      },
      { type: 'separator' },
      {
        label: 'Quit SmartLink',
        click: () => {
          app.quit();
        },
      },
    ]);

    this.tray.setContextMenu(contextMenu);

    // Click behavior
    this.tray.on('click', () => {
      this.windowManager.toggleMainWindow();
    });

    // Double-click behavior (Windows)
    this.tray.on('double-click', () => {
      this.windowManager.showMainWindow();
    });
  }

  updateBadge(count: number): void {
    if (this.tray) {
      if (count > 0) {
        this.tray.setToolTip(`SmartLink - ${count} notifications`);
      } else {
        this.tray.setToolTip('SmartLink - AI Management Assistant');
      }
    }
  }

  destroy(): void {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }
}
