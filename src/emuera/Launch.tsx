import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { connect } from "../utils/erars/bridge";

const LoadingBackground = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  color: white;
  margin: auto;
`;

const Title = styled.h1`
  font-size: 3em;
`;
const Status = styled.p`
  text-align: center;
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
        Erars.launch().then(() => setLaunchState(Erars.getState()));
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
      <Wrapper>
        <Title>erars-electron</Title>
        <Status>{launchState}...</Status>
      </Wrapper>
    </LoadingBackground>
  );
}

export default Launch;
