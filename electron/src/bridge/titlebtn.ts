import { BrowserWindow, ipcMain } from "electron";
import { Bridge } from "./bridge";

class TitleButton implements Bridge {
  init(win: BrowserWindow) {
    ipcMain.on("titlebtn:ismaximized", (e) => {
      e.returnValue = win.isMaximized();
    });

    ipcMain.handle("titlebtn:minimize", () => {
      win.minimize();
    });

    ipcMain.handle("titlebtn:togglemaximize", () => {
      if (win.isMaximized()) {
        win.restore();
      } else {
        win.maximize();
      }
    });

    ipcMain.handle("titlebtn:close", () => {
      win.close();
    });
  }
}

const singletonInstance = new TitleButton();
export default singletonInstance;
