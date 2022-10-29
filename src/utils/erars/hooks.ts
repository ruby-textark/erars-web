import create from "zustand";
import { EmueraResponse, EmueraState, FontStyleBit } from "./types";
import bridge from "./bridge";

const useEra = create<EmueraState>((set, get) => ({
  current_req: {
    generation: 0,
    is_one: false,
    ty: "AnyKey",
  },
  bg_color: [0, 0, 0],
  hl_color: [255, 255, 0],
  lines: [],
  exited: false,

  maxLines: 2000,

  update: async () => {
    try {
      const resp = await bridge.stdoutStream.read();
      console.log(resp);

      const { maxLines, update } = get();

      // Trim empty lines.
      const responseLines = resp.lines
        .filter((line) => {
          return line.parts !== undefined;
        })
        .map((line) => ({ ...line, active: true }));

      set({
        ...resp,
        lines: responseLines,
      });

      // Slice lines if the length exceeds max line cap.
      if (responseLines.length > maxLines)
        set({ lines: responseLines.slice(responseLines.length - maxLines) });

      update();
    } catch (err) {
      alert(err);
    }
  },

  sendInput: (input: string | number) => {
    const { lines, current_req } = get();
    set({
      lines: lines
        .concat([
          {
            parts: [
              {
                Text: [
                  input.toString(),
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

    if (current_req?.ty === "Int") {
      bridge.stdinStream.write(input);
    } else bridge.stdinStream.write(input);
  },
}));

export default useEra;
