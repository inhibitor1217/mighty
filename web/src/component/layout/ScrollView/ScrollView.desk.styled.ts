import styled, { css } from "styled-components";
import {
  DESK_CONTENT_WIDTH,
  SHALLOW_CONTENT_WIDTH,
  WIDE_CONTENT_WIDTH,
} from "../../../const/layout";
import flexbox from "../../../styles/flexbox";
import { GNB_DESKTOP_HEIGHT } from "../GNB/GNB.const";
import type { StyledScrollContentProps } from "./ScrollView.type";

const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - ${GNB_DESKTOP_HEIGHT}px);
  margin-top: ${GNB_DESKTOP_HEIGHT}px;
  overflow-x: hidden;
  overflow-y: auto;

  ${flexbox("column", "start")}
`;

const baseContentStyle = css<StyledScrollContentProps>`
  max-width: 100%;
  margin: auto 0;
  padding: 32px 16px;

  ${({ center }) => flexbox("column", "start", center ? "center" : "start")}
`;

const ScrollContent = styled.main<StyledScrollContentProps>`
  width: ${DESK_CONTENT_WIDTH}px;
  ${baseContentStyle}
`;

const WideScrollContent = styled.main<StyledScrollContentProps>`
  width: ${WIDE_CONTENT_WIDTH}px;
  ${baseContentStyle}
`;

const ShallowScrollContent = styled.main<StyledScrollContentProps>`
  width: ${SHALLOW_CONTENT_WIDTH}px;
  ${baseContentStyle}
`;

const Styled = {
  ScrollContainer,
  ScrollContent,
  WideScrollContent,
  ShallowScrollContent,
};

export default Styled;
