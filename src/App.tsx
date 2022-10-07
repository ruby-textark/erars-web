import styled from "styled-components";
import Console from "./emuera/Console";
import { HashRouter, Routes, Route } from "react-router-dom";
import Launch from "./emuera/Launch";

const FullscreenApp = styled.div`
  display: flex;
  flex: 1;
`;

function App() {
  return (
    <FullscreenApp>
      <HashRouter>
        <Routes>
          <Route index path="/" element={<Launch />} />
          <Route path="/console" element={<Console />} />
        </Routes>
      </HashRouter>
    </FullscreenApp>
  );
}

export default App;
