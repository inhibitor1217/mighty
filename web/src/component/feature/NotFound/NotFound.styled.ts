import styled from "styled-components";

import flexbox from "styles/flexbox";
import { DefaultPalette } from "styles/palette";

const Wrapper = styled.div`
  ${flexbox("column", "center", "center")}

  h3 {
    margin-top: 8px;
  }

  span {
    color: ${DefaultPalette["txt-black-light"]};
  }
`;

const Styled = {
  Wrapper,
};

export default Styled;
