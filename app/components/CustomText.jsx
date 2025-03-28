import React from "react";
import { Text, StyleSheet } from "react-native";

const H1Txt = ({ style, ...props }) => {
  return <Text style={[styles.h1, style]} {...props} />;
};

const MdTxt = ({ style, ...props }) => {
  return <Text style={[styles.md, style]} {...props} />;
};

const DimTxt = ({ style, ...props }) => {
  return <Text style={[styles.dim, style]} {...props} />;
};
const H1Light = ({ style, ...props }) => {
  return <Text style={[styles.h1Light, style]} {...props} />;
};

const styles = StyleSheet.create({
  h1: {
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    fontSize: 20,
  },
  md: {
    color: "#e0e0e0",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  dim: {
    fontFamily: "Poppins-Regular",
    color: "#636363",
    fontSize: 12,
  },
  h1Light: {
    fontFamily: "Poppins-ExtraLight",
    color: "#fff",
    fontSize: 37,
  },
});

export { H1Txt, MdTxt, DimTxt, H1Light };
