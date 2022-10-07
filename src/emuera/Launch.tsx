import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { connect } from "../utils/erars/bridge";

const LoadingBackground = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  color: white;
  margin: auto;
`;
const Status = styled.p`
  color: white;
  margin: auto;
`;

declare global {
  const Erars: {
    launch: (path: string) => Promise<any>;
    getPort: () => Promise<number>;
  };
}

type LaunchState = "launching" | "launched" | "ready";

function Launch() {
  const navigate = useNavigate();
  const [launchState, setLaunchState] = useState<LaunchState>("launching");

  useEffect(() => {
    switch (launchState) {
      case "launching":
        Erars.launch("./eraTHYMKR").then(() => setLaunchState("launched"));
        break;
      case "launched":
        Erars.getPort().then((portNumber) => {
          connect(`localhost:${portNumber}`);
          navigate("/console");
        });
    }
  }, [launchState]);
  return (
    <LoadingBackground>
      <Title>erars-electron</Title>
      <Status>{launchState}</Status>
    </LoadingBackground>
  );
}

export default Launch;
