import { EmueraResponse, EmueraState, FontStyleBit } from "./types";
import create from "zustand";
import { useEffect, useState } from "react";

type Host = {
  http: string;
  webSocket: string;
};

class Bridge {
  host?: Host;
  socket?: WebSocket;
  maxLines: number;
  fallbackTimeout: number;
  fallbackHandle?: NodeJS.Timeout;

  constructor() {
    this.maxLines = 2000;
    this.fallbackTimeout = 5000;
  }

  connect = (host: string) => {
    this.host = {
      http: `http://${host}`,
      webSocket: `ws://${host}`,
    };

    this.connectWebSocket();
  };

  private connectWebSocket = () => {
    this.socket = new WebSocket(`${this.host?.webSocket}/listen`);
  };

  useUpdate = () => {
    const [updateFlag, setUpdateFlag] = useState(true);

    useEffect(() => {
      if (!this.socket) {
        throw new Error("useUpdate() must be called after connect()");
      }

      this.socket?.addEventListener("message", (e) => {
        if (this.fallbackHandle) {
          clearInterval(this.fallbackHandle);
        }
        setUpdateFlag(true);
      });
    }, []);

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

    from: 0,

    getState: async () => {
      const { lines, from } = get();

      // Request after current line number.
      const resp = await fetch(`${this.host?.http}/?from=${from}`, {
        method: "GET",
      })
        .then((resp) => resp.json())
        .then((json) => json as EmueraResponse);

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

      await fetch(`${this.host?.http}/input`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: input,
      });

      if (this.fallbackHandle) {
        clearTimeout(this.fallbackHandle);
      }
      this.fallbackHandle = setInterval(() => {
        getState();
      }, this.fallbackTimeout);
    },
  }));
}

const singletonInstance = new Bridge();
export const { useEra, useUpdate, connect } = singletonInstance;
export default singletonInstance;
