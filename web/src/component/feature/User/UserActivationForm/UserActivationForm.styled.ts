import { styled } from "@channel.io/bezier-react";

import flexbox from "styles/flexbox";

const UserProfileAvatarWrapper = styled.div`
  margin-top: 4px;
  margin-left: 8px;
`;

const FieldsWrapper = styled.div`
  ${flexbox("column", "center", "flex-start")}

  > * + * {
    margin-top: 8px;
  }
`;

const UserProfileFormWrapper = styled.div`
  ${flexbox("column", "center", "flex-start")}

  margin-bottom: 36px;
`;

const ActionsWrapper = styled.div`
  ${flexbox("row")}

  > * + * {
    margin-left: 6px;
  }
`;

const Wrapper = styled.div`
  ${flexbox("column", "center", "flex-start")}

  ${FieldsWrapper} {
    margin-bottom: 16px;
  }
`;

const Styled = {
  UserProfileAvatarWrapper,
  FieldsWrapper,
  UserProfileFormWrapper,
  ActionsWrapper,
  Wrapper,
};

export default Styled;
