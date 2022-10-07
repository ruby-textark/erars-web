import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("Erars", {
  launch: () => ipcRenderer.invoke("erars:launch"),
  getState: () => ipcRenderer.sendSync("erars:getState"),
  getPort: () => ipcRenderer.invoke("erars:getPort"),
});
