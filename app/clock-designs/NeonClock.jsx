import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, {
  Defs,
  Filter,
  FeGaussianBlur,
  G,
  Text as SvgText,
  TSpan,
} from "react-native-svg";

const { width } = Dimensions.get("window");

export default function NeonClock({ color = "#32CD32", previewMode = false }) {
  const neonColor = color || "#32CD32";
  const [time, setTime] = useState(new Date());

  // Update time every second.
  useEffect(() => {
    const intervalId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Memoize formatted time and date strings.
  const { timeString, dateString } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return {
      timeString: `${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
      dateString: time
        .toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase(),
    };
  }, [time]);

  // Determine scale factor for preview mode.
  const scaleFactor = previewMode ? 0.3 : 1;

  return (
    <View style={styles.container}>
      {/* Wrap the SVG in a scaling View when in preview mode */}
      <View style={previewMode ? { transform: [{ scale: scaleFactor }] } : {}}>
        <Svg height="300" width={width} overflow="visible">
          {/* Define a blur filter for the ambient shadow */}
          <Defs>
            <Filter
              id="ambientBlur"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <FeGaussianBlur in="SourceGraphic" stdDeviation="5" />
            </Filter>
          </Defs>

          {/* Ambient blurred shadow behind texts */}
          <G filter="url(#ambientBlur)">
            <SvgText
              x="50%"
              y="150"
              textAnchor="middle"
              alignmentBaseline="baseline"
            >
              <TSpan
                fontSize="120"
                fontWeight="bold"
                fill={neonColor}
                opacity="0.1"
              >
                {timeString}
              </TSpan>
            </SvgText>
            <SvgText
              x="50%"
              y="230"
              textAnchor="middle"
              fontSize="25"
              fontWeight="100"
              fill={neonColor}
              opacity="0.1"
            >
              {dateString}
            </SvgText>
          </G>

          {/* Soft shadow layer */}
          <G transform="translate(2,2)">
            <SvgText
              x="50%"
              y="150"
              textAnchor="middle"
              alignmentBaseline="baseline"
            >
              <TSpan
                fontSize="120"
                fontWeight="bold"
                fill={neonColor}
                opacity="0.2"
              >
                {timeString}
              </TSpan>
            </SvgText>
            <SvgText
              x="50%"
              y="230"
              textAnchor="middle"
              fontSize="25"
              fontWeight="100"
              fill={neonColor}
              opacity="0.2"
            >
              {dateString}
            </SvgText>
          </G>

          {/* Neon glow layer for time */}
          <SvgText
            x="50%"
            y="150"
            textAnchor="middle"
            alignmentBaseline="baseline"
          >
            <TSpan
              fill="transparent"
              stroke={neonColor}
              strokeWidth="10"
              opacity="0.5"
              fontSize="120"
              fontWeight="bold"
            >
              {timeString}
            </TSpan>
          </SvgText>

          {/* Main layer for time */}
          <SvgText
            x="50%"
            y="150"
            textAnchor="middle"
            alignmentBaseline="baseline"
          >
            <TSpan
              fill="transparent"
              stroke="#FFF"
              strokeWidth="2"
              fontSize="120"
              fontWeight="bold"
            >
              {timeString}
            </TSpan>
          </SvgText>

          {/* Neon glow layer for date */}
          <SvgText
            x="50%"
            y="230"
            textAnchor="middle"
            fontSize="25"
            fontWeight="100"
            fill="transparent"
            stroke={neonColor}
            strokeWidth="1"
            opacity="0.3"
          >
            {dateString}
          </SvgText>

          {/* Main layer for date */}
          <SvgText
            x="50%"
            y="230"
            textAnchor="middle"
            fontSize="25"
            fontWeight="100"
            fill="#FFF"
          >
            {dateString}
          </SvgText>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
