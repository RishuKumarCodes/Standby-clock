import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
// Import your weather service functions
import { getDetailedWeather } from "../../utils/weatherService";

const ConsoleLogClock = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndLogWeatherData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Test coordinates (Delhi as example)
        const testLat = 28.6139;
        const testLon = 77.209;

        console.log("=== STARTING WEATHER DATA FETCH ===");
        console.log(`Test coordinates: ${testLat}, ${testLon}`);

        // Fetch detailed weather data
        console.log("\n=== FETCHING DETAILED WEATHER DATA ===");
        const detailedWeather = await getDetailedWeather(testLat, testLon);

        console.log("📊 DETAILED WEATHER DATA:");
        console.log(
          "Current Weather:",
          JSON.stringify(detailedWeather.current, null, 2)
        );
        console.log(
          "Air Quality:",
          JSON.stringify(detailedWeather.airQuality, null, 2)
        );
        console.log("Sun Times:", JSON.stringify(detailedWeather.sun, null, 2));
        console.log("Timezone:", detailedWeather.timezone);
        console.log("Elevation:", detailedWeather.elevation);
        console.log("Last Updated:", detailedWeather.lastUpdated);

        console.log("\n📈 HOURLY DATA (first 6 hours):");
        detailedWeather.hourly.slice(0, 6).forEach((hour, index) => {
          console.log(`Hour ${index + 1}:`, JSON.stringify(hour, null, 2));
        });

        console.log("\n📅 DAILY DATA (first 3 days):");
        detailedWeather.daily.slice(0, 3).forEach((day, index) => {
          console.log(`Day ${index + 1}:`, JSON.stringify(day, null, 2));
        });

        // Fetch legacy weather data for comparison
        console.log("\n=== FETCHING LEGACY WEATHER DATA ===");

        console.log("\n=== WEATHER DATA FETCH COMPLETED ===");
      } catch (err) {
        console.error("❌ WEATHER FETCH ERROR:", err);
        console.error("Error details:", {
          message: err.message,
          stack: err.stack,
          name: err.name,
        });
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndLogWeatherData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minimal Weather</Text>
      {isLoading && <Text style={styles.status}>Loading weather data...</Text>}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {!isLoading && !error && (
        <Text style={styles.success}>
          Weather data fetched successfully! Check console for details.
        </Text>
      )}
    </View>
  );
};

export default ConsoleLogClock;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: "#666",
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  success: {
    fontSize: 16,
    color: "green",
    textAlign: "center",
  },
});
