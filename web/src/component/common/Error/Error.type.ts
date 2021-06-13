import type { ApolloError } from "@apollo/client";

import type StyledComponentProps from "type/StyledComponent";

interface ErrorProps extends StyledComponentProps {
  error: ApolloError;
}

export default ErrorProps;
