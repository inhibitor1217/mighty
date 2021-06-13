import type StyledComponentProps from "type/StyledComponent";
import type { User } from "type/graphql";

interface BannedUserInfoProps extends StyledComponentProps {
  user: User;
}

export default BannedUserInfoProps;
