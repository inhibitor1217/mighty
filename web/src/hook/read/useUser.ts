import { gql, useQuery } from "@apollo/client";
import _ from "lodash";

import { Query, QueryUserArgs, User } from "type/graphql";
import ResourceNotFoundException from "util/exception/ResourceNotFound.exception";

const USER_QUERY = gql`
  query ReadUser($id: ID!) {
    user(id: $id) @client @type(name: "User") {
      id
      createdAt
      updatedAt
      provider
      providerId
      state
      userProfileId
      profile @type(name: "UserProfile") {
        id
        createdAt
        updatedAt
        displayName
        username
        email
        photo
      }
    }
  }
`;

function useUser(userId: User["id"]): User {
  const { data } = useQuery<Query, QueryUserArgs>(USER_QUERY, {
    variables: { id: userId },
    fetchPolicy: "cache-only",
  });

  const user = data?.user;

  if (_.isNil(user)) {
    throw new ResourceNotFoundException("User");
  }

  return user;
}

export default useUser;
