console.time();

const {app, BrowserWindow, screen, protocol} = require('electron');
const path = require('path');

const createWindow = () => {
  // Get the primary display's size
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: __dirname + '/img/favicon.ico',
    show: false,
    width: width,
    height: height,
    frame: true,
    transparent: true,
    resizable: true,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'spacedesk.html'));

  mainWindow.removeMenu();

  mainWindow.on("ready-to-show", console.timeEnd);
  mainWindow.on("ready-to-show", mainWindow.show);
};

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

protocol.registerSchemesAsPrivileged([
  { scheme: 'foo', privileges: { bypassCSP: true } }
])
