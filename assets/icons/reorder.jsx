import { Svg, Circle } from "react-native-svg";

const ReorderIcon = ({ color = "#000", size = 30 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="2" fill={color} />
      <Circle cx="4" cy="12" r="2" fill={color} />
      <Circle cx="20" cy="12" r="2" fill={color} />
    </Svg>
  );
};

export default ReorderIcon;
