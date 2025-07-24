import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { fetchDetailedWeatherData } from "@/app/api/weatherAPI";
import EditPage from "./components/EditPage.tsx";
import {
  TemperatureCard,
  FeelsLikeCard,
  CloudCoverCard,
  PrecipitationCard,
  WindCard,
  HumidityCard,
  UVCard,
  AQICard,
  VisibilityCard,
  PressureCard,
} from "./components/Cards.jsx";
import {
  loadSelectedCards,
  saveSelectedCards,
  getAvailableCards,
} from "@/app/storage/themesStorage/weather/WeatherCardStorage.js";
import { TouchEditContainer } from "@/app/components/ui/TouchEditContainer.tsx";
import { MdTxt } from "@/app/components/ui/CustomText.jsx";

const { width, height } = Dimensions.get("window");

const EditIcon = ({ size = 24, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const WeatherCards = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [availableCards, setAvailableCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Component mapping for card rendering
  const cardComponentMap = {
    temperature: TemperatureCard,
    feelsLike: FeelsLikeCard,
    cloudCover: CloudCoverCard,
    precipitation: PrecipitationCard,
    wind: WindCard,
    humidity: HumidityCard,
    uv: UVCard,
    aqi: AQICard,
    visibility: VisibilityCard,
    pressure: PressureCard,
  };

  // Load initial data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);

        // Load available cards and selected cards from storage
        const [loadedCards, availableCardsData] = await Promise.all([
          loadSelectedCards(),
          Promise.resolve(getAvailableCards()),
        ]);

        // Map available cards with component references
        const cardsWithComponents = availableCardsData.map((card) => ({
          ...card,
          component: cardComponentMap[card.id],
        }));

        setSelectedCards(loadedCards);
        setAvailableCards(cardsWithComponents);

        console.log("Loaded cards from storage:", loadedCards);
      } catch (error) {
        console.error("Failed to initialize card data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Load weather data
  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        const data = await fetchDetailedWeatherData(25.6, 85.1);
        setWeatherData(data);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      }
    };
    loadWeatherData();
  }, []);

  // Handle card selection changes
  const handleCardSelection = useCallback(async (newSelection) => {
    try {
      // Save to storage
      await saveSelectedCards(newSelection);

      // Update local state
      setSelectedCards(newSelection);
    } catch (error) {
      console.error("Failed to save card selection:", error);
    }
  }, []);

  // Render selected cards
  const renderSelectedCards = () => {
    if (isLoading || selectedCards.length === 0) {
      return null;
    }

    const cardsToRender = availableCards.filter((card) =>
      selectedCards.includes(card.id)
    );

    return cardsToRender.map((card) => {
      const CardComponent = card.component;
      if (!CardComponent) {
        console.warn(`No component found for card: ${card.id}`);
        return null;
      }

      return (
        <View key={card.id} style={styles.cardWrapper}>
          <CardComponent data={weatherData} />
        </View>
      );
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <MdTxt>loading weather...</MdTxt>
      </View>
    );
  }

  return (
    <TouchEditContainer
      style={styles.container}
      setShowModal={setIsEditModalVisible}
    >
      <View style={styles.scrollView}>
        <View style={styles.dashboard}>
          <View style={styles.cardsContainer}>{renderSelectedCards()}</View>
        </View>
      </View>

      <EditPage
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        availableCards={availableCards}
        selectedCards={selectedCards}
        onSelectionChange={handleCardSelection}
      />
    </TouchEditContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  dashboard: {
    padding: 25,
    minWidth: width,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: (width - 70) / 2,
    marginBottom: 20,
  },
});

export default WeatherCards;
