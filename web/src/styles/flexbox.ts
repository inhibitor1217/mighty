import { css } from "@channel.io/bezier-react";

function flexbox(
  direction: "row" | "column",
  justifyContent: "flex-start" | "flex-end" | "center" = "center",
  alignItems: "flex-start" | "flex-end" | "center" = "center"
) {
  return css`
    display: flex;
    flex-direction: ${direction};
    justify-content: ${justifyContent};
    align-items: ${alignItems};
  `;
}

export default flexbox;
