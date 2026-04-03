const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const networkMonitor = require('./networkMonitor');

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  // Shrunken transparent boundary to prevent stealing clicks
  const WINDOW_HEIGHT_COLLAPSED = 120;
  const WINDOW_HEIGHT_EXPANDED = 370;
  const WINDOW_WIDTH_COLLAPSED = 16; 
  const WINDOW_WIDTH_EXPANDED = 335; 

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

  ipcMain.on('toggle-sidebar', (event, isExpanded) => {
    const targetW = isExpanded ? WINDOW_WIDTH_EXPANDED : WINDOW_WIDTH_COLLAPSED;
    const targetH = isExpanded ? WINDOW_HEIGHT_EXPANDED : WINDOW_HEIGHT_COLLAPSED;
    const targetX = width - targetW;
    const targetY = Math.round((height - targetH) / 2);
    
    // Resize the transparent bounding box exactly to the UI bounds so we never clip the desktop!
    mainWindow.setBounds({ x: targetX, y: targetY, width: targetW, height: targetH });
  });
}

app.whenReady().then(() => {
  createWindow();
  networkMonitor.startMonitoring(mainWindow);

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
