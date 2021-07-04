import type { FieldPolicy } from "@apollo/client";
import _ from "lodash";

export function createLocalFieldPolicy(typename: string): FieldPolicy {
  return {
    read(existing, { args, toReference }) {
      const id = _.get(args, "id");
      if (_.isEmpty(id)) {
        return null;
      }
      return toReference({ __typename: typename, id });
    },
  };
}
