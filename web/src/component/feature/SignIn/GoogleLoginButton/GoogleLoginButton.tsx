import { useLocation } from "react-router";
import qs from "query-string";

import { googleOAuthSignInFullPath } from "api/rest/auth/OAuth";

import Styled from "./GoogleLoginButton.styled";
import type GoogleLoginButtonProps from "./GoogleLoginButton.type";

interface GoogleLoginQueryParams {
  accountSelect?: boolean;
}

const GoogleLoginButton = ({ className }: GoogleLoginButtonProps) => {
  const location = useLocation();
  const { accountSelect }: GoogleLoginQueryParams = qs.parse(location.search, {
    parseBooleans: true,
  });

  const signInPath = `${googleOAuthSignInFullPath}?${qs.stringify({ accountSelect })}`;

  return (
    <a href={signInPath}>
      <Styled.Button className={className} />
    </a>
  );
};

export default GoogleLoginButton;
