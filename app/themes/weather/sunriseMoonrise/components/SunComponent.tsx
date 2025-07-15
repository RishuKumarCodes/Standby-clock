import { StyleSheet, View } from "react-native";
import React from "react";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";
import { MdTxt } from "@/app/components/ui/CustomText";
import { useFonts } from "expo-font";

const sunComponent = ({ weatherData, currentTime }) => {
  const [fontsLoaded] = useFonts({
    Nasa: require("@/assets/fonts/Nasa.ttf"),
  });

  const parseTime = (timeStr: string) => {
    if (timeStr.includes("T")) {
      const date = new Date(timeStr);
      return {
        hour: date.getHours(),
        minute: date.getMinutes(),
      };
    }

    const parts = timeStr.split(":");
    return {
      hour: parseInt(parts[0], 10),
      minute: parseInt(parts[1] || "0", 10),
    };
  };

  const sunrise = parseTime(weatherData.sunrise);
  const sunset = parseTime(weatherData.sunset);
  const sunsetin12hr = sunset.hour % 12;

  const getNextSunEvent = () => {
    if (!weatherData) return null;

    const now = currentTime;
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    const sunrise = parseTime(weatherData.sunrise);
    const sunset = parseTime(weatherData.sunset);

    const sunriseInMinutes = sunrise.hour * 60 + sunrise.minute;
    const sunsetInMinutes = sunset.hour * 60 + sunset.minute;

    if (currentTimeInMinutes < sunriseInMinutes) {
      const diffMinutes = sunriseInMinutes - currentTimeInMinutes;
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return {
        event: "Sunrise in",
        time: weatherData.sunrise,
        countdown: `${hours} hrs, ${minutes} min`,
        isSunrise: true,
      };
    } else if (currentTimeInMinutes < sunsetInMinutes) {
      const diffMinutes = sunsetInMinutes - currentTimeInMinutes;
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return {
        event: "Sunset in",
        time: weatherData.sunset,
        countdown: `${hours} hrs, ${minutes} min`,
        isSunrise: false,
      };
    } else {
      const diffMinutes = 24 * 60 - currentTimeInMinutes + sunriseInMinutes;
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return {
        event: "Sunrise",
        time: weatherData.sunrise,
        countdown: `in ${hours} hrs, ${minutes} min`,
        isSunrise: true,
      };
    }
  };

  const nextSunEvent = getNextSunEvent();

  const renderSunPath = () => {
    if (!weatherData) return null;

    const centerX = 400 * 0.5;
    const centerY = 400 * 0.94; // Moved center further down and outside view
    const radius = 400 * 0.47; // Smaller radius for more compact arc
    const arcHeight = radius * 0.7;

    const now = currentTime;
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    const sunriseInMinutes = sunrise.hour * 60 + sunrise.minute;
    const sunsetInMinutes = sunset.hour * 60 + sunset.minute;

    const isDaytime =
      currentTimeInMinutes >= sunriseInMinutes &&
      currentTimeInMinutes <= sunsetInMinutes;

    const dayDuration = sunsetInMinutes - sunriseInMinutes;
    const timeFromSunrise = currentTimeInMinutes - sunriseInMinutes;
    const progress = Math.max(0, Math.min(1, timeFromSunrise / dayDuration));

    // Flatter arc - smaller angle range with larger radius for same arc length
    const startAngle = (220 * Math.PI) / 180; // Sunrise angle
    const endAngle = (320 * Math.PI) / 180; // Sunset angle (100 degree arc)
    const currentAngle = startAngle + (endAngle - startAngle) * progress;

    const sunX = centerX + Math.cos(currentAngle) * radius;
    const sunY = centerY + Math.sin(currentAngle) * radius;

    // Calculate start and end positions for the arc
    const startX = centerX + Math.cos(startAngle) * radius;
    const startY = centerY + Math.sin(startAngle) * radius;
    const endX = centerX + Math.cos(endAngle) * radius;
    const endY = centerY + Math.sin(endAngle) * radius;

    // Create the arc path (proper curved arc)
    const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

    return (
      <Svg
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 340,
          width: 400,
        }}
      >
        <Defs>
          {/* Gradient for the sun path */}
          <LinearGradient
            id="sunPathGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0%" stopColor="#a32300" />
            <Stop offset="10%" stopColor="#FD8969" />
            <Stop offset="30%" stopColor="#51CEF9" />
            <Stop offset="70%" stopColor="#51CEF9" />
            <Stop offset="90%" stopColor="#FD8969" />
            <Stop offset="100%" stopColor="#a32300" />
          </LinearGradient>

          {/* Sun gradient */}
          <LinearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFF9C4" />
            <Stop offset="30%" stopColor="#FFE082" />
            <Stop offset="70%" stopColor="#FFB74D" />
            <Stop offset="100%" stopColor="#FF8A65" />
          </LinearGradient>

          {/* Sun glow gradient */}
          <LinearGradient id="sunGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="rgba(255, 249, 196, 0.4)" />
            <Stop offset="50%" stopColor="rgba(255, 224, 130, 0.3)" />
            <Stop offset="100%" stopColor="rgba(255, 183, 77, 0.2)" />
          </LinearGradient>
        </Defs>

        {/* Background arc path */}
        <Path
          d={arcPath}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4,8"
        />

        {/* Full gradient path during daytime */}
        {isDaytime && (
          <Path
            d={arcPath}
            stroke="url(#sunPathGradient)"
            strokeWidth="3"
            fill="none"
          />
        )}

        {/* Current sun position */}
        {isDaytime && (
          <>
            {/* Sun rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
              const radian = (angle * Math.PI) / 180;
              const rayLength = 2;
              const startX = sunX + Math.cos(radian) * 19;
              const startY = sunY + Math.sin(radian) * 19;
              const endX = sunX + Math.cos(radian) * (19 + rayLength);
              const endY = sunY + Math.sin(radian) * (19 + rayLength);

              return (
                <Path
                  key={index}
                  d={`M ${startX} ${startY} L ${endX} ${endY}`}
                  stroke="#FFF9C4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              );
            })}

            {/* Sun core */}
            <Circle cx={sunX} cy={sunY} r="12" fill="url(#sunGradient)" />
          </>
        )}
      </Svg>
    );
  };

  // Calculate the exact positions for sunrise and sunset text based on arc endpoints
  const centerX = 400 * 0.5;
  const centerY = 400 * 0.97; // Updated to match the arc center
  const radius = 400 * 0.48; // Updated to match the arc radius
  const startAngle = (220 * Math.PI) / 180;
  const endAngle = (320 * Math.PI) / 180;

  // Calculate positions at the arc endpoints
  const sunriseX = centerX + Math.cos(startAngle) * radius;
  const sunriseY = centerY + Math.sin(startAngle) * radius;
  const sunsetX = centerX + Math.cos(endAngle) * radius;
  const sunsetY = centerY + Math.sin(endAngle) * radius;

  return (
    <View style={{ flex: 1 }}>
      {renderSunPath()}

      {/* Next sun event */}
      {nextSunEvent && (
        <View style={styles.sunEventSection}>
          <MdTxt style={styles.eventTitle}>{nextSunEvent.event}</MdTxt>
          <MdTxt style={styles.eventTitle}>{nextSunEvent.countdown}</MdTxt>
        </View>
      )}

      {/* Sunrise text positioned at arc start */}
      <View
        style={[
          styles.sunriseSunset,
          { bottom: 340 - sunriseY - 40, left: sunriseX - 30 },
        ]}
      >
        <MdTxt style={{ marginBottom: -7, fontSize: 17 }}>
          {sunrise.hour}:
          {sunrise.minute < 10 ? `0${sunrise.minute}` : sunrise.minute}
        </MdTxt>
        <MdTxt style={styles.sunriseSunsetLabel}>Sunrise</MdTxt>
      </View>

      {/* Sunset text positioned at arc end */}
      <View
        style={[
          styles.sunriseSunset,
          { bottom: 340 - sunsetY - 40, left: sunsetX - 30 },
        ]}
      >
        <MdTxt style={{ marginBottom: -7, fontSize: 17 }}>
          {sunsetin12hr}:
          {sunset.minute < 10 ? `0${sunset.minute}` : sunset.minute}
        </MdTxt>
        <MdTxt style={styles.sunriseSunsetLabel}>Sunset</MdTxt>
      </View>
    </View>
  );
};

export default sunComponent;

const styles = StyleSheet.create({
  sunEventSection: {
    marginTop: "auto",
    height: "65%",
    paddingLeft: 60,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "100",
    fontFamily: "Nasa",
    color: "#ccc",
    marginBottom: -5,
  },
  sunriseSunset: {
    position: "absolute",
    alignItems: "center",
  },
  sunriseSunsetLabel: { fontSize: 15, color: "#777" },
});
