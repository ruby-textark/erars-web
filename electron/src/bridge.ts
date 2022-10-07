import { ipcMain } from "electron";
import { platform, cwd } from "node:process";
import child_process from "node:child_process";
import portfinder from "portfinder";

class Bridge {
  process?: child_process.ChildProcess;
  port?: number;

  constructor() {}

  private get executable() {
    if (platform === "win32") return "executables/erars.exe";
    return "executables/erars";
  }

  init() {
    ipcMain.handle("erars:launch", async (event, path: string) => {
      try {
        this.port = await portfinder.getPortPromise({
          port: 32767,
          stopPort: 65535,
        });

        this.process = child_process.spawn(
          this.executable,
          [path, `--port=${this.port}`],
          {
            cwd: cwd(),
            windowsHide: true,
          }
        );

        return true;
      } catch (err) {
        return false;
      }
    });

    ipcMain.handle("erars:getPort", () => {
      return this.port;
    });
  }

  cleanup() {
    this.process?.kill();
  }
}

const singletonInstance = new Bridge();
export default singletonInstance;
