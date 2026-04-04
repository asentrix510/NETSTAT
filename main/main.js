const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const networkMonitor = require('./networkMonitor');

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  const WINDOW_HEIGHT_COLLAPSED = 100;
  const WINDOW_HEIGHT_EXPANDED = 360;
  const WINDOW_WIDTH_COLLAPSED = 12; 
  const WINDOW_WIDTH_EXPANDED = 330; 

  const yCollapsed = Math.round((height - WINDOW_HEIGHT_COLLAPSED) / 2);

  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH_COLLAPSED,
    height: WINDOW_HEIGHT_COLLAPSED,
    x: width - WINDOW_WIDTH_COLLAPSED,
    y: yCollapsed,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.on('blur', () => {
    mainWindow.webContents.send('force-close-sidebar');
  });

  ipcMain.on('toggle-sidebar', (event, isExpanded) => {
    const targetW = isExpanded ? WINDOW_WIDTH_EXPANDED : WINDOW_WIDTH_COLLAPSED;
    const targetH = isExpanded ? WINDOW_HEIGHT_EXPANDED : WINDOW_HEIGHT_COLLAPSED;
    const targetX = width - targetW;
    const targetY = Math.round((height - targetH) / 2);
    
    mainWindow.setBounds({ x: targetX, y: targetY, width: targetW, height: targetH });
  });
}

app.whenReady().then(() => {
  createWindow();
  networkMonitor.startMonitoring(mainWindow);

  // Configure app to launch on startup
  app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath('exe'),
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
