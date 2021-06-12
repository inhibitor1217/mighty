import { styled } from "@channel.io/bezier-react";

import flexbox from "styles/flexbox";
import { GNB_MOBILE_HEIGHT } from "component/layout/GNB";

import type { StyledScrollContentProps } from "./ScrollView.type";

const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - ${GNB_MOBILE_HEIGHT}px);
  margin-top: ${GNB_MOBILE_HEIGHT}px;
  overflow-x: hidden;
  overflow-y: auto;

  ${flexbox("column", "flex-start")}
`;

const ScrollContent = styled.main<StyledScrollContentProps>`
  width: 100%;
  margin: auto 0;
  padding: 16px;

  ${({ center }) => flexbox("column", "flex-start", center ? "center" : "flex-start")}
`;

const Styled = {
  ScrollContainer,
  ScrollContent,
};

export default Styled;
