import React from "react";
import _ from "lodash";

import Error from "component/common/Error";
import ScrollView from "component/layout/ScrollView/ScrollView";
import { isDevelopment } from "const/env";

import ErrorBoundaryProps, { ErrorBoundaryState } from "./ErrorBoundary.type";

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {};
  }

  componentDidCatch(error: any, errorInfo: any) {
    if (isDevelopment()) {
      /* eslint-disable no-console */
      console.error(error);
      console.warn(_.get(errorInfo, "componentStack"));
      /* eslint-enable no-console */
    }
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { error };
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;

    if (_.isNil(error)) {
      return children;
    }

    return (
      <ScrollView center>
        <Error error={error} />
      </ScrollView>
    );
  }
}
