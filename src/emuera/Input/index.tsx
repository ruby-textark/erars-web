import { useState } from "react";
import styled from "styled-components";
import { useEra } from "../../utils/erars/bridge";

const FloatingInput = styled.input<{ active: boolean }>`
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

  transition: 500ms;

  &:hover {
    opacity: 1;
  }

  ${({ active }) => !active && `opacity: 0 !important`};
`;

function EmueraInput() {
  const era = useEra();
  const [inputValue, setInputValue] = useState("");

  return (
    <FloatingInput
      active={era.current_req?.ty === "Int" || era.current_req?.ty === "Str"}
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
