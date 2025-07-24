import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "weather_cards_selection";

const DEFAULT_CARDS = [
  "temperature",
  "feelsLike",
  "cloudCover",
  "precipitation",
  "wind",
];

// Available card definitions
export const AVAILABLE_CARDS = [
  { id: "temperature", title: "Temperature" },
  { id: "feelsLike", title: "Feels Like" },
  { id: "cloudCover", title: "Cloud Cover" },
  { id: "precipitation", title: "Precipitation" },
  { id: "wind", title: "Wind" },
  { id: "humidity", title: "Humidity" },
  { id: "uv", title: "UV Index" },
  { id: "aqi", title: "Air Quality" },
  { id: "visibility", title: "Visibility" },
  { id: "pressure", title: "Pressure" },
];

/**
 * Save selected cards to storage
 * @param {string[]} selectedCards - Array of card IDs
 */
export const saveSelectedCards = async (selectedCards) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCards));
  } catch (error) {
    console.error("Error saving cards:", error);
    throw error;
  }
};

/**
 * Load selected cards from storage
 * @returns {Promise<string[]>} Array of card IDs
 */
export const loadSelectedCards = async () => {
  try {
    const storedCards = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedCards) {
      const parsedCards = JSON.parse(storedCards);
      // Validate that all stored cards exist in available cards
      const validCards = parsedCards.filter((cardId) =>
        AVAILABLE_CARDS.some((card) => card.id === cardId)
      );
      return validCards.length > 0 ? validCards : DEFAULT_CARDS;
    }
    return DEFAULT_CARDS;
  } catch (error) {
    console.error("Error loading cards:", error);
    return DEFAULT_CARDS;
  }
};

/**
 * Reset to default cards
 */
// export const resetToDefaultCards = async () => {
//   try {
//     await saveSelectedCards(DEFAULT_CARDS);
//     return DEFAULT_CARDS;
//   } catch (error) {
//     console.error("Error resetting cards:", error);
//     throw error;
//   }
// };

/**
 * Get available cards for selection
 * @returns {Object[]} Array of available card objects
 */
export const getAvailableCards = () => {
  return AVAILABLE_CARDS;
};

/**
 * Validate card selection (max 6 cards)
 * @param {string[]} selectedCards - Array of card IDs to validate
 * @returns {boolean} Whether the selection is valid
 */
// export const validateCardSelection = (selectedCards) => {
//   return selectedCards.length <= 6 && selectedCards.length > 0;
// };

/**
 * Get card title by ID
 * @param {string} cardId - Card ID
 * @returns {string} Card title or empty string if not found
 */
export const getCardTitle = (cardId) => {
  const card = AVAILABLE_CARDS.find((c) => c.id === cardId);
  return card ? card.title : "";
};
