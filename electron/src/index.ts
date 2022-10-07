import { app, BrowserWindow } from "electron";
import path from "node:path";
import process, { env } from "node:process";
import bridge from "./bridge";

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
  });

  if (env.mode === "DEV") {
    win.webContents.openDevTools();
    win.loadURL("http://localhost:5173");
  } else {
    win.loadURL("resources/index.html");
  }
}

app.whenReady().then(() => {
  bridge.init();
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
    process.exit();
  }
});
