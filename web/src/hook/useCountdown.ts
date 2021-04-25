import { useEffect, useState } from "react";

const useCountdown = (
  timeoutSeconds: number,
  onTimeout?: () => void
): [number] => {
  const [seconds, setSeconds] = useState(timeoutSeconds);

  useEffect(
    function reduceTimeoutUntilEnd() {
      function callback() {
        if (seconds <= 1) {
          onTimeout?.();
          return;
        }

        setSeconds(seconds - 1);
      }

      const handle = setTimeout(callback, 1000);

      return function clearCallback() {
        return clearTimeout(handle);
      };
    },
    [seconds, onTimeout]
  );

  return [seconds];
};

export default useCountdown;
