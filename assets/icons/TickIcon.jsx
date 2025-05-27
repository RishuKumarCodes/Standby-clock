import Svg, { Path } from "react-native-svg";

const TickIcon = ({ size = 45, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19.35352,6.64648a.49983.49983,0,0,1,0,.707l-10,10a.49984.49984,0,0,1-.707,0l-4-4a.5.5,0,0,1,.707-.707L9,16.293l9.64648-9.64649A.49983.49983,0,0,1,19.35352,6.64648Z"
      fill={color}
    />
  </Svg>
);

export default TickIcon;
