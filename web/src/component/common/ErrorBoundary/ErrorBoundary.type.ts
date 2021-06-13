import type React from "react";

import type { ErrorProps } from "component/common/Error";

export interface ErrorBoundaryState {
  error?: ErrorProps["error"];
}

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

export default ErrorBoundaryProps;
