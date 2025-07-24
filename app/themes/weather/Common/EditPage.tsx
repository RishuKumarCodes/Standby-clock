import React, { useState, useEffect } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import EditPageFrame from "@/app/components/commmon/EditPageFrame";
import { EditLocationNew } from "./EditLocationNew";

interface EditPageProps {
  visible: boolean;
  onClose: () => void;
}

const EditPage: React.FC<EditPageProps> = ({ visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const loadCurrentSelection = async () => {
        try {
        } catch (error) {
          console.error("Failed to load current selection:", error);
        }
      };
      loadCurrentSelection();
    }
  }, [visible]);

  const handleSaveAll = () => {
    onClose();
  };

  const handleClose = () => {
    const reloadSelection = async () => {
      try {
      } catch (error) {
        console.error("Failed to reload selection:", error);
      }
    };
    reloadSelection();
    onClose();
  };

  const tabs = [
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
