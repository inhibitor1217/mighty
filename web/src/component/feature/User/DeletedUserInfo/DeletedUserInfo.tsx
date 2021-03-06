import { Link } from "react-router-dom";
import {
  Button,
  ButtonColorVariant,
  ButtonStyleVariant,
  Icon,
  IconSize,
  Text,
  Typography,
} from "@channel.io/bezier-react";

import { AUTH_PATH, SIGN_IN_PATH } from "const/path";
import { useUser } from "hook/read";
import { UserState } from "type/graphql";
import assert from "util/assert";

import type DeletedUserInfoProps from "./DeletedUserInfo.type";
import Styled from "./DeletedUserInfo.styled";

const signInLinkTo = [AUTH_PATH, SIGN_IN_PATH].join("");

const DeletedUserInfo = ({ className, userId }: DeletedUserInfoProps) => {
  const user = useUser(userId);

  assert(user.state === UserState.Deleted);

  return (
    <Styled.Wrapper className={className}>
      <Styled.TitleWrapper>
        <Icon name="trash" size={IconSize.XL} />
        <Text typo={Typography.Size24} bold>
          계정이 삭제됨
        </Text>
      </Styled.TitleWrapper>
      <Text typo={Typography.Size16} color="txt-black-darker" marginTop={8} marginBottom={32}>
        서비스 이용이 불가능한 계정입니다. (계정 ID: {user.id})<br />
        관리자에게 문의 바랍니다.
      </Text>

      <Link to={signInLinkTo}>
        <Button
          styleVariant={ButtonStyleVariant.Secondary}
          colorVariant={ButtonColorVariant.Monochrome}
          text="다른 계정으로 로그인"
        />
      </Link>
    </Styled.Wrapper>
  );
};

export default DeletedUserInfo;
