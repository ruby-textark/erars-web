import create from "zustand";
import { EmulatorSettings } from "./types";

const useEmulatorSettings = create<EmulatorSettings>((set) => ({
  fontFamily: "Monoplex",
  fontSize: 16,
  fauxRender: true,

  setFontFamily: (fontFamily: string) => set({ fontFamily }),
  setFontSize: (fontSize: number) => set({ fontSize }),
  setFauxRender: (fauxRender: boolean) => set({ fauxRender }),

  dialogOpen: false,

  dialog: (dialogOpen: boolean) => {
    set({ dialogOpen });
  },
}));

export default useEmulatorSettings;
