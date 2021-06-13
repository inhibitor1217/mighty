import { isProduction } from "const/env";
import AssertionException from "util/exception/Assertion.exception";

export default function assert(predicate: boolean, message?: string): predicate is true {
  if (!predicate) {
    if (isProduction()) {
      // eslint-disable-next-line no-console
      console.debug("Assertion failed", message);
      return false;
    }

    throw new AssertionException(message ?? "Assertion failed");
  }

  return true;
}
