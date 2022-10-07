import { useEffect, useRef } from "react";
import styled from "styled-components";
import { useEra, useUpdate } from "../utils/erars/bridge";
import ConsoleLineElement from "./ConsoleLine";
import EmueraInput from "./Input";
import SettingsButton from "./Settings";

const EmueraBackground = styled.div<{ bg_color: [number, number, number] }>`
  flex: 1;
  background-color: rgb(${({ bg_color }) => bg_color.join(",")});
  margin-left: 1em;
  height: 100%;

  display: flex;
  flex-direction: column;
  overflow-y: auto;

  font-family: D2Coding, monospace, ui-monospace;
  & p {
    margin: 0;
  }

  &::-webkit-scrollbar,
  &::-webkit-scrollbar-thumb {
    width: 1.5em;
    border-radius: 1em;
    background-clip: padding-box;
    border: 0.5em solid transparent;
    color: #ffffffaa;
  }

  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 0 10px;
  }

  transition: color 0.5s ease;

  & *:first-child {
    margin-top: auto;
  }
`;

const BottomPadding = styled.div`
  line-height: 4em;
`;

function Console() {
  const era = useEra();
  const { updateFlag, clearFlag } = useUpdate();
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (updateFlag) era.getState().then(() => clearFlag());
  }, [updateFlag]);

  useEffect(() => {
    displayRef.current?.scrollTo({
      behavior: "auto",
      top: displayRef.current?.scrollHeight,
    });
  }, [era.lines]);

  return (
    <EmueraBackground
      ref={displayRef}
      bg_color={era.bg_color}
      onClick={() => {
        if (
          era.current_req?.ty === "AnyKey" ||
          era.current_req?.ty === "EnterKey"
        ) {
          era.sendInput("");
        }
      }}
    >
      {era.lines.map((line, idx) => {
        const lineNo = idx + era.from;
        return <ConsoleLineElement key={lineNo} line={line} />;
      })}
      <BottomPadding>&nbsp;</BottomPadding>
      <EmueraInput />
      <SettingsButton />
    </EmueraBackground>
  );
}

export default Console;
