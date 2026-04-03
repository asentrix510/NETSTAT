const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const networkMonitor = require('./networkMonitor');

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  const WINDOW_HEIGHT_COLLAPSED = 90;
  const WINDOW_HEIGHT_EXPANDED = 360;
  const WINDOW_WIDTH_COLLAPSED = 20; 
  const WINDOW_WIDTH_EXPANDED = 340; 

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

  ipcMain.handle('toggle-sidebar', (event, isExpanded) => {
    let bounds = mainWindow.getBounds();
    const currentDisplay = screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y });
    
    const isRightSide = (bounds.x + bounds.width / 2) > (currentDisplay.bounds.x + currentDisplay.bounds.width / 2);
    const dockSide = isRightSide ? 'right' : 'left';

    const targetW = isExpanded ? WINDOW_WIDTH_EXPANDED : WINDOW_WIDTH_COLLAPSED;
    const targetH = isExpanded ? WINDOW_HEIGHT_EXPANDED : WINDOW_HEIGHT_COLLAPSED;
    
    let targetX = bounds.x;
    let targetY = bounds.y;
    
    if (isExpanded) {
        if (isRightSide) targetX = bounds.x - (WINDOW_WIDTH_EXPANDED - WINDOW_WIDTH_COLLAPSED);
        targetY = bounds.y - (WINDOW_HEIGHT_EXPANDED - WINDOW_HEIGHT_COLLAPSED) / 2;
    } else {
        if (isRightSide) targetX = bounds.x + (WINDOW_WIDTH_EXPANDED - WINDOW_WIDTH_COLLAPSED);
        targetY = bounds.y + (WINDOW_HEIGHT_EXPANDED - WINDOW_HEIGHT_COLLAPSED) / 2;
    }

    const maxY = currentDisplay.bounds.y + currentDisplay.bounds.height - targetH;
    const minY = currentDisplay.bounds.y;
    if (targetY > maxY) targetY = maxY;
    if (targetY < minY) targetY = minY;

    mainWindow.setBounds({ x: targetX, y: targetY, width: targetW, height: targetH });
    
    return dockSide;
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
