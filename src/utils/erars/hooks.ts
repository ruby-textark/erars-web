import create from "zustand";
import { EmueraInputResponse, EmueraStore, FontStyleBit } from "./types";
import bridge from "./bridge";

const useEra = create<EmueraStore>((set, get) => ({
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
    while (true) {
      try {
        // Request after current line number.
        const resp = await bridge.stdoutStream.read();
        const { lines, maxLines } = get();

        console.log(resp);

        if (Object.hasOwn(resp, "ty")) {
          set({
            current_req: resp as EmueraInputResponse,
          });
          continue;
        }

        resp.last_line = resp.last_line ?? undefined;

        if (resp.rebuild === true) {
          set(resp);
        } else {
          // Trim empty lines.
          const responseLines =
            resp.lines?.filter(({ parts }) => parts !== undefined) ?? [];

          // Concatenate with existing lines.
          let accLines = lines.concat(
            responseLines
              // Activate new lines
              .map((line) => ({ ...line, active: true }))
          );

          // Slice lines if the length exceeds max line cap.
          if (accLines.length > maxLines)
            accLines = accLines.slice(accLines.length - maxLines);

          set({
            ...resp,
            lines: accLines,
          });
        }
      } catch (err) {
        alert(err);
      }
    }
  },

  sendInput: (input: string | number = "") => {
    const { lines, current_req } = get();
    set({
      lines: lines.concat([
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
      ]),
    });

    if (current_req?.ty === "Int") {
      bridge.stdinStream.write(BigInt(input) as bigint);
    } else bridge.stdinStream.write(input as string);
  },
}));

export default useEra;
