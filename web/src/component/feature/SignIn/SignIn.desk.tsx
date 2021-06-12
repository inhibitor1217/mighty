import { Text, Typography } from "@channel.io/bezier-react";

import BI, { BIColor, BISize } from "component/base/BI";
import Divider from "component/common/Divider";

import GoogleLoginButton from "./GoogleLoginButton";
import { ReactComponent as CardSvg } from "./res/card-sign-in.svg";
import { DESK_SIGN_IN_CARD_SIZE } from "./SignIn.const";
import Styled from "./SignIn.desk.styled";
import type SignInProps from "./SignIn.type";

const SignIn = ({ className }: SignInProps) => {
  return (
    <Styled.Wrapper className={className}>
      <Styled.Title>
        <BI color={BIColor.Black} link={false} size={BISize.M} />
        <Text typo={Typography.Size18} bold>
          에 로그인하세요
        </Text>
      </Styled.Title>
      <Styled.Subtitle>
        <Text typo={Typography.Size16} color="txt-black-dark">
          로그인 후 게임을 시작하세요.
        </Text>
      </Styled.Subtitle>
      <CardSvg width={DESK_SIGN_IN_CARD_SIZE} height={DESK_SIGN_IN_CARD_SIZE} />
      <Divider />
      <Styled.LoginButtonWrapper>
        <GoogleLoginButton />
      </Styled.LoginButtonWrapper>
    </Styled.Wrapper>
  );
};

export default SignIn;
