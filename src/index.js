console.time();

const {
  app,
  BrowserWindow,
  screen,
  protocol,
  powerSaveBlocker,
  ipcMain,
} = require("electron/main");
const path = require("node:path");

const controlFields = {
  powerSaveBlockerID: null,
};

const createWindow = () => {
  // Get the primary display's size
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: __dirname + "/img/favicon.ico",
    show: false,
    width: width,
    height: height,
    frame: true,
    transparent: true,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "spacedesk.html"));

  mainWindow.removeMenu();

  mainWindow.on("ready-to-show", console.timeEnd);
  mainWindow.on("ready-to-show", mainWindow.show);

  if (!app.isPackaged) mainWindow.webContents.openDevTools();
};

const handleSaveOptions = (_, option) => {
  const { powerSaveBlocker: powerSaveBlockerOption } = option;
  if (powerSaveBlockerOption) {
    if (controlFields["powerSaveBlockerID"] === null) {
      controlFields["powerSaveBlockerID"] = powerSaveBlocker.start(
        "prevent-display-sleep"
      );
    }
  } else {
    if (controlFields["powerSaveBlockerID"] !== null) {
      powerSaveBlocker.stop(controlFields["powerSaveBlockerID"]);
      controlFields["powerSaveBlockerID"] = null;
    }
  }
};

app.whenReady().then(() => {
  ipcMain.on("save-options", handleSaveOptions);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

protocol.registerSchemesAsPrivileged([
  { scheme: "foo", privileges: { bypassCSP: true } },
]);
