import styled, { keyframes } from "styled-components";
import type SimpleSpinnerProps from "./SimpleSpinner.type";

const RotateKeyframes = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const DashKeyframes = keyframes`
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
`;

const StrokeKeyframes = keyframes`
  0% {
    stroke-width: 0;
  }
  50% {
    stroke-width: 2px;
  }
  100% {
    stroke-width: 0;
  }
`;

const SpinnerSvg = styled.svg<SimpleSpinnerProps>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;

  animation: ${RotateKeyframes} 2s linear infinite;
  transform-origin: center center;
`;

const SpinnerCircle = styled.circle`
  stroke: #e0e0e0;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;

  animation: ${DashKeyframes} 1.5s ease-in-out infinite, ${StrokeKeyframes} 3s ease-in-out infinite;
`;

const Styled = {
  SpinnerSvg,
  SpinnerCircle,
};

export default Styled;
