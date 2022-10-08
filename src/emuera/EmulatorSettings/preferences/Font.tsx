import Creatable from "react-select/creatable";
import styled from "styled-components";
import useEmulatorSettings from "../../../utils/settings";
import { BuiltinFontNames } from "../../../utils/settings/types";

const PreferencesDiv = styled.div`
  display: flex;
  flex-direction: column;

  gap: 1em;
`;
const FontSizeInput = styled.input`
  background-color: white;
  color: black;

  border: 1px solid lightgrey;
  border-radius: 4px;

  padding: 0.75em;
  margin-right: 2px;
`;

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
        onChange={(value) =>
          emulatorSettings.setFontFamily(
            value?.value ?? emulatorSettings.fontFamily
          )
        }
      />
      Font Size
      <FontSizeInput
        type="number"
        min="6"
        max="48"
        value={emulatorSettings.fontSize}
        onInput={({ target }) => {
          const fontSize = +(target as HTMLInputElement).value;
          if (6 <= fontSize && fontSize <= 24) {
            emulatorSettings.setFontSize(fontSize);
          }
        }}
      />
      px
    </PreferencesDiv>
  );
}

export default FontPreferences;
