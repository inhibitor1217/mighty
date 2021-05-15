import { gql } from "@apollo/client";

import client from "api/client";
import { GoogleOAuthRedirectQuery, GoogleOAuthRedirectQueryBodyArgs, User } from "type/graphql";

import { googleOAuthRedirect } from "./OAuth";

it("Simple oauth test", async () => {
  const query = gql`
    query GoogleOAuthRedirect($params: String!) {
      body(params: $params) @rest(path: "${googleOAuthRedirect}?{args.params}") {
        users @type(name: "User") {
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
    }
  `;

  const { data } = await client.query<GoogleOAuthRedirectQuery, GoogleOAuthRedirectQueryBodyArgs>({
    query,
    variables: {
      params:
        "code=4%2F0AY0e-g4DGUr36qsG1OCYhc2KxnVRg0Pdr2LL6UgLXfAHx6aku9XLog7hIARNk85Bbn0gYA&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&authuser=0&prompt=none",
    },
  });
  console.log(data.body.users);

  console.log(client.cache.extract());

  const user = client.readFragment<User>({
    id: "User:1",
    fragment: gql`
      fragment User on User {
        id
        createdAt
        updatedAt
      }
    `,
  });

  console.log(user, typeof user?.createdAt);
});
