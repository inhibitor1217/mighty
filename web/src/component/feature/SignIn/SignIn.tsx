import useResponsive from "../../../hook/useResponsive";
import DeskSignIn from "./SignIn.desk";
import MobileSignIn from "./SignIn.mobile";
import type SignInProps from "./SignIn.type";

const SignIn = (props: SignInProps) => {
  const Responsive = useResponsive<SignInProps>(DeskSignIn, {
    Mobile: MobileSignIn,
  });

  return <Responsive {...props} />;
};

export default SignIn;
