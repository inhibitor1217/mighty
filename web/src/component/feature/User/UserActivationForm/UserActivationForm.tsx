import { gql, useMutation } from "@apollo/client";
import { useCallback, useMemo } from "react";
import { Link, useHistory } from "react-router-dom";
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
import type { FormikHelpers, FormikProps } from "formik";
import _ from "lodash";
import qs from "query-string";

import { activate } from "api/rest/auth/common";
import { Field, StringField } from "component/common/Form";
import type { FieldProps } from "component/common/Form";
import { AUTH_PATH, ROOT_PATH, SIGN_IN_PATH } from "const/path";
import * as forms from "core/form";
import type { UserProfileFormValues } from "core/form";
import { useUpdateUserProfile } from "hook/form";
import { useUser } from "hook/read";
import { Mutation, UserState } from "type/graphql";
import assert from "util/assert";
import { parseServerError } from "util/serverError";

import type UserActivationFormProps from "./UserActivationForm.type";
import Styled from "./UserActivationForm.styled";

const baseSignInLink = [AUTH_PATH, SIGN_IN_PATH].join("");
const signInLink = `${baseSignInLink}?${qs.stringify({ accountSelect: true })}`;

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
  status,
  isValid,
  isSubmitting,
  resetForm,
  submitForm,
}: FormikProps<UserProfileFormValues>) {
  const { displayName, email, photo } = values;
  const formError = _.get(status, "error");

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

      {formError && (
        <Text typo={Typography.Size13} color="bgtxt-yellow-normal" marginTop={6}>
          {forms.userProfileHelpers.parseError(formError)}
        </Text>
      )}
    </Styled.UserProfileFormWrapper>
  );
}

const ACTIVATE_ME_MUTATION = gql`
  mutation ActivateMe {
    activateMe(input: {}) @rest(path: "${activate()}", method: PATCH, bodyKey: "input") {
      users @type(name: "User") {
        id
        state
      }
    }
  }
`;

const UserActivationForm = ({ className, userId }: UserActivationFormProps) => {
  const user = useUser(userId);
  const history = useHistory();

  assert(user.state === UserState.WaitingForActivation);

  const {
    profile: { displayName, email, photo },
  } = user;

  const userProfileFormInitialValues: UserProfileFormValues = useMemo(
    () => ({ displayName, email, photo }),
    [displayName, email, photo]
  );

  const updateUserProfile = useUpdateUserProfile(userId);

  const submitUpdateUserProfileForm = useCallback(
    (values: UserProfileFormValues, helpers: FormikHelpers<UserProfileFormValues>) =>
      updateUserProfile(values).catch((error) => helpers.setStatus({ error })),
    [updateUserProfile]
  );

  const onActivateSuccess = useCallback(() => {
    history.push(ROOT_PATH);
  }, [history]);

  const [
    activateMe,
    { loading: isActivateMeLoading, error: activateMeError },
  ] = useMutation<Mutation>(ACTIVATE_ME_MUTATION, {
    onCompleted: onActivateSuccess,
  });

  const onClickActivateButton = useCallback(() => activateMe().catch(_.noop), []);

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
        onSubmit={submitUpdateUserProfileForm}
        {...forms.userProfile}
      >
        {renderUserProfileForm}
      </Formik>

      <Styled.ActionsWrapper>
        <Button text="계정 활성화" loading={isActivateMeLoading} onClick={onClickActivateButton} />
        <Link to={signInLink}>
          <Button styleVariant={ButtonStyleVariant.Secondary} text="다른 계정으로 로그인" />
        </Link>
      </Styled.ActionsWrapper>

      {activateMeError && (
        <Text typo={Typography.Size13} color="bgtxt-yellow-normal" marginTop={6}>
          {parseServerError(activateMeError)}
        </Text>
      )}
    </Styled.Wrapper>
  );
};

export default UserActivationForm;
