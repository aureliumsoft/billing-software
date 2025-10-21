const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('./database');

// Better development detection
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     process.argv.includes('--dev') || 
                     !app.isPackaged;

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

  // Show loading screen while waiting for content
  mainWindow.webContents.on('did-start-loading', () => {
    console.log('Started loading content...');
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Finished loading content');
  });

  // Load development server or production build
  const startURL = isDevelopment 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../index.html')}`;

  console.log('Loading URL:', startURL);
  console.log('isDevelopment:', isDevelopment);

  // Add retry logic for development server
  const loadURL = (url, retries = 5) => {
    console.log(`Attempting to load: ${url} (${retries} retries left)`);
    mainWindow.loadURL(url).catch(err => {
      console.error('Failed to load URL:', err);
      if (isDevelopment && retries > 0) {
        console.log(`Development server not ready, retrying in 2 seconds... (${retries} retries left)`);
        setTimeout(() => {
          loadURL(url, retries - 1);
        }, 2000);
      } else if (isDevelopment) {
        console.log('Development server failed to load after retries, trying production build...');
        mainWindow.loadURL(`file://${path.join(__dirname, 'build/index.html')}`);
      }
    });
  };

  // Wait a bit longer for development server to be ready
  if (isDevelopment) {
    setTimeout(() => {
      loadURL(startURL);
    }, 5000); // Wait 5 seconds for dev server to be ready
  } else {
    loadURL(startURL);
  }

  if (isDevelopment) {
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

