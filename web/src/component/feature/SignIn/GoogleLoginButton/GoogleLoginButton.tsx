import { googleOauthSignIn } from "api/auth/OAuth";

import Styled from "./GoogleLoginButton.styled";
import type GoogleLoginButtonProps from "./GoogleLoginButton.type";

const GoogleLoginButton = ({ className }: GoogleLoginButtonProps) => {
  return (
    <a href={googleOauthSignIn}>
      <Styled.Button className={className} />
    </a>
  );
};

export default GoogleLoginButton;
