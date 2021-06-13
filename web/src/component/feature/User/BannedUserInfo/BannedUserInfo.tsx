import { UserState } from "type/graphql";
import assert from "util/assert";

import type BannedUserInfoProps from "./BannedUserInfo.type";

const BannedUserInfo = ({ className, user }: BannedUserInfoProps) => {
  assert(user.state === UserState.Banned);

  return <div className={className}>{JSON.stringify(user)}</div>;
};

export default BannedUserInfo;
