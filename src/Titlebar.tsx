import { useEffect, useState } from "react";
import styled from "styled-components";

const TitlebarContent = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;

  background-color: #aaaaaacc;

  display: flex;

  transition: 500ms;

  opacity: 0.5;

  &.active,
  &:has(> div:hover) {
    opacity: 1;
  }
`;

const TitleText = styled.p`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;

  margin: 0;
  padding: 0.5em;
  text-align: center;

  color: white;

  transition: 500ms;
`;

const DragArea = styled.div`
  flex: 1;
  -webkit-app-region: drag;
`;

const TitleButtonArea = styled.div`
  display: flex;

  z-index: 999;
`;

const NormalButton = styled.div`
  padding: 0.5em 1em;
  color: black;
  transition: 500ms;
  &:hover {
    color: white;
    background-color: black;
  }
`;

const CloseButton = styled.div`
  padding: 0.5em 1em;
  color: black;
  transition: 500ms;
  &:hover {
    color: white;
    background-color: red;
  }
`;

declare global {
  const TitleButton: {
    isMaximized: () => boolean;
    minimize: () => Promise<void>;
    toggleMaximize: () => Promise<void>;
    close: () => Promise<void>;
  };
}

function Titlebar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [titlebarActive, setTitlebarActive] = useState<"active" | "blur">(
    "blur"
  );

  useEffect(() => {
    window.addEventListener("mouseover", () => setTitlebarActive("blur"));
    window.addEventListener("mouseout", () => setTitlebarActive("active"));
  }, []);

  return (
    <TitlebarContent className={titlebarActive}>
      <DragArea />
      <TitleText className={titlebarActive}>{document.title}</TitleText>
      <TitleButtonArea>
        <NormalButton onClick={() => TitleButton.minimize()}>
          <i className="fa-regular fa-window-minimize" />
        </NormalButton>
        <NormalButton
          onClick={() =>
            TitleButton.toggleMaximize().then(() =>
              setIsMaximized(TitleButton.isMaximized())
            )
          }
        >
          {isMaximized ? (
            <i className="fa-regular fa-window-restore" />
          ) : (
            <i className="fa-regular fa-window-maximize" />
          )}
        </NormalButton>

        <CloseButton onClick={() => TitleButton.close()}>
          <i className="fa-regular fa-xmark" />
        </CloseButton>
      </TitleButtonArea>
    </TitlebarContent>
  );
}

export default Titlebar;
