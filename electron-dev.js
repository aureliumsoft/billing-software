const { app, BrowserWindow } = require('electron');
const path = require('path');

// Development mode detection
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     process.argv.includes('--dev') || 
                     !app.isPackaged;

let mainWindow;

function createWindow() {
  console.log('Creating Electron window...');
  console.log('isDevelopment:', isDevelopment);

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
    backgroundColor: '#f8fafc',
    show: false,
    title: 'Cafe POS System - Development',
    center: true,
    alwaysOnTop: false,
    skipTaskbar: false,
    autoHideMenuBar: false
  });

  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
    mainWindow.show();
    mainWindow.focus();
  });

  // Add debugging events
  mainWindow.webContents.on('did-start-loading', () => {
    console.log('🔄 Started loading content...');
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('✅ Finished loading content');
    console.log('🎯 Window should now display the React app');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('❌ Failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('dom-ready', () => {
    console.log('🌐 DOM is ready - React app should be visible');
  });

  // Load the development server
  const devURL = 'http://localhost:3000';
  console.log('Loading development server:', devURL);

  // Wait for the development server to be ready
  const loadDevServer = () => {
    console.log('Attempting to load:', devURL);
    mainWindow.loadURL(devURL).then(() => {
      console.log('✅ Successfully loaded development server');
      console.log('🎯 Window should now show the React app');
      
      // Ensure window is visible and focused
      mainWindow.show();
      mainWindow.focus();
      
      if (isDevelopment) {
        mainWindow.webContents.openDevTools();
      }
    }).catch(err => {
      console.error('❌ Failed to load development server:', err);
      console.log('🔄 Retrying in 3 seconds...');
      setTimeout(loadDevServer, 3000);
    });
  };

  // Start loading immediately
  loadDevServer();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  console.log('Electron app ready');
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

// Handle protocol for development
app.setAsDefaultProtocolClient('cafe-pos-dev');
