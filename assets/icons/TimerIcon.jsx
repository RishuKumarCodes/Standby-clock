import Svg, { Path } from "react-native-svg";

const TimerIcon = ({ size = 27, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M7.722 20.788A3 3 0 0 0 7 22.74V29H5a1 1 0 0 0 0 2h22a1 1 0 0 0 0-2h-2v-6.26a3 3 0 0 0-.722-1.952l-3.546-4.137a1 1 0 0 1 0-1.3l3.546-4.137A3 3 0 0 0 25 9.26V3h2a1 1 0 0 0 0-2H5a1 1 0 0 0 0 2h2v6.26a3 3 0 0 0 .722 1.952l3.546 4.137a1 1 0 0 1 0 1.3Zm5.065-6.741L9.241 9.911A1 1 0 0 1 9 9.26V3h14v6.26a1 1 0 0 1-.241.651l-3.546 4.136a2.986 2.986 0 0 0 0 3.905l3.546 4.137a1 1 0 0 1 .241.651V29H9v-6.26a1 1 0 0 1 .241-.651l3.546-4.137a2.986 2.986 0 0 0 0-3.905Z"
      fill={color}
    />
    <Path
      d="M11 26a1 1 0 0 0 1 1h8a1 1 0 0 0 0-2h-8a1 1 0 0 0-1 1Z"
      fill={color}
    />
  </Svg>
);

export default TimerIcon;
