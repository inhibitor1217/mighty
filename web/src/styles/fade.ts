import { css } from "styled-components";

export interface StyledFadeProps {
  show: boolean;
}

const fadeStyle = css<StyledFadeProps>`
  opacity: ${({ show }) => (show ? 1 : 0)};

  transition: opacity 2s ease;
`;

export default fadeStyle;
