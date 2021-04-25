import Styled from "./ScrollView.mobile.styled";
import type ScrollViewProps from "./ScrollView.type";

const ScrollView = ({ children, ...props }: ScrollViewProps) => {
  return (
    <Styled.ScrollContainer {...props}>
      <Styled.ScrollContent>{children}</Styled.ScrollContent>
    </Styled.ScrollContainer>
  );
};

export default ScrollView;
