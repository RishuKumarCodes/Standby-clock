import React from "react";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Path,
  Stop,
  LinearGradient,
  Mask,
} from "react-native-svg";

interface WeatherData {
  moonPhase: number;
  sunrise: string;
  sunset: string;
  description: string;
  location: string;
  temperature: number;
}

interface MoonComponentProps {
  weatherData: WeatherData;
  containerWidth: number;
  containerHeight: number;
}

export const MoonComponent: React.FC<MoonComponentProps> = ({
  weatherData,
  containerWidth,
  containerHeight,
}) => {
  if (!weatherData) return null;

  const phase = weatherData.moonPhase;
  const radius = 60;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  // Calculate shadow path based on moon phase
  const getShadowPath = (phase: number) => {
    const x = centerX;
    const y = centerY;
    const r = radius;

    if (phase <= 0.005 || phase >= 0.995) {
      return `M ${x} ${y - r} A ${r} ${r} 0 1 1 ${x} ${
        y + r
      } A ${r} ${r} 0 1 1 ${x} ${y - r}`;
    } else if (phase >= 0.01 && phase <= 0.49) {
      if (phase <= 0.24) {
        const t = phase / 0.24;
        const shadowWidth = r * (1 - 0.8 * t);
        return `
          M ${x} ${y - r}
          A ${r} ${r} 0 1 0 ${x} ${y + r}
          A ${shadowWidth} ${r} 0 1 0 ${x} ${y - r}
          Z
        `;
      } else if (phase === 0.25) {
        return `M ${x} ${y - r} L ${x} ${y + r} A ${r} ${r} 0 1 1 ${x} ${
          y - r
        }`;
      } else if (phase <= 0.49) {
        const t = (phase - 0.26) / (0.49 - 0.26);
        const shadowWidth = r * t;
        return ` M ${x} ${y - r} A ${shadowWidth} ${r} 0 1 0 ${x} ${
          y + r
        } A ${r} ${r} 0 1 1 ${x} ${y - r} Z `;
      }
    } else if (phase >= 0.495 && phase <= 0.505) {
      return "";
    } else if (phase >= 0.51 && phase <= 0.99) {
      if (phase >= 0.51 && phase <= 0.74) {
        const t = (phase - 0.51) / (0.74 - 0.51);
        const shadowWidth = r * (1 - 0.8 * t);
        const shift = r - shadowWidth;

        return `
          M ${x} ${y - r}
          A ${r} ${r} 0 1 0 ${x} ${y + r}
          A ${shadowWidth} ${r} 0 1 1 ${x + shift} ${y - r}
          Z
        `;
      }

      if (phase === 0.75) {
        return `M ${x} ${y - r} A ${r} ${r} 0 1 0 ${x} ${y + r} L ${x} ${
          y - r
        }`;
      }

      if (phase >= 0.76 && phase <= 0.99) {
        const t = (phase - 0.76) / (0.99 - 0.76);
        const shadowWidth = r * (1 - 0.8 * (1 - t));

        return `
          M ${x} ${y - r}
          A ${r} ${r} 0 1 0 ${x} ${y + r}
          A ${shadowWidth} ${r} 0 1 0 ${x} ${y - r}
          Z
        `;
      }
    } 

    return "";
  };

  const shadowPath = getShadowPath(phase);
  const shouldRotate = phase >= 0.51 && phase <= 0.99;
  return (
    <Svg width={containerWidth} height={containerHeight}>
      <Defs>
        {/* Moon surface - realistic gray color */}
        <LinearGradient id="moonSurface" x1="30%" y1="30%" x2="70%" y2="70%">
          <Stop offset="0%" stopColor="#DCDCDC" />
          <Stop offset="100%" stopColor="#C0C0C0" />
        </LinearGradient>

        <ClipPath id="moonClip">
          <Circle cx={centerX} cy={centerY} r={radius} />
        </ClipPath>

        <Mask id="moonMask">
          <Circle cx={centerX} cy={centerY} r={radius} fill="white" />
        </Mask>
      </Defs>

      {/* Full moon base */}
      <Circle cx={centerX} cy={centerY} r={radius} fill="#DCDCDC" />

      {/* Realistic crater pattern */}
      <Circle
        cx={centerX + 8}
        cy={centerY - 4}
        r="16"
        fill="#CCCBCB"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX + 36}
        cy={centerY + 13}
        r="13"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX + 40}
        cy={centerY - 18}
        r="12"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX - 2}
        cy={centerY + 35}
        r="11"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX - 23}
        cy={centerY - 7}
        r="3"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX - 18}
        cy={centerY + 2}
        r="2"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX - 44}
        cy={centerY - 25}
        r="21"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX - 50}
        cy={centerY + 10}
        r="24"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX - 12}
        cy={centerY + 8}
        r="7"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX - 18}
        cy={centerY + 24}
        r="12"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX - 30}
        cy={centerY + 16}
        r="5"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX - 26}
        cy={centerY + 29}
        r="7"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX + 16}
        cy={centerY - 38}
        r="8"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX + 21}
        cy={centerY - 25}
        r="3.5"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX + 13}
        cy={centerY + 15}
        r="3"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      <Circle
        cx={centerX + 5}
        cy={centerY + 47}
        r="26"
        fill="#C4C4C4"
        mask="url(#moonMask)"
      />

      {shadowPath && (
        <Path
          d={shadowPath}
          fill="rgba(0, 3, 22, 0.85)"
          clipPath="url(#moonClip)"
          transform={
            shouldRotate ? `rotate(180, ${centerX}, ${centerY})` : undefined
          }
        />
      )}
    </Svg>
  );
};
