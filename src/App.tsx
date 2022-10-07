import styled from "styled-components";
import Console from "./emuera/Console";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Launch from "./emuera/Launch";

const FullscreenApp = styled.div`
  display: flex;
  flex: 1;
`;

function App() {
  return (
    <FullscreenApp>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Launch />} />
          <Route path="/console" element={<Console />} />
        </Routes>
      </BrowserRouter>
    </FullscreenApp>
  );
}

export default App;
