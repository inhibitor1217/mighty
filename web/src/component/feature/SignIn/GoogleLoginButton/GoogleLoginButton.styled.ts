import styled from "styled-components";
import { RESOURCE_IMAGE_PATH } from "../../../../const/path";
import clickable from "../../../../styles/clickable";

const IMAGE_FILE = "/btn_google_signin_dark_normal_web@2x.png";

const Button = styled.button`
  width: 191px;
  height: 46px;
  padding: 0;
  margin: 0;
  background-color: transparent;
  background-image: url("${RESOURCE_IMAGE_PATH}${IMAGE_FILE}");
  background-size: 100%;
  border: none;
  outline: none;

  ${clickable()}
`;

const Styled = {
  Button,
};

export default Styled;
