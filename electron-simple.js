const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('./database');

let mainWindow;
let db;

console.log('Starting Electron...');

function createWindow() {
  console.log('Creating window...');
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: '#f8fafc',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const startURL = `file://${path.join(__dirname, 'build/index.html')}`;
  console.log('Loading URL:', startURL);

  mainWindow.loadURL(startURL).then(() => {
    console.log('Loaded successfully!');
    mainWindow.show();
  }).catch(err => {
    console.error('Load error:', err.message);
  });

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  console.log('App ready!');
  
  // Initialize database
  db = new Database();
  await db.initPromise;
  console.log('Database initialized!');
  
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
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

console.log('Script loaded');

