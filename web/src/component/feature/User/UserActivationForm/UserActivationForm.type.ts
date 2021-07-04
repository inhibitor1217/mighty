import type StyledComponentProps from "type/StyledComponent";
import type { User } from "type/graphql";

interface UserActivationFormProps extends StyledComponentProps {
  userId: User["id"];
}

export default UserActivationFormProps;
