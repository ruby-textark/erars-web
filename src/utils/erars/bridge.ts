import { EmueraResponse, EmueraState, FontStyleBit } from "./types";
import create from "zustand";
import { useEffect, useState } from "react";
import JSZip from "jszip";

// This doesn't work WTF
//
// import { ErarsContext, init_logger } from "erars-wasm";
import {
  ErarsContext,
  init_logger,
} from "../../../node_modules/erars-wasm/erars_wasm";

class Bridge {
  maxLines: number;
  erarsContext: ErarsContext;

  constructor(erarsContext: ErarsContext) {
    this.maxLines = 2000;
    this.erarsContext = erarsContext;
  }

  useUpdate = () => {
    const [updateFlag, setUpdateFlag] = useState(true);
    return { updateFlag, clearFlag: () => setUpdateFlag(false) };
  };

  useEra = create<EmueraState>((set, get) => ({
    current_req: {
      generation: 0,
      is_one: false,
      ty: "AnyKey",
    },
    bg_color: [0, 0, 0],
    hl_color: [255, 255, 0],
    lines: [],
    exited: false,

    from: 0,

    getState: async () => {
      const { lines, from } = get();

      try {
        const resp = this.erarsContext.run(from) as EmueraResponse;
        console.log(resp);

        // Trim empty lines.
        const responseLines = resp.lines.filter((line) => {
          return line.parts !== undefined;
        });

        // Concatenate with existing lines.
        const accLines = lines.concat(
          responseLines
            // Activate new lines
            .map((line) => ({ ...line, active: true }))
        );

        set({
          ...resp,
          lines: accLines,
          from: from + responseLines.length,
        });

        // Slice lines if the length exceeds max line cap.
        if (accLines.length > this.maxLines)
          set({ lines: accLines.slice(accLines.length - this.maxLines) });

        return resp;
      } catch (err) {
        alert(err);
        return {} as EmueraResponse;
      }
    },

    sendInput: async (input: string) => {
      const { lines, getState } = get();
      set({
        lines: lines
          .concat([
            {
              parts: [
                {
                  Text: [
                    input,
                    {
                      color: [255, 255, 255],
                      font_family: "",
                      font_style: { bits: FontStyleBit.NORMAL },
                    },
                  ],
                },
              ],
            },
          ])
          // Deactive existing lines
          .map((line) => ({ ...line, active: false })),
      });

      this.erarsContext?.set_input(input);
      getState();
    },
  }));
}

init_logger();

const rawGame = await fetch("game.zip").then((r) => r.arrayBuffer());
const gameZip = await JSZip.loadAsync(rawGame);
const gameFile = await gameZip.file("game.era")!.async("uint8array");

const config = await fetch("emuera.config").then((r) => r.text());

const erarsContext = new ErarsContext(new Uint8Array(gameFile), config);
console.log("Load game done.");
const singletonInstance = new Bridge(erarsContext);

export const { useEra, useUpdate } = singletonInstance;
export default singletonInstance;
