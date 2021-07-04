import { gql, useMutation } from "@apollo/client";
import { useCallback } from "react";

import { userProfile } from "api/rest/user/profile";
import type { UserProfileFormValues } from "core/form";
import type { Mutation, MutationUpdateUserProfileArgs, User } from "type/graphql";

const UPDATE_USER_PROFILE_MUTATION = gql`
  mutation UpdateUserProfile($userId: ID!, $input: UpdateUserProfileInput!) {
    updateUserProfile(userId: $userId, input: $input) @rest(path: "${userProfile(
      "{args.userId}"
    )}", method: PATCH, bodyKey: "input") {
      users @type(name: "User") {
        id
        profile @type(name: "UserProfile") {
          id
          updatedAt
          displayName
        }
      }
    }
  }
`;

function useUpdateUserProfile(userId: User["id"]) {
  const [updateUserProfile] = useMutation<Mutation, MutationUpdateUserProfileArgs>(
    UPDATE_USER_PROFILE_MUTATION
  );

  const doUpdate = useCallback(
    (values: UserProfileFormValues) => updateUserProfile({ variables: { userId, input: values } }),
    [userId, updateUserProfile]
  );

  return doUpdate;
}

export default useUpdateUserProfile;
