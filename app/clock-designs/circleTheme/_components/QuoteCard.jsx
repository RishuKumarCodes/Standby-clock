import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SvgXml } from "react-native-svg";

const DAILY_QUOTE_KEY = "dailyQuote";
const DAILY_QUOTE_DATE_KEY = "dailyQuoteDate";

const balanceQuoteText = (text) => {
  if (!text) return "";
  const words = text.split(" ");
  const mid = Math.floor(words.length / 2);
  return words.slice(0, mid).join(" ") + "\n" + words.slice(mid).join(" ");
};

const QuoteCard = ({ color, bgCol }) => {
  const [dailyQuote, setDailyQuote] = useState(null);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const onLayout = useCallback((e) => {
    const { width, height } = e.nativeEvent.layout;
    setLayout({ width, height });
  }, []);

  const quoteSize = useMemo(
    () => (layout.width ? layout.width * 0.044 : 20),
    [layout.width]
  );
  const authorSize = useMemo(
    () => (layout.width ? layout.width * 0.03 : 16),
    [layout.width]
  );
  const borderRadius = useMemo(
    () => (layout.width ? layout.width * 0.08 : 12),
    [layout.width]
  );

  const svgMarkup = useMemo(
    () => `
      <svg fill="${color}" height="800px" width="800px" viewBox="0 0 198 198">
        <g>
          <path d="M0,92.905h48.024c-0.821,35-10.748,38.973-23.216,40.107L20,133.608v38.486l5.542-0.297
            c16.281-0.916,34.281-3.851,46.29-18.676C82.359,140.125,87,118.893,87,86.3V25.905H0V92.905z"/>
          <path d="M111,25.905v67h47.383c-0.821,35-10.427,38.973-22.895,40.107L131,133.608v38.486l5.222-0.297
            c16.281-0.916,34.442-3.851,46.451-18.676C193.199,140.125,198,118.893,198,86.3V25.905H111z"/>
        </g>
      </svg>
    `,
    [color]
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchDailyQuote = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const values = await AsyncStorage.multiGet([
          DAILY_QUOTE_DATE_KEY,
          DAILY_QUOTE_KEY,
        ]);
        const storedDate = values[0][1];
        const storedQuote = values[1][1];

        if (storedDate === today && storedQuote) {
          setDailyQuote(JSON.parse(storedQuote));
          return;
        }

        const res = await fetch("https://zenquotes.io/api/random", { signal });
        const data = await res.json();
        const quoteObj = { text: data[0].q, author: data[0].a };

        await AsyncStorage.multiSet([
          [DAILY_QUOTE_KEY, JSON.stringify(quoteObj)],
          [DAILY_QUOTE_DATE_KEY, today],
        ]);

        setDailyQuote(quoteObj);
      } catch (error) {
        if (error.name === "AbortError") return;
        setDailyQuote({
          text: "Keep pushing forward!",
          author: "",
        });
      }
    };

    fetchDailyQuote();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.container,
        {
          backgroundColor: bgCol,
          borderRadius,
        },
      ]}
    >
      <SvgXml
        xml={svgMarkup}
        width="32%"
        height="32%"
        opacity={0.7}
        style={styles.svg}
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
  container: {
    flex: 1,
    padding: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    position: "absolute",
    top: "-14%",
    left: "-7%",
  },
  quoteText: {
    color: "white",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  authorText: {
    position: "absolute",
    bottom: "8%",
    right: "10%",
    color: "#999",
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
  },
});

export default memo(
  QuoteCard,
  (prev, next) => prev.color === next.color && prev.bgCol === next.bgCol
);
