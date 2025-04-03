import React, { useMemo, memo, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hexToRgba } from "../_helpers";
import { SvgXml } from "react-native-svg";

const DAILY_QUOTE_KEY = "dailyQuote";
const DAILY_QUOTE_DATE_KEY = "dailyQuoteDate";

// Helper function to balance the quote text into two lines
const balanceQuoteText = (text) => {
  if (!text) return "";
  const words = text.split(" ");
  const mid = Math.floor(words.length / 2);
  return words.slice(0, mid).join(" ") + "\n" + words.slice(mid).join(" ");
};

const PillDateDisplay = ({ bgColor, width, height, margin }) => {
  const [dailyQuote, setDailyQuote] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const quoteSize = containerWidth ? containerWidth * 0.06 : 20;
  const authorSize = containerWidth ? containerWidth * 0.04 : 20;
  const bg = useMemo(() => hexToRgba(bgColor, 0.155), [bgColor]);

  const svgMarkup = useMemo(() => {
    return `
      <svg fill="${bgColor}" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 198 198" xml:space="preserve">
        <g>
          <path d="M0,92.905h48.024c-0.821,35-10.748,38.973-23.216,40.107L20,133.608v38.486l5.542-0.297
            c16.281-0.916,34.281-3.851,46.29-18.676C82.359,140.125,87,118.893,87,86.3V25.905H0V92.905z"/>
          <path d="M111,25.905v67h47.383c-0.821,35-10.427,38.973-22.895,40.107L131,133.608v38.486l5.222-0.297
            c16.281-0.916,34.442-3.851,46.451-18.676C193.199,140.125,198,118.893,198,86.3V25.905H111z"/>
        </g>
      </svg>
    `;
  }, [bgColor]);

  useEffect(() => {
    const fetchDailyQuote = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const storedDate = await AsyncStorage.getItem(DAILY_QUOTE_DATE_KEY);
        const storedQuote = await AsyncStorage.getItem(DAILY_QUOTE_KEY);
        let parsedQuote = null;

        if (storedQuote) {
          try {
            parsedQuote = JSON.parse(storedQuote);
          } catch (parseError) {
            console.error(
              "Stored quote is invalid, fetching new one.",
              parseError
            );
            await AsyncStorage.removeItem(DAILY_QUOTE_KEY);
          }
        }

        if (storedDate === today && parsedQuote) {
          setDailyQuote(parsedQuote);
        } else {
          const response = await fetch("https://zenquotes.io/api/random");
          const data = await response.json();
          const quoteObj = { text: data[0].q, author: data[0].a };
          await AsyncStorage.setItem(DAILY_QUOTE_KEY, JSON.stringify(quoteObj));
          await AsyncStorage.setItem(DAILY_QUOTE_DATE_KEY, today);
          setDailyQuote(quoteObj);
        }
      } catch (error) {
        console.error("Error fetching daily quote:", error);
        setDailyQuote({ text: "Keep pushing forward!", author: "" });
      }
    };

    fetchDailyQuote();
  }, []);

  return (
    <View
      style={[
        {
          width,
          height,
          padding: "5%",
          paddingTop: 0,
          borderRadius: height / 4,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          margin,
          marginLeft: 0,
          position: "relative",
        },
      ]}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      <SvgXml
        xml={svgMarkup}
        width="28%"
        height="28%"
        opacity={0.7}
        style={{ position: "absolute", top: "-10%", left: "-5%" }}
      />
      {dailyQuote && (
        <>
          <Text style={[styles.quoteText, { fontSize: quoteSize }]}>
            {balanceQuoteText(dailyQuote.text)}
          </Text>
          <Text style={[styles.authorText, { fontSize: authorSize }]}>
            {`- ${dailyQuote.author}`}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  quoteText: {
    color: "white",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  authorText: {
    position: "absolute",
    fontFamily: "Poppins-SemiBold",
    bottom: "15%",
    right: "10%",
    color: "#999",
    textAlign: "center",
    marginTop: 5,
  },
});

export default memo(PillDateDisplay, (prevProps, nextProps) => {
  return (
    prevProps.bgColor === nextProps.bgColor &&
    prevProps.previewMode === nextProps.previewMode &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.margin === nextProps.margin
  );
});
