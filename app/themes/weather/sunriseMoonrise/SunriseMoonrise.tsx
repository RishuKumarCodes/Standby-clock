import { StyleSheet, View, Dimensions, Image } from "react-native";
import React, { useEffect, useState } from "react";
import {
  getDetailedWeather,
  getUserLocation,
  onLocationChange,
} from "../../../utils/weatherService";
import { MdTxt } from "@/app/components/ui/CustomText";
import SunComponent from "./components/SunComponent";
import RightComponent from "./components/RightComponent";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Rect,
} from "react-native-svg";
import BatteryCharging from "../../../components/commmon/CircleChargingProgressBar";
import { TouchEditContainer } from "../Common/TouchEditContainer";
import { getMoonPhase } from "@/app/utils/moonService";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

interface WeatherData {
  moonPhase: number;
  sunrise: string;
  sunset: string;
  description: string;
  location: string;
  temperature: number;
}

const SunriseMoonrise: React.FC = ({ variant = "full" }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchWeatherData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let targetLat, targetLon;

      try {
        const savedLocation = await getUserLocation();
        if (savedLocation) {
          targetLat = savedLocation.lat;
          targetLon = savedLocation.lon;
        }
      } catch (locationError) {
        console.log("No saved location found, using default");
      }

      const detailedWeather = await getDetailedWeather(targetLat, targetLon);
      let currentMoonPhase = 0.5;
      try {
        currentMoonPhase = await getMoonPhase();
      } catch (moonErr) {
        console.warn("Failed to fetch moon phase, using default", moonErr);
      }
      setWeatherData({
        moonPhase: currentMoonPhase,
        sunrise: detailedWeather.sun.sunrise || "6:30",
        sunset: detailedWeather.sun.sunset || "18:30",
        description: detailedWeather.current.description,
        location: detailedWeather.current.location,
        temperature: detailedWeather.current.temperature,
      });
    } catch (err: any) {
      setError(err.message);
      console.error("StandBy widget fetch error:", err);

      setWeatherData({
        moonPhase: 0.21,
        sunrise: "6:30",
        sunset: "18:30",
        description: "Clear",
        location: "Your Location",
        temperature: 22,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    const unsubscribe = onLocationChange(() => fetchWeatherData());
    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  if (variant !== "full") {
    return (
      <Image
        source={require("../../../../assets/images/SunMoonPreview.jpg")}
        style={{ height: "100%", width: "100%" }}
      />
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MdTxt style={styles.loadingText}>Loading...</MdTxt>
      </View>
    );
  }

  if (error || !weatherData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MdTxt style={styles.errorText}>Weather unavailable</MdTxt>
      </View>
    );
  }

  const NUM_STARS = 15;
  const stars = Array.from({ length: NUM_STARS }, (_, i) => ({
    key: i,
    cx: Math.random() * screenWidth,
    cy: Math.random() * screenHeight,
    r: Math.random() * 1.5 + 0.3,
    opacity: Math.random() * 0.8 + 0.2,
  }));

  return (
    <TouchEditContainer style={{ flexDirection: "row" }}>
      {/* Background gradient */}
      <Svg
        style={{ position: "absolute", top: 0, left: 0 }}
        width={"100%"}
        height={"100%"}
      >
        <Defs>
          <LinearGradient
            id="backgroundGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#020212" />
            <Stop offset="50%" stopColor="#05051a" />
            <Stop offset="100%" stopColor="#000" />
          </LinearGradient>
        </Defs>

        {/* Background */}
        <Rect width={"100%"} height={"100%"} fill="url(#backgroundGradient)" />

        {/* Stars */}
        {stars.map(({ key, cx, cy, r, opacity }) => (
          <Circle
            key={key}
            cx={cx}
            cy={cy}
            r={r}
            fill="white"
            opacity={opacity}
          />
        ))}
      </Svg>

      <SunComponent weatherData={weatherData} currentTime={currentTime} />
      <RightComponent weatherData={weatherData} />
      <BatteryCharging />
    </TouchEditContainer>
  );
};

export default SunriseMoonrise;

const styles = StyleSheet.create({
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.6,
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
    opacity: 0.8,
  },
});
