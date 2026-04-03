const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Step 2 – Create Electron Window
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 350, // Initial small width, we will adjust this for the collapsed/expanded states later
    height: 600,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // For simplicity in stage 1, or use preload script
    }
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Open the DevTools manually if needed.
  // mainWindow.webContents.openDevTools();
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
