import { gql, useQuery } from "@apollo/client";
import { Redirect, useLocation } from "react-router";
import _ from "lodash";

import { googleOAuthRedirect } from "api/auth/OAuth";
import ContentSpinner from "component/common/ContentSpinner";
import Error from "component/common/Error";
import ScrollView from "component/layout/ScrollView";
import BannedUserInfo from "component/feature/User/BannedUserInfo";
import DeletedUserInfo from "component/feature/User/DeletedUserInfo";
import UserActivationForm from "component/feature/User/UserActivationForm";
import { ROOT_PATH } from "const/path";
import { UserState } from "type/graphql";
import type { Query, QueryGoogleOAuthRedirectArgs } from "type/graphql";
import unreachable from "util/unreachable";

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

  const user = _.first(data?.GoogleOAuthRedirect.users);

  const ContentElement = (() => {
    if (loading) {
      return <ContentSpinner />;
    }
    if (error) {
      return <Error error={error} />;
    }

    if (_.isNil(user)) {
      return <Error error={{ message: "No user found" }} />;
    }

    switch (user.state) {
      case UserState.Active:
        return <Redirect to={ROOT_PATH} />;
      case UserState.Banned:
        return <BannedUserInfo user={user} />;
      case UserState.Deleted:
        return <DeletedUserInfo user={user} />;
      case UserState.WaitingForActivation:
        return <UserActivationForm userId={user.id} />;
      default:
        return unreachable();
    }
  })();

  return <ScrollView center>{ContentElement}</ScrollView>;
};

export default GoogleOAuthRedirectPage;
