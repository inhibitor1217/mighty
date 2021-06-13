import { Icon, IconSize, Text, Typography } from "@channel.io/bezier-react";
import _ from "lodash";

import type ErrorProps from "./Error.type";
import Styled from "./Error.styled";

const Error = ({ className, error }: ErrorProps) => {
  return (
    <Styled.Wrapper className={className}>
      <Icon name="error" size={IconSize.XL} color="txt-black-dark" />
      <Styled.RightWrapper>
        <Text typo={Typography.Size18} bold color="txt-black-darker">
          문제가 발생했습니다.
        </Text>
        <Text typo={Typography.Size13} marginTop={4} color="txt-black-dark">
          Error Code: {_.get(error, "networkError.statusCode", -1)}
        </Text>
      </Styled.RightWrapper>
    </Styled.Wrapper>
  );
};

export default Error;
