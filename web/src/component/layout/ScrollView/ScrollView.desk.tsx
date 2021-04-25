import { DESK_CONTENT_WIDTH, WIDE_CONTENT_WIDTH } from "../../../const/layout";
import useResponsive from "../../../hook/useResponsive";
import Styled from "./ScrollView.desk.styled";
import type ScrollViewProps from "./ScrollView.type";

const ScrollView = ({
  center = false,
  children,
  ...props
}: ScrollViewProps) => {
  const ResponsiveContent = useResponsive<ScrollViewProps>(
    Styled.ScrollContent,
    {
      mediaQueries: [
        {
          query: { maxWidth: DESK_CONTENT_WIDTH },
          Component: Styled.ShallowScrollContent,
        },
        {
          query: { minWidth: WIDE_CONTENT_WIDTH },
          Component: Styled.WideScrollContent,
        },
      ],
    }
  );

  return (
    <Styled.ScrollContainer {...props}>
      <ResponsiveContent center={center}>{children}</ResponsiveContent>
    </Styled.ScrollContainer>
  );
};

export default ScrollView;
