import useEmulatorSettings from "../../../utils/settings";
import PreferencesDiv, { PreferencesCheck } from "./Common";

function InputPreferences() {
  const emulatorSettings = useEmulatorSettings();
  return (
    <PreferencesDiv>
      <div>
        <PreferencesCheck
          id="arrow-input"
          checked={emulatorSettings.arrowInput}
          onChange={({ target }: InputEvent) => {
            emulatorSettings.setArrowInput(
              (target as HTMLInputElement).checked
            );
          }}
        />
        <label htmlFor="dir-input">Direction Input</label>
      </div>
    </PreferencesDiv>
  );
}

export default InputPreferences;
