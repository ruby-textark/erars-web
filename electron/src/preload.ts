import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("Erars", {
  launch: (path: string) => ipcRenderer.invoke("erars:launch", path),
  getPort: () => ipcRenderer.invoke("erars:getPort"),
});
