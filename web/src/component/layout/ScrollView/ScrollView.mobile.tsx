import Styled from "./ScrollView.mobile.styled";
import type ScrollViewProps from "./ScrollView.type";

const ScrollView = ({
  center = false,
  children,
  ...props
}: ScrollViewProps) => {
  return (
    <Styled.ScrollContainer {...props}>
      <Styled.ScrollContent center={center}>{children}</Styled.ScrollContent>
    </Styled.ScrollContainer>
  );
};

export default ScrollView;
