import { SIMPLE_SPINNER_SIZES } from "./SimpleSpinner.const";
import Styled from "./SimpleSpinner.styled";
import { SimpleSpinnerSize } from "./SimpleSpinner.type";
import type SimpleSpinnerProps from "./SimpleSpinner.type";

const SimpleSpinner = ({
  className,
  size = SimpleSpinnerSize.S,
  pixelSize: givenPixelSize,
}: SimpleSpinnerProps) => {
  const pixelSize = givenPixelSize ?? SIMPLE_SPINNER_SIZES[size];

  return (
    <Styled.SpinnerSvg className={className} size={pixelSize} viewBox="25 25 50 50">
      <Styled.SpinnerCircle cx="50" cy="50" r="20" fill="none" strokeMiterlimit="10" />
    </Styled.SpinnerSvg>
  );
};

export default SimpleSpinner;
