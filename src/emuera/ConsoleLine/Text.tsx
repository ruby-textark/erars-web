import styled from "styled-components";
import type { TextType, TextStyle } from "../../utils/erars/types";
import { FontStyleBit } from "../../utils/erars/types";

function checkStyle(textStyle: TextStyle, flag: FontStyleBit, value: string) {
  return textStyle.font_style?.bits & flag ? value : undefined;
}

const Text = styled.p<{
  textStyle: TextStyle;
}>`
  color: rgb(${({ textStyle }) => textStyle.color.join(",")});
  font-family: ${({ textStyle }) => textStyle.font_family};
  font-weight: ${({ textStyle }) =>
    checkStyle(textStyle, FontStyleBit.BOLD, "bold") ?? "normal"};
  font-style: ${({ textStyle }) =>
    checkStyle(textStyle, FontStyleBit.ITALIC, "italic") ?? "normal"};
  text-decoration: ${({ textStyle }) =>
    [
      checkStyle(textStyle, FontStyleBit.STRIKELINE, "line-through") ?? "",
      checkStyle(textStyle, FontStyleBit.UNDERLINE, "underline") ?? "",
    ].join(" ")};
`;

function TextPart({ part }: { part: TextType }) {
  const [textContent, textStyle] = part;
  return (
    <Text textStyle={textStyle}>{textContent.replace(/ /g, "\u00A0")}</Text>
  );
}

export default TextPart;
