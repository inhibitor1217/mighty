import { apiServerHost } from "const/env";

import { modulePath } from "./const";

export const googleOAuthSignIn = `${modulePath}/google`;
export const googleOAuthSignInFullPath = `${apiServerHost()}${googleOAuthSignIn}`;

export const googleOAuthRedirect = `${modulePath}/google/redirect`;
