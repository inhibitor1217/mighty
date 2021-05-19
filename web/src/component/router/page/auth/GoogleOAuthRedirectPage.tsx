import { gql, useQuery } from "@apollo/client";
import { useLocation } from "react-router";

import { googleOAuthRedirect } from "api/auth/OAuth";
import ScrollView from "component/layout/ScrollView";
import type { Query } from "type/graphql";

const query = gql`
    query GoogleOAuthRedirect($params: String!) {
      GoogleOAuthRedirect(params: $params) @rest(path: "${googleOAuthRedirect}?{args.params}") {
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

const GoogleOAuthRedirectPage = () => {
  const location = useLocation();

  const { data } = useQuery<Query, QueryGoogleOAuthRedirectArgs>(query, {
    variables: {
      params: location.search.substr(1),
    },
  });

  return (
    <ScrollView center>
      <div>{JSON.stringify(data)}</div>
    </ScrollView>
  );
};

export default GoogleOAuthRedirectPage;
