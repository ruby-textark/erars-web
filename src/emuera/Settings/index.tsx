import styled from "styled-components";

const FloatingButton = styled.div`
  position: absolute;
  top: 1em;
  right: 1em;

  padding: 0.5em;
  border-radius: 12px;

  background: lightgrey;
  color: black;
  font-size: 1.5em;
  opacity: 0.5;

  cursor: pointer;

  transition: 500ms;

  &:hover {
    opacity: 1;
  }
`;

function SettingsButton() {
  return (
    <FloatingButton>
      <i className="fa-solid fa-gear" />
    </FloatingButton>
  );
}

export default SettingsButton;
