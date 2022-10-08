import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("Erars", {
  launch: () => ipcRenderer.invoke("erars:launch"),
  getState: () => ipcRenderer.sendSync("erars:getState"),
  getPort: () => ipcRenderer.invoke("erars:getPort"),
});

contextBridge.exposeInMainWorld("TitleButton", {
  isMaximized: () => ipcRenderer.sendSync("titlebtn:ismaximized"),
  minimize: () => ipcRenderer.invoke("titlebtn:minimize"),
  toggleMaximize: () => ipcRenderer.invoke("titlebtn:togglemaximize"),
  close: () => ipcRenderer.invoke("titlebtn:close"),
});
