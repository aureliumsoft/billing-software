const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('./electron-is-dev');
const Database = require('./database');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // Allow loading local resources in dev mode
    },
    backgroundColor: '#f8fafc',
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Always use production build for stability
  const startURL = `file://${path.join(__dirname, 'build/index.html')}`;

  mainWindow.loadURL(startURL).catch(err => {
    console.error('Failed to load URL:', err);
    // Fallback to dev server if build doesn't exist
    if (!isDev) {
      mainWindow.loadURL('http://localhost:3000');
    }
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle navigation errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  db = new Database();
  await db.initPromise; // Wait for database to initialize
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Database IPC Handlers
ipcMain.handle('db:query', async (event, { method, args }) => {
  try {
    const result = db[method](...args);
    return { success: true, data: result };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: error.message };
  }
});

// Print receipt
ipcMain.handle('print:receipt', async (event, content) => {
  try {
    const printWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
      },
    });

    printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(content)}`);

    printWindow.webContents.on('did-finish-load', () => {
      printWindow.webContents.print(
        {
          silent: false,
          printBackground: true,
          margins: { marginType: 'none' },
        },
        (success, errorType) => {
          if (!success) {
            console.error('Print failed:', errorType);
          }
          printWindow.close();
        }
      );
    });

    return { success: true };
  } catch (error) {
    console.error('Print error:', error);
    return { success: false, error: error.message };
  }
});

