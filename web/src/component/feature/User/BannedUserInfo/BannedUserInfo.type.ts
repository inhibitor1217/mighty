import type StyledComponentProps from "type/StyledComponent";
import type { User } from "type/graphql";

interface BannedUserInfoProps extends StyledComponentProps {
  userId: User["id"];
}

export default BannedUserInfoProps;
