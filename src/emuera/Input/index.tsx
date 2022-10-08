import { useState } from "react";
import styled from "styled-components";
import { useEra } from "../../utils/erars/bridge";

const FloatingInput = styled.input`
  position: absolute;
  left: 1em;
  right: 2em;
  bottom: 1em;

  padding: 1em;
  border: none;
  border-radius: 12px;

  background: lightgrey;
  color: black;
  font-weight: bold;
  opacity: 0.5;
  user-select: none;

  transition: 500ms;

  &:hover {
    opacity: 1;
  }

  &:disabled {
    opacity: 0 !important;
  }
`;

function EmueraInput() {
  const era = useEra();
  const [inputValue, setInputValue] = useState("");

  return (
    <FloatingInput
      disabled={
        era.current_req?.ty === "AnyKey" || era.current_req?.ty === "EnterKey"
      }
      value={inputValue}
      onInput={({ target }) =>
        setInputValue((target as HTMLInputElement).value)
      }
      onKeyDown={({ key }) => {
        if (key === "Enter") {
          era.sendInput(inputValue).then(() => setInputValue(""));
        }
      }}
    />
  );
}

export default EmueraInput;
