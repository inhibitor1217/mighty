import { styled } from "@channel.io/bezier-react";

import flexbox from "styles/flexbox";

const Line = styled.div`
  flex: 1;
  height: 1px;
  margin: 0 8px;
  background-color: ${({ foundation }) => foundation?.theme?.["bdr-grey-light"]};
`;

const CenterCircle = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ foundation }) => foundation?.theme?.["bdr-grey-light"]};
`;

const Wrapper = styled.div`
  width: 240px;
  margin: 16px 0;

  ${flexbox("row", "center", "center")}
`;

const Styled = {
  Line,
  CenterCircle,
  Wrapper,
};

export default Styled;
