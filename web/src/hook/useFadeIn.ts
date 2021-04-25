import { useEffect, useState } from "react";

const useFadeIn = () => {
  const [show, setShow] = useState(false);

  useEffect(function fadeIn() {
    setShow(true);
  }, []);

  return [show];
};

export default useFadeIn;
