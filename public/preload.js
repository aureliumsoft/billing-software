const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  executeQuery: (method, args) => ipcRenderer.invoke('db:query', { method, args }),
  
  // Print operations
  printReceipt: (content) => ipcRenderer.invoke('print:receipt', content),
});


