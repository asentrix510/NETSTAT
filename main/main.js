const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  // Provide some padding for shadows
  const WINDOW_WIDTH_COLLAPSED = 20; 
  const WINDOW_WIDTH_EXPANDED = 350;

  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH_COLLAPSED,
    height: height,
    x: width - WINDOW_WIDTH_COLLAPSED,
    y: 0,
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

  ipcMain.on('toggle-sidebar', (event, isExpanded) => {
    const targetWidth = isExpanded ? WINDOW_WIDTH_EXPANDED : WINDOW_WIDTH_COLLAPSED;
    const targetX = width - targetWidth;
    
    // Smoothly set bounds, though Electron resize can be instant
    mainWindow.setBounds({ x: targetX, y: 0, width: targetWidth, height: height });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
