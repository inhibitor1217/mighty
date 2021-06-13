import type StyledComponentProps from "type/StyledComponent";
import type { User } from "type/graphql";

interface DeletedUserInfoProps extends StyledComponentProps {
  user: User;
}

export default DeletedUserInfoProps;
