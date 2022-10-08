import { useEffect, useRef } from "react";
import styled from "styled-components";
import SettingsButton from ".";
import useEmulatorSettings from "../../utils/settings";
import FontPreferences from "./preferences/Font";

const ModalDialog = styled.dialog`
  background: white;
  color: black;

  font-family: Monoplex;
`;

const DialogTitle = styled.h1`
  font-size: 1.5em;
`;

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

function EmulatorSettingsDialog() {
  const emulatorSettings = useEmulatorSettings();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (emulatorSettings.dialogOpen) {
      if (!dialogRef.current?.open) dialogRef.current?.showModal();
    } else {
      if (dialogRef.current?.open) dialogRef.current?.close();
    }
  }, [emulatorSettings.dialogOpen]);

  return (
    <>
      <SettingsButton />
      <ModalDialog ref={dialogRef}>
        <DialogContent>
          <DialogTitle>Emulator Settings</DialogTitle>
          <FontPreferences />
          <button onClick={() => emulatorSettings.dialog(false)}>Close</button>
        </DialogContent>
      </ModalDialog>
    </>
  );
}

export default EmulatorSettingsDialog;