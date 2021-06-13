import { UserState } from "type/graphql";
import assert from "util/assert";

import type DeletedUserInfoProps from "./DeletedUserInfo.type";

const DeletedUserInfo = ({ className, user }: DeletedUserInfoProps) => {
  assert(user.state === UserState.Deleted);

  return <div className={className}>{JSON.stringify(user)}</div>;
};

export default DeletedUserInfo;
