import _ from "lodash";

function parseNetworkError(networkError: any): string | undefined {
  const statusCode = _.get(networkError, "statusCode");

  if (_.isNil(statusCode)) {
    return undefined;
  }

  return `문제가 발생했습니다. ErrorCode: ${statusCode}`;
}

function parseErrorMessage(error: any): string | undefined {
  const message = _.get(error, "message", "");

  if (message.includes("Failed to fetch")) {
    return "네트워크에 연결할 수 없습니다.";
  }

  return undefined;
}

export function parseServerError(error: any): string {
  return (
    parseNetworkError(_.get(error, "networkError")) ??
    parseErrorMessage(error) ??
    "알 수 없는 문제가 발생했습니다."
  );
}
