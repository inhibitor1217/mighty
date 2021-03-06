import React from "react";

import type StyledComponentProps from "type/StyledComponent";

export interface StyledScrollContentProps {
  center: boolean;
}

interface ScrollViewProps extends StyledComponentProps {
  center?: boolean;
  children?: React.ReactNode;
}

export default ScrollViewProps;
