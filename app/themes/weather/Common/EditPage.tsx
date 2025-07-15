import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  geocodeAddress,
  reverseGeocode,
  GeocodingResult,
} from "../../../utils/geocodingService";
import {
  setUserLocation,
  getUserLocation,
} from "../../../utils/weatherService";
import { WeatherLocation } from "@/app/storage/themesStorage/weather";
import { MdTxt } from "@/app/components/ui/CustomText";
import { AntDesign } from "@expo/vector-icons";

interface EditPageProps {
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;
  onLocationUpdate?: () => void;
}

const EditPage: React.FC<EditPageProps> = ({
  showLocationModal,
  setShowLocationModal,
}) => {
  const [addressInput, setAddressInput] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvancedInput, setShowAdvancedInput] = useState(false);
  const [latInput, setLatInput] = useState("");
  const [lonInput, setLonInput] = useState("");
  const [currentLocation, setCurrentLocation] =
    useState<WeatherLocation | null>(null);

  useEffect(() => {
    if (showLocationModal) {
      loadCurrentLocation();
    }
  }, [showLocationModal]);

  const loadCurrentLocation = async () => {
    try {
      const location = await getUserLocation();
      setCurrentLocation(location);
    } catch (error) {
      console.error("Failed to load current location:", error);
    }
  };

  const handleAddressSearch = async () => {
    if (!addressInput.trim()) {
      Alert.alert("Error", "Please enter an address");
      return;
    }

    try {
      setIsSearching(true);
      setSearchResults([]);

      const results = await geocodeAddress(addressInput.trim());

      if (results.length === 0) {
        Alert.alert(
          "No Results",
          "No locations found for this address. Please try a different search term."
        );
        return;
      }

      setSearchResults(results);
    } catch (error) {
      console.error("Geocoding error:", error);
      Alert.alert(
        "Search Error",
        "Failed to search for the address. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdvancedLocationUpdate = async () => {
    if (!latInput || !lonInput) {
      Alert.alert("Error", "Please enter both latitude and longitude");
      return;
    }

    const newLat = parseFloat(latInput);
    const newLon = parseFloat(lonInput);

    if (
      isNaN(newLat) ||
      isNaN(newLon) ||
      newLat < -90 ||
      newLat > 90 ||
      newLon < -180 ||
      newLon > 180
    ) {
      Alert.alert("Error", "Please enter valid coordinates");
      return;
    }

    try {
      let cityName = `${newLat.toFixed(2)}°N, ${newLon.toFixed(2)}°E`;

      try {
        const reverseResults = await reverseGeocode(newLat, newLon);
        if (reverseResults.length > 0) {
          cityName = reverseResults[0].displayName;
        }
      } catch (reverseError) {
        console.warn("Reverse geocoding failed:", reverseError);
      }

      const newLocation: WeatherLocation = {
        lat: newLat,
        lon: newLon,
        cityName: cityName,
      };

      await setUserLocation(newLocation);
      setCurrentLocation(newLocation);
      setShowLocationModal(false);
      setAddressInput("");
      setSearchResults([]);
      setLatInput("");
      setLonInput("");
    } catch (error) {
      Alert.alert("Error", "Failed to update location");
      console.error("Location update error:", error);
    }
  };

  const handleLocationSelect = async (result: GeocodingResult) => {
    try {
      const newLocation: WeatherLocation = {
        lat: result.lat,
        lon: result.lon,
        cityName: result.displayName,
      };

      await setUserLocation(newLocation);
      setCurrentLocation(newLocation);
      setShowLocationModal(false);
      setAddressInput("");
      setSearchResults([]);
      setLatInput("");
      setLonInput("");
    } catch (error) {
      Alert.alert("Error", "Failed to update location");
      console.error("Location update error:", error);
    }
  };

  const handleModalClose = () => {
    setShowLocationModal(false);
    setSearchResults([]);
    setAddressInput("");
    setLatInput("");
    setLonInput("");
  };

  const renderSearchResult = ({ item }: { item: GeocodingResult }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleLocationSelect(item)}
    >
      <Text style={styles.searchResultText}>{item.displayName}</Text>
      <Text style={styles.searchResultCoords}>
        {item.lat.toFixed(4)}, {item.lon.toFixed(4)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={showLocationModal}
      transparent
      animationType="slide"
      onRequestClose={handleModalClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <MdTxt style={styles.modalTitle}>Update Location</MdTxt>
              <MdTxt style={{ fontSize: 14, color: "#999", marginTop: -4 }}>
                &bull; {currentLocation?.cityName}
              </MdTxt>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleModalClose}
                style={styles.cancelBtn}
              >
                <MdTxt>Cancel</MdTxt>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchInputContainer}>
            <TextInput
              placeholderTextColor="#777"
              placeholder="Enter city, address, or landmark"
              value={addressInput}
              onChangeText={setAddressInput}
              style={[styles.input, { fontSize: 18, fontWeight: "400" }]}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleAddressSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <AntDesign name="search1" size={24} color="black" />
              )}
            </TouchableOpacity>

            {searchResults.length > 0 && (
              <View style={styles.resultsSection}>
                <FlatList
                  data={searchResults}
                  renderItem={renderSearchResult}
                  keyExtractor={(item, index) =>
                    `${item.lat}-${item.lon}-${index}`
                  }
                  style={styles.resultsList}
                  maxHeight={200}
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.advancedToggle}
            onPress={() => setShowAdvancedInput(!showAdvancedInput)}
          >
            <Text style={styles.advancedToggleText}>
              {showAdvancedInput ? "▼ " : "▶ "} Advanced (Coordinates)
            </Text>
          </TouchableOpacity>

          {showAdvancedInput && (
            <>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <TextInput
                  style={styles.input}
                  placeholder="Latitude (-90 to 90)"
                  value={latInput}
                  onChangeText={setLatInput}
                  keyboardType="numeric"
                  placeholderTextColor="#777"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Longitude (-180 to 180)"
                  value={lonInput}
                  onChangeText={setLonInput}
                  keyboardType="numeric"
                  placeholderTextColor="#777"
                />
              </View>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleAdvancedLocationUpdate}
              >
                <MdTxt>Update from Coordinates</MdTxt>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export { EditPage };

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    padding: 7,
    paddingBottom: 5,
    paddingHorizontal: 20,
    backgroundColor: "#0c4532",
    borderRadius: 30,
    minWidth: 80,
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 500,
    height: 300,
    backgroundColor: "#1b2b26",
    borderRadius: 25,
    padding: 18,
    paddingHorizontal: 20,
    gap: 10,
  },
  modalTitle: { fontSize: 22 },
  searchInputContainer: {
    marginTop: 6,
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  searchButton: {
    backgroundColor: "#E6F904",
    borderRadius: 70,
    padding: 9,
    paddingHorizontal: 20,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  resultsSection: {
    position: "absolute",
    top: 50,
    zIndex: 50,
    width: "100%",
    marginBottom: 3,
  },
  resultsList: {
    maxHeight: 200,
  },
  searchResultItem: {
    backgroundColor: "#264a3e",
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  searchResultText: {
    fontSize: 14,
    color: "#ccc",
    fontWeight: "500",
  },
  searchResultCoords: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  advancedToggle: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  advancedToggleText: {
    fontSize: 14,
    color: "#8fb2db",
    fontWeight: "500",
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#555",
    paddingHorizontal: 8,
    color: "#fff",
    paddingVertical: 10,
  },
  updateButton: {
    backgroundColor: "#0c4532",
    margin: "auto",
    padding: 10,
    paddingBottom: 8,
    paddingHorizontal: 15,
    borderRadius: 80,
    alignItems: "center",
  },
});
