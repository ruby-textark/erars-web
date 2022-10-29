import styled from "styled-components";
import useEra from "../../utils/erars/hooks";
import { ButtonType, Color, TextStyle } from "../../utils/erars/types";
import TextPart from "./Text";

const Button = styled.span<{
  hl_color: Color;
}>`
  &.active span:hover {
    cursor: pointer;
    color: rgb(${({ hl_color }) => hl_color.join(",")});
  }
`;

function ButtonPart({
  part,
  active = false,
}: {
  part: ButtonType;
  active?: boolean;
}) {
  const era = useEra();
  const [segements, _, value] = part;

  return (
    <Button
      className={active && "active"}
      hl_color={era.hl_color}
      onClick={() => {
        era.sendInput(value.Int ?? value.String ?? "");
      }}
    >
      {segements.map((text, textIdx) => {
        return <TextPart key={textIdx} part={text} />;
      })}
    </Button>
  );
}

export default ButtonPart;
