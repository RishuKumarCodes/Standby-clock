import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import EditPageFrame from "@/app/components/commmon/EditPageFrame";
import CardsSettings from "./CardsSettings";
import { EditLocationNew } from "../../Common/EditLocationNew";
import { loadSelectedCards } from "@/app/storage/themesStorage/weather/WeatherCardStorage";

interface EditPageProps {
  visible: boolean;
  onClose: () => void;
  availableCards: Array<{
    id: string;
    title: string;
    component: React.ComponentType<any>;
  }>;
  selectedCards: string[];
  onSelectionChange: (newSelection: string[]) => void;
}

const EditPage: React.FC<EditPageProps> = ({
  visible,
  onClose,
  availableCards,
  selectedCards,
  onSelectionChange,
}) => {
  const [currentSelectedCards, setCurrentSelectedCards] =
    useState<string[]>(selectedCards);

  // Update local state when selectedCards prop changes
  useEffect(() => {
    setCurrentSelectedCards(selectedCards);
  }, [selectedCards]);

  // Load selected cards from storage when modal becomes visible
  useEffect(() => {
    if (visible) {
      const loadCurrentSelection = async () => {
        try {
          const storedCards = await loadSelectedCards();
          setCurrentSelectedCards(storedCards);
        } catch (error) {
          console.error("Failed to load current selection:", error);
        }
      };
      loadCurrentSelection();
    }
  }, [visible]);

  const handleCardSelectionChange = (newSelection: string[]) => {
    setCurrentSelectedCards(newSelection);
    // Immediately propagate changes to parent
    onSelectionChange(newSelection);
  };

  const handleSaveAll = () => {
    // Final save - ensure parent has the latest selection
    onSelectionChange(currentSelectedCards);
    onClose();
  };

  const handleClose = () => {
    // Reload current selection from storage when closing without saving
    const reloadSelection = async () => {
      try {
        const storedCards = await loadSelectedCards();
        setCurrentSelectedCards(storedCards);
        onSelectionChange(storedCards);
      } catch (error) {
        console.error("Failed to reload selection:", error);
      }
    };
    reloadSelection();
    onClose();
  };

  const tabs = [
    {
      id: "cards",
      label: "Cards",
      icon: <AntDesign name="appstore1" size={15} color="#999" />,
      content: (
        <CardsSettings
          selectedCards={currentSelectedCards}
          onSelectionChange={handleCardSelectionChange}
          onClose={onClose}
        />
      ),
    },
    {
      id: "location",
      label: "Location",
      icon: <MaterialIcons name="location-on" size={16} color="#999" />,
      content: <EditLocationNew onClose={onClose} />,
    },
  ];

  return (
    <EditPageFrame
      visible={visible}
      onClose={handleClose}
      onSave={handleSaveAll}
      tabs={tabs}
    />
  );
};

export default EditPage;
