import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MdTxt } from "@/app/components/ui/CustomText";
import {
  loadSelectedCards,
  saveSelectedCards,
  getAvailableCards,
} from "@/app/storage/themesStorage/weather/WeatherCardStorage";
import TickIcon from "@/assets/icons/TickIcon";

interface Card {
  id: string;
  title: string;
}

interface CardsSettingsProps {
  selectedCards: string[];
  onSelectionChange: (newSelection: string[]) => void;
  onClose: () => void;
}

const CardsSettings: React.FC<CardsSettingsProps> = ({
  selectedCards,
  onSelectionChange,
  onClose,
}) => {
  const [tempSelection, setTempSelection] = useState<string[]>([]);
  const [availableCards, setAvailableCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        const [currentSelection, cardsData] = await Promise.all([
          loadSelectedCards(),
          Promise.resolve(getAvailableCards()),
        ]);

        setAvailableCards(cardsData);
        setTempSelection(currentSelection);
      } catch (error) {
        console.error("Failed to initialize CardsSettings:", error);
        Alert.alert("Error", "Failed to load card settings");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (selectedCards.length > 0) {
      setTempSelection(selectedCards);
    }
  }, [selectedCards]);

  const toggleCard = async (cardId: string) => {
    let newSelection: string[];

    if (tempSelection.includes(cardId)) {
      if (tempSelection.length === 1) {
        // Alert.alert(
        //   "At least One Card Required",
        //   "You must select at least one card."
        // );
        return;
      }
      newSelection = tempSelection.filter((id) => id !== cardId);
    } else if (tempSelection.length < 6) {
      newSelection = [...tempSelection, cardId];
    } else {
      Alert.alert("Limit Reached", "You can select maximum 6 cards");
      return;
    }

    setTempSelection(newSelection);

    try {
      await saveSelectedCards(newSelection);
      onSelectionChange(newSelection);
      console.log("Auto-saved card selection:", newSelection);
    } catch (error) {
      console.error("Auto-save failed:", error);
      Alert.alert("Error", "Failed to save card settings");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <MdTxt style={styles.loadingText}>Loading settings...</MdTxt>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <MdTxt style={styles.title}>
        Cards selected: {tempSelection.length} / 6
      </MdTxt>

      <View style={styles.list}>
        {availableCards.map((card) => {
          const selected = tempSelection.includes(card.id);
          return (
            <TouchableOpacity
              key={card.id}
              style={[styles.item, selected && styles.itemSelected]}
              onPress={() => toggleCard(card.id)}
            >
              <View style={styles.itemContent}>
                <MdTxt style={styles.itemTitle}>{card.title}</MdTxt>
                <View style={styles.checkbox}>
                  {selected && (
                    <>
                      <TickIcon size={25} color={"#E6F904"} />
                    </>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default CardsSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ccc",
    fontSize: 16,
  },
  title: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
    color: "#bbb",
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  resetButtonText: {
    color: "#ccc",
    fontSize: 12,
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  item: {
    width: "49%",
    marginBottom: 10,
    borderRadius: 50,
    padding: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  itemSelected: {
    backgroundColor: "rgba(230, 249, 4, 0.1)",
    borderColor: "#E6F904",
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 16,
    color: "white",
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
