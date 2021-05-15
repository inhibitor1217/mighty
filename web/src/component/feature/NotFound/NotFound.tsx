import { useMemo } from "react";

import Icon, { IconSize } from "component/base/Icon";
import Divider from "component/common/Divider";

import Styled from "./NotFound.styled";
import type NotFoundProps from "./NotFound.type";

const NotFound = ({ className, secondsUntilRedirect }: NotFoundProps) => {
  const titleElement = useMemo(
    () => (
      <>
        <Icon name="error" iconSize={IconSize.L} />
        <h3>잘못된 접근입니다.</h3>
      </>
    ),
    []
  );

  const dividerElement = useMemo(() => <Divider />, []);

  return (
    <Styled.Wrapper className={className}>
      {titleElement}
      {dividerElement}
      <span>{secondsUntilRedirect}초 후 로비로 돌아갑니다.</span>
    </Styled.Wrapper>
  );
};

export default NotFound;
