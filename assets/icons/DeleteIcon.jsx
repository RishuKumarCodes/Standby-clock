import React from "react";
import Svg, { Path } from "react-native-svg";

const DeleteIcon = ({ size = 39, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.5 4A1.5 1.5 0 0 1 10 2.5h4A1.5 1.5 0 0 1 15.5 4v.446H20a.5.5 0 0 1 0 1h-1.5V19a2.5 2.5 0 0 1-2.5 2.5H8A2.5 2.5 0 0 1 5.5 19V7.865a.5.5 0 0 1 1 0V19A1.5 1.5 0 0 0 8 20.5h8a1.5 1.5 0 0 0 1.5-1.5V5.446H15a.5.5 0 0 1-.5-.5V4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5v.946a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h4.5V4Z"
    />
  </Svg>
);

export default DeleteIcon;
