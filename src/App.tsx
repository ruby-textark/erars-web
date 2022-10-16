import styled from "styled-components";
import Console from "./emuera/Console";
import { HashRouter, Routes, Route } from "react-router-dom";
import Titlebar from "./Titlebar";

const FullscreenApp = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: transparent;
`;

function App() {

  return (
    <FullscreenApp>
      <Titlebar />
      <HashRouter>
        <Routes>
          <Route index path="/console" element={<Console />} />
        </Routes>
      </HashRouter>
    </FullscreenApp>
  );
}

export default App;
