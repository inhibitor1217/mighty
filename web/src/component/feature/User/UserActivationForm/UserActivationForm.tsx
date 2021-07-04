import { gql, useMutation } from "@apollo/client";
import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarSize,
  Button,
  ButtonColorVariant,
  ButtonStyleVariant,
  Text,
  Typography,
} from "@channel.io/bezier-react";
import { Formik } from "formik";
import type { FormikProps } from "formik";

import { profile } from "api/rest/user/profile";
import { Field, StringField } from "component/common/Form";
import type { FieldProps } from "component/common/Form";
import { AUTH_PATH, SIGN_IN_PATH } from "const/path";
import * as forms from "core/form";
import type { UserProfileFormValues } from "core/form";
import { useUser } from "hook/read";
import { Mutation, MutationUpdateUserProfileArgs, UserState } from "type/graphql";
import assert from "util/assert";

import type UserActivationFormProps from "./UserActivationForm.type";
import Styled from "./UserActivationForm.styled";

const signInLinkTo = [AUTH_PATH, SIGN_IN_PATH].join("");

const renderUserProfileReadonlyPhotoInput: FieldProps<string>["renderInput"] = ({ input }) => {
  const { value } = input;

  return (
    <Styled.UserProfileAvatarWrapper>
      <Avatar name="profile.photo" avatarUrl={value ?? ""} size={AvatarSize.Size36} />
    </Styled.UserProfileAvatarWrapper>
  );
};

function renderUserProfileForm({
  values,
  dirty,
  isValid,
  isSubmitting,
  resetForm,
  submitForm,
}: FormikProps<UserProfileFormValues>) {
  const { displayName, email, photo } = values;

  return (
    <Styled.UserProfileFormWrapper>
      <Styled.FieldsWrapper>
        <StringField
          name="displayName"
          label="이름"
          value={displayName}
          required
          help="다른 사람들에게 노출되는 이름입니다."
        />

        <StringField icon="email" name="email" label="이메일" value={email} readonly />

        <Field<string>
          icon="image"
          name="photo"
          label="프로필 이미지"
          value={photo}
          readonly
          renderInput={renderUserProfileReadonlyPhotoInput}
        />
      </Styled.FieldsWrapper>

      <Text typo={Typography.Size13} color="txt-black-dark" marginBottom={8}>
        * 프로필 정보는 언제든지 변경할 수 있습니다.
      </Text>

      {dirty && (
        <Styled.ActionsWrapper>
          <Button
            colorVariant={ButtonColorVariant.Green}
            styleVariant={ButtonStyleVariant.Secondary}
            text="프로필 저장"
            onClick={submitForm}
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
          />
          <Button
            text="초기화"
            colorVariant={ButtonColorVariant.Green}
            styleVariant={ButtonStyleVariant.Tertiary}
            onClick={() => resetForm()}
            disabled={isSubmitting}
          />
        </Styled.ActionsWrapper>
      )}
    </Styled.UserProfileFormWrapper>
  );
}

const mutation = gql`
  mutation UpdateUserProfile($userId: ID!, $input: UpdateUserProfileInput!) {
    updateUserProfile(userId: $userId, input: $input) @rest(path: "${profile(
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

const UserActivationForm = ({ className, userId }: UserActivationFormProps) => {
  const user = useUser(userId);

  assert(user.state === UserState.WaitingForActivation);

  const {
    profile: { displayName, email, photo },
  } = user;

  const userProfileFormInitialValues: UserProfileFormValues = useMemo(
    () => ({ displayName, email, photo }),
    [displayName, email, photo]
  );

  const [updateUserProfile] = useMutation<Mutation, MutationUpdateUserProfileArgs>(mutation);

  const onSubmitUserProfileForm = useCallback(
    (values: UserProfileFormValues) =>
      updateUserProfile({
        variables: {
          userId,
          input: values,
        },
      }),
    [userId, updateUserProfile]
  );

  return (
    <Styled.Wrapper className={className}>
      <Text typo={Typography.Size24} bold marginBottom={8}>
        거의 다 완료되었습니다!
      </Text>
      <Text typo={Typography.Size16} color="txt-black-dark" marginBottom={24}>
        프로필 정보를 확인하신 후 계정을 활성화하세요.
      </Text>

      <Formik<UserProfileFormValues>
        initialValues={userProfileFormInitialValues}
        onSubmit={onSubmitUserProfileForm}
        {...forms.userProfile}
      >
        {renderUserProfileForm}
      </Formik>

      <Styled.ActionsWrapper>
        <Button text="계정 활성화" />
        <Link to={signInLinkTo}>
          <Button styleVariant={ButtonStyleVariant.Secondary} text="다른 계정으로 로그인" />
        </Link>
      </Styled.ActionsWrapper>
    </Styled.Wrapper>
  );
};

export default UserActivationForm;
