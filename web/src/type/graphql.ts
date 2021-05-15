export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: Date;
};

export enum AuthProvider {
  Google = 'Google'
}


export type GoogleOAuthRedirect = {
  readonly __typename?: 'GoogleOAuthRedirect';
  readonly users: ReadonlyArray<User>;
};

export type GoogleOAuthRedirectQuery = {
  readonly __typename?: 'GoogleOAuthRedirectQuery';
  readonly body: GoogleOAuthRedirect;
};


export type GoogleOAuthRedirectQueryBodyArgs = {
  params: Scalars['String'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly GoogleOAuthRedirect: GoogleOAuthRedirectQuery;
};

export type User = {
  readonly __typename?: 'User';
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly updatedAt: Scalars['DateTime'];
  readonly provider: AuthProvider;
  readonly providerId: Scalars['String'];
  readonly state: UserState;
  readonly userProfileId: Scalars['ID'];
  readonly profile: UserProfile;
};

export type UserProfile = {
  readonly __typename?: 'UserProfile';
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly updatedAt: Scalars['DateTime'];
  readonly displayName: Scalars['String'];
  readonly username: Maybe<Scalars['String']>;
  readonly email: Maybe<Scalars['String']>;
  readonly photo: Maybe<Scalars['String']>;
};

export enum UserState {
  Active = 'Active',
  Banned = 'Banned',
  Deleted = 'Deleted',
  WaitingForActivation = 'WaitingForActivation'
}
