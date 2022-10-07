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

type LaunchState = "init" | "launching" | "ready" | "fail";

declare global {
  const Erars: {
    launch: () => Promise<boolean>;
    getState: () => LaunchState;
    getPort: () => Promise<number>;
  };
}

function Launch() {
  const navigate = useNavigate();
  const [launchState, setLaunchState] = useState<LaunchState>(Erars.getState());

  useEffect(() => {
    switch (launchState) {
      case "init":
        Erars.launch().then((success) => setLaunchState(Erars.getState()));
        break;
      case "ready":
        Erars.getPort().then((portNumber) => {
          connect(`localhost:${portNumber}`);
          navigate("/console");
        });
    }
  }, [launchState]);

  return (
    <LoadingBackground>
      <Title>erars-electron</Title>
      <Status>{launchState}...</Status>
    </LoadingBackground>
  );
}

export default Launch;
