import Creatable from "react-select/creatable";
import useEmulatorSettings from "../../../utils/settings";
import { BuiltinFontNames, BuiltinFonts } from "../../../utils/settings/types";
import PreferencesDiv, { PreferencesText } from "./Common";

const builtinFonts = BuiltinFontNames.map((fontName) => ({
  value: fontName,
  label: fontName,
}));

function FontPreferences() {
  const emulatorSettings = useEmulatorSettings();

  return (
    <PreferencesDiv>
      Font Family
      <Creatable
        options={builtinFonts}
        defaultValue={{
          value: emulatorSettings.fontFamily,
          label: emulatorSettings.fontFamily,
        }}
        onChange={(value: { value: string | BuiltinFonts }) =>
          emulatorSettings.setFontFamily(
            value?.value ?? emulatorSettings.fontFamily
          )
        }
      />
      Font Size(px)
      <PreferencesText
        type="number"
        min="6"
        max="48"
        value={emulatorSettings.fontSize}
        onInput={({ target }: InputEvent) => {
          const fontSize = +(target as HTMLInputElement).value;
          if (6 <= fontSize && fontSize <= 24) {
            emulatorSettings.setFontSize(fontSize);
          }
        }}
      />
    </PreferencesDiv>
  );
}

export default FontPreferences;
