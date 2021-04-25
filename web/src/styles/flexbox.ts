import { css } from "styled-components";

function flexbox(
  direction: "row" | "column",
  justifyContent: "start" | "end" | "center" = "center",
  alignItems: "start" | "end" | "center" = "center"
) {
  return css`
    display: flex;
    flex-direction: ${direction};
    justify-content: ${justifyContent};
    align-items: ${alignItems};
  `;
}

export default flexbox;
