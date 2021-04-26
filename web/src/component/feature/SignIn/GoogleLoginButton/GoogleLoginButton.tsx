import Styled from "./GoogleLoginButton.styled";
import GoogleLoginButtonProps from "./GoogleLoginButton.type";

const GoogleLoginButton = ({ className }: GoogleLoginButtonProps) => {
  return <Styled.Button className={className} />;
};

export default GoogleLoginButton;
