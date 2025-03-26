import React from "react";
import { Text, StyleSheet } from "react-native";

const H1Txt = ({ style, ...props }) => {
  return <Text style={[styles.h1, style]} {...props} />;
};

const mdTxt = ({ style, ...props }) => {
  return <Text style={[styles.md, style]} {...props} />;
};

const dimTxt = ({ style, ...props }) => {
  return <Text style={[styles.dim, style]} {...props} />;
};

const styles = StyleSheet.create({
  h1: {
    fontFamily: "Poppins-SemiBold",
  },
  md: {
    fontFamily: "Poppins-Medium",
  },
  dim: {
    fontFamily: "Poppins-Regular",
  },
});

export { H1Txt, mdTxt, dimTxt };
