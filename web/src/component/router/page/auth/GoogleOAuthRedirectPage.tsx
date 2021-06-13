import { gql, useQuery } from "@apollo/client";
import { useLocation } from "react-router";

import { googleOAuthRedirect } from "api/auth/OAuth";
import ContentSpinner from "component/common/ContentSpinner";
import Error from "component/common/Error";
import ScrollView from "component/layout/ScrollView";
import type { Query, QueryGoogleOAuthRedirectArgs } from "type/graphql";

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
  const params = location.search.substr(1);

  const { data, loading, error } = useQuery<Query, QueryGoogleOAuthRedirectArgs>(query, {
    variables: { params },
  });

  return (
    <ScrollView center>
      {loading && <ContentSpinner />}
      {error && <Error error={error} />}
      {!loading && !error && <div>{JSON.stringify(data)}</div>}
    </ScrollView>
  );
};

export default GoogleOAuthRedirectPage;
