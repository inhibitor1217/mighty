import useFadeIn from "../../../hook/useFadeIn";
import {
  CARD_SPINNER_DESK_SIZE,
  CARD_SPINNER_INNER_CARD_SIZE,
} from "./ContentSpinner.const";
import type ContentSpinnerProps from "./ContentSpinner.type";
import Styled from "./ContentSpinner.styled";

const ContentSpinner = ({ className }: ContentSpinnerProps) => {
  const [show] = useFadeIn();

  return (
    <Styled.Wrapper show={show} className={className}>
      <Styled.CardSpinner
        width={CARD_SPINNER_INNER_CARD_SIZE}
        height={CARD_SPINNER_INNER_CARD_SIZE}
      />
      <Styled.SimpleSpinner pixelSize={CARD_SPINNER_DESK_SIZE} />
    </Styled.Wrapper>
  );
};

export default ContentSpinner;
