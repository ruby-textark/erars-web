import styled from "styled-components";
import Console from "./emuera/Console";
import { HashRouter, Routes, Route } from "react-router-dom";

const FullscreenApp = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: transparent;
`;

function App() {
  return (
    <FullscreenApp>
      <HashRouter>
        <Routes>
          <Route index path="/" element={<Console />} />
        </Routes>
      </HashRouter>
    </FullscreenApp>
  );
}

export default App;
