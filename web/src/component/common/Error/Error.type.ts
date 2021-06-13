import type { ApolloError } from "@apollo/client";

import type StyledComponentProps from "type/StyledComponent";

interface ErrorObject {
  code?: number;
  message?: string;
}

interface ErrorProps extends StyledComponentProps {
  error: ApolloError | ErrorObject;
}

export default ErrorProps;
