import { googleOAuthSignInFullPath } from "api/rest/auth/OAuth";

import Styled from "./GoogleLoginButton.styled";
import type GoogleLoginButtonProps from "./GoogleLoginButton.type";

const GoogleLoginButton = ({ className }: GoogleLoginButtonProps) => {
  return (
    <a href={googleOAuthSignInFullPath}>
      <Styled.Button className={className} />
    </a>
  );
};

export default GoogleLoginButton;
