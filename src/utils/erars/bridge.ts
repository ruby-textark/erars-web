import { EmueraResponse, EmueraState, FontStyleBit } from "./types";
import create from "zustand";
import { useEffect, useState } from "react";

import { ErarsContext, init_logger } from "erars-wasm";

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

      const resp = JSON.parse(this.erarsContext.run(from)) as EmueraResponse;

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
    },
  }));
}

init_logger();

const game = await fetch("game.era").then(r => r.arrayBuffer());
const config = await fetch("emuera.config").then(r => r.text());

const erarsContext = new ErarsContext(new Uint8Array(game), config);
console.log("Load game done.");
const singletonInstance = new Bridge(erarsContext);

export const { useEra, useUpdate } = singletonInstance;
export default singletonInstance;
