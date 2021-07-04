import _ from "lodash";

import type { UserProfile } from "type/graphql";
import { parseServerError } from "util/serverError";

import { defaultFormPreset } from "./default";
import { FormPreset } from "./type";

export interface UserProfileFormValues
  extends Pick<UserProfile, "displayName" | "email" | "photo"> {}

const userProfile: FormPreset<UserProfileFormValues> = {
  ...defaultFormPreset,
  validate(values) {
    const errors = {};

    if (_.isEmpty(values.displayName)) {
      _.set(errors, "displayName", "비워둘 수 없습니다.");
    }

    if (values.displayName.length > 24) {
      _.set(errors, "displayName", "24자 이하여야 합니다.");
    }

    return errors;
  },
};

export const helpers = {
  parseError: parseServerError,
};

export default userProfile;
