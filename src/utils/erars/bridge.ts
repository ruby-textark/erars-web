import { EmueraResponse } from "./types";
import JSZip from "jszip";
import localforage from "localforage";

// This doesn't work WTF
//
// import { ErarsContext, init_logger } from "erars-wasm";
import {
  ErarsContext,
  init_logger,
} from "../../../node_modules/erars-wasm/erars_wasm";
import Stream from "./stream";

type SaveData = string;
type LoadSaveResult = SaveData | null;

class Bridge {
  maxLines: number;
  erarsContext: ErarsContext;

  stdinStream: Stream<string | number>;
  stdoutStream: Stream<EmueraResponse>;

  constructor(eraFile: Uint8Array, configText: string) {
    this.maxLines = 2000;
    this.erarsContext = new ErarsContext(eraFile, configText, this);

    this.stdinStream = new Stream();
    this.stdoutStream = new Stream();

    this.erarsContext.run();
  }

  async input(console: EmueraResponse): Promise<string | number> {
    this.stdoutStream.write(console);
    const resp = await this.stdinStream.read();

    window.console.log(resp);

    return resp;
  }
  async redraw(console: any) {
    this.stdoutStream.write(console);
  }

  async load_local(idx: number) {
    return await localforage.getItem<LoadSaveResult>(`save:local:${idx}`);
  }
  async load_global() {
    return await localforage.getItem<LoadSaveResult>(`save:global`);
  }

  async save_local(idx: number, sav: SaveData) {
    await localforage.setItem(`save:local:${idx}`, sav);
  }
  async save_global(sav: SaveData) {
    await localforage.setItem(`save:global`, sav);
  }

  async remove_local(idx: number) {
    return await localforage.removeItem(`save:local:${idx}`);
  }
}

init_logger();

const rawGame = await fetch("game.zip").then((r) => r.arrayBuffer());
const gameZip = await JSZip.loadAsync(rawGame);
const gameFile = await gameZip.file("game.era")!.async("uint8array");

const config = await fetch("emuera.config").then((r) => r.text());

console.log("Load game done.");
const singletonInstance = new Bridge(gameFile, config);

export default singletonInstance;
