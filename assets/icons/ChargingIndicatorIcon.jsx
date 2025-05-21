import Svg, { Path } from "react-native-svg";

export default ChargingIcon = ({
  width = 16,
  height = 16,
  color = "#FFD700",
}) => (
  <Svg width={width} height={height} viewBox="0 0 100 100">
    <Path
      d="M63.3 9.5 21.8 52.2c-.7.7-.2 1.8.7 1.8h24c.8 0 1.3.8 1 1.5L32.4 89.4c-.5 1.1.9 2 1.7 1.1l43.8-49.6c.6-.7.1-1.8-.8-1.8H51.7c-.8 0-1.3-.8-.9-1.5l14.1-26.9c.6-1-.8-2-1.6-1.2z"
      fill={color}
    />
  </Svg>
);
