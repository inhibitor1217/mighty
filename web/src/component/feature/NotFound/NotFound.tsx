import { useMemo } from "react";
import { Icon, IconSize, Text, Typography } from "@channel.io/bezier-react";

import Divider from "component/common/Divider";

import Styled from "./NotFound.styled";
import type NotFoundProps from "./NotFound.type";

const NotFound = ({ className, secondsUntilRedirect }: NotFoundProps) => {
  const titleElement = useMemo(
    () => (
      <>
        <Icon name="error" size={IconSize.L} />
        <Text bold typo={Typography.Size18} marginTop={6} color="txt-black-darkest">
          잘못된 접근입니다.
        </Text>
      </>
    ),
    []
  );

  const dividerElement = useMemo(() => <Divider />, []);

  return (
    <Styled.Wrapper className={className}>
      {titleElement}
      {dividerElement}
      <Text typo={Typography.Size14}>{secondsUntilRedirect}초 후 로비로 돌아갑니다.</Text>
    </Styled.Wrapper>
  );
};

export default NotFound;
