import { ipcMain, dialog } from "electron";
import { platform, cwd, env } from "node:process";
import child_process from "node:child_process";
import portfinder from "portfinder";
import { Bridge } from "./bridge";

class ErarsBridge implements Bridge {
  path?: string;
  process?: child_process.ChildProcess;
  port?: number;
  state: "init" | "launching" | "ready" | "fail";

  constructor() {
    this.state = "init";
  }

  private get executable() {
    if (platform === "win32") return "executables/erars.exe";
    return "executables/erars";
  }

  async retrievePort() {
    try {
      portfinder.setBasePort(32767);
      portfinder.setHighestPort(65535);
      this.port = await portfinder.getPortPromise();
    } catch (err) {
      this.state = "fail";
    }
  }

  async setupPath() {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory", "dontAddToRecent"],
    });

    if (result.canceled) throw new Error("Dialog closed");
    [this.path] = result.filePaths;
  }

  init() {
    ipcMain.on("erars:getState", (event) => {
      event.returnValue = this.state;
    });

    ipcMain.handle("erars:launch", async () => {
      if (this.state === "launching") {
        return false;
      }

      this.state = "launching";
      try {
        await Promise.all([this.retrievePort(), this.setupPath()]);

        this.process = child_process.spawn(
          this.executable,
          [this.path ?? "", `--port=${this.port}`].concat(
            env.mode === "DEV" ? [`--log-level=trace`] : []
          ),
          {
            cwd: cwd(),
            windowsHide: true,
          }
        );

        this.state = "ready";
        return true;
      } catch (err) {
        this.state = "fail";
        return false;
      }
    });

    ipcMain.handle("erars:getPort", () => {
      return this.port;
    });
  }
}

const singletonInstance = new ErarsBridge();
export default singletonInstance;
