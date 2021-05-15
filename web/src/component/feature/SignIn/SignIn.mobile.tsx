import BI, { BIColor, BISize } from "component/base/BI";
import Divider from "component/common/Divider";

import GoogleLoginButton from "./GoogleLoginButton";
import { ReactComponent as CardSvg } from "./res/card-sign-in.svg";
import { MOBILE_SIGN_IN_CARD_SIZE } from "./SignIn.const";
import Styled from "./SignIn.mobile.styled";
import type SignInProps from "./SignIn.type";

const SignIn = ({ className }: SignInProps) => {
  return (
    <Styled.Wrapper className={className}>
      <Styled.Title>
        <BI color={BIColor.Black} link={false} size={BISize.M} />
        <h3>에 로그인하세요</h3>
      </Styled.Title>
      <Styled.Subtitle>
        <span>로그인 후 게임을 시작하세요.</span>
      </Styled.Subtitle>
      <CardSvg width={MOBILE_SIGN_IN_CARD_SIZE} height={MOBILE_SIGN_IN_CARD_SIZE} />
      <Divider />
      <Styled.LoginButtonWrapper>
        <GoogleLoginButton />
      </Styled.LoginButtonWrapper>
    </Styled.Wrapper>
  );
};

export default SignIn;
