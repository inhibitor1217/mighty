import _ from "lodash";

import InvalidEnvironmentException from "util/exception/InvalidEnvironment.exception";

function nodeEnv(): string {
  return process.env.NODE_ENV;
}

export const isDevelopment = () => nodeEnv() === "development";
export const isProduction = () => nodeEnv() === "production";

function env(name: string): string {
  const nameWithPrefix = `REACT_APP_${name}`;
  const value = process.env[nameWithPrefix];

  if (_.isNil(value)) {
    throw new InvalidEnvironmentException(nameWithPrefix);
  }

  return value;
}

export const apiServerHost = () => env("API_SERVER_HOST");
