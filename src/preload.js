const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  saveOptions: (option) => ipcRenderer.send("save-options", option),
});
