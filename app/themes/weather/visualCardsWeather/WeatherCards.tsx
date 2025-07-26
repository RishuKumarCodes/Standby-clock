import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import { getDetailedWeather } from "@/app/utils/weatherService.ts";
import EditPage from "./components/EditPage.tsx";
import TemperatureCard from "./components/TempratureCard.jsx";
import FeelsLikeCard from "./components/FeelsLikeCard.jsx";
import CloudCoverCard from "./components/CloudCoverCard.jsx";
import PrecipitationCard from "./components/PrecipitationCard.jsx";
import WindCard from "./components/WindCard.jsx";
import HumidityCard from "./components/HumidityCard.jsx";
import UVCard from "./components/UVCard.jsx";
import AQICard from "./components/AQICard.jsx";
import VisibilityCard from "./components/VisibilityCard.jsx";
import PressureCard from "./components/PressureCard.jsx";

import {
  loadSelectedCards,
  saveSelectedCards,
  getAvailableCards,
} from "@/app/storage/themesStorage/weather/WeatherCardStorage.js";
import { TouchEditContainer } from "@/app/components/ui/TouchEditContainer.tsx";
import { MdTxt } from "@/app/components/ui/CustomText.jsx";

const { width, height } = Dimensions.get("screen");

const WeatherCards = ({ variant = "full" }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [availableCards, setAvailableCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  if (variant !== "full") {
    return (
      <Image
        source={require("../../../../assets/images/weatherCardPreview.jpg")}
        style={{ height: "100%", width: "100%" }}
      />
    );
  }

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
        const data = await getDetailedWeather();
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
        <View
          key={card.id}
          style={[
            styles.cardWrapper,
            {
              maxHeight:
                selectedCards.length < 4 ? height - 10 : (height - 10) / 2,
              minWidth:
                selectedCards.length == 4 ? (width - 20) / 2 : (width - 30) / 3,
            },
          ]}
        >
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
      <View style={styles.dashboard}>
        <View style={styles.cardsContainer}>{renderSelectedCards()}</View>
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
    height: "100%",
    padding: 5,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  dashboard: {
    minWidth: width - 10,
  },
  cardsContainer: {
    flexDirection: "row",
    height: "100%",
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    flex: 1,
    overflow: "hidden",
    padding: 5,
  },
});

export default WeatherCards;
