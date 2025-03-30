import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Entypo from "@expo/vector-icons/Entypo";
import Foundation from "@expo/vector-icons/Foundation";

const TimerComponent = ({ totalTime = 1500 }) => {
  const [initialTime, setInitialTime] = useState(totalTime);
  const [time, setTime] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const { width, height } = Dimensions.get("window");
  const circleSize = Math.min(width, height) * 0.65;
  const strokeWidth = circleSize * 0.03;
  const radius = circleSize / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = (initialTime - time) / initialTime;
  const strokeDashoffset = circumference * (1 - progress);

  const handlePlayPause = () => {
    if (time === 0) return;
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setTime(initialTime);
    setIsRunning(false);
  };

  const handleAddTime = () => {
    setInitialTime((prev) => prev + 600);
    setTime((prev) => prev + 600);
  };

  const handleSubtractTime = () => {
    if (initialTime < 600) {
      console.warn(
        "Cannot subtract time: Timer duration is less than 10 minutes"
      );
      return;
    }
    setInitialTime((prev) => prev - 600);
    setTime((prev) => Math.max(prev - 600, 0));
    if (time - 600 <= 0) {
      setIsRunning(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.svgContainer, { width: circleSize, height: circleSize }]}
      >
        <Svg width={circleSize} height={circleSize}>
          {/* Background Circle */}
          <Circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="#242424"
            strokeWidth={strokeWidth}
            fill="none"
            transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
          />
          {/* Progress Circle */}
          <Circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="#8F9EFF"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
          />
        </Svg>

        {/* Overlay container for Timer Text & Reset Button */}
        <View style={styles.centeredOverlay}>
          <Text style={[styles.timerText, { fontSize: circleSize * 0.2 }]}>
            {formatTime(time)}
          </Text>
          <TouchableOpacity
            onPress={handleReset}
            style={[styles.resetButton, { marginTop: circleSize * 0.05 * -1 }]}
          >
            <EvilIcons name="refresh" size={circleSize * 0.17} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Controls Row: Subtract, Play/Pause, and Add */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={handlePlayPause}
          style={[
            styles.playPauseButton,
            {
              width: circleSize * 0.25,
              height: circleSize * 0.25,
              borderRadius: (circleSize * 0.3) / 2,
            },
          ]}
        >
          {isRunning ? (
            <Foundation name="pause" size={circleSize * 0.12} color="black" />
          ) : (
            <Entypo
              name="controller-play"
              size={circleSize * 0.12}
              color="black"
            />
          )}
        </TouchableOpacity>
        <View style={styles.adjustBtnController}>
          <TouchableOpacity
            onPress={handleSubtractTime}
            style={styles.adjustButton}
          >
            <Text style={styles.adjustButtonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddTime} style={styles.adjustButton}>
            <Text style={styles.adjustButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TimerComponent;

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  svgContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  centeredOverlay: {
    position: "absolute",
    justifyContent: "flex-end",
    paddingBottom: "15%",
    alignItems: "center",
  },
  timerText: {
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
  },
  resetButton: {
    aspectRatio: 1,
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  controlsContainer: {
    position: "absolute",
    width: "88%",
    bottom: "7%",
    left: "7%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  adjustBtnController: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 80,

    paddingHorizontal: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  adjustButton: {
    height: "80%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  adjustButtonText: {
    color: "#aaa",
    fontSize: 25,
    fontFamily: "SpaceMono-Regular",
  },
  playPauseButton: {
    backgroundColor: "#FF8DA1",
    justifyContent: "center",
    alignItems: "center",
  },
});
