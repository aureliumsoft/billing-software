const { app, BrowserWindow } = require('electron');

console.log('Electron test starting...');

function createWindow() {
  console.log('Creating window...');
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('build/index.html').then(() => {
    console.log('Window loaded successfully!');
    win.show();
  }).catch(err => {
    console.error('Failed to load:', err);
  });
  
  win.on('closed', () => {
    console.log('Window closed');
  });
}

app.whenReady().then(() => {
  console.log('App is ready!');
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  app.quit();
});

console.log('Electron script loaded');


