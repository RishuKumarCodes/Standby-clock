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
import { AntDesign, Entypo } from "@expo/vector-icons";

const EditLocationNew = ({ onClose }) => {
  const [addressInput, setAddressInput] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvancedInput, setShowAdvancedInput] = useState(false);
  const [latInput, setLatInput] = useState("");
  const [lonInput, setLonInput] = useState("");
  const [currentLocation, setCurrentLocation] =
    useState<WeatherLocation | null>(null);

  useEffect(() => {
    loadCurrentLocation();
  }, []);

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
      setAddressInput("");
      setSearchResults([]);
      setLatInput("");
      setLonInput("");
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to update location");
      console.error("Location update error:", error);
    }
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
    <View style={{ gap: 4, paddingBottom: 25 }}>
      <View style={styles.header}>
        <MdTxt
          style={{
            fontSize: 14,
            color: "#999",
          }}
        >
          &bull; {currentLocation?.cityName}
        </MdTxt>
      </View>

      <View>
        <View style={styles.searchInputContainer}>
          <TextInput
            placeholderTextColor="#666"
            placeholder="Enter city, address, or landmark"
            value={addressInput}
            onSubmitEditing={handleAddressSearch}
            onChangeText={setAddressInput}
            style={[styles.input, { fontSize: 16, fontWeight: "400" }]}
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
        </View>

        {searchResults.length > 0 && (
          <View style={styles.resultsSection}>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item, index) => `${item.lat}-${item.lon}-${index}`}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.advancedToggle}
        onPress={() => setShowAdvancedInput(!showAdvancedInput)}
      >
        <Text style={styles.advancedToggleText}>
          {showAdvancedInput ? (
            <Entypo name="chevron-thin-down" size={17} color="#8fb2db" />
          ) : (
            <Entypo name="chevron-thin-right" size={17} color="#8fb2db" />
          )}{" "}
          Advanced (Coordinates)
        </Text>
      </TouchableOpacity>

      {showAdvancedInput && (
        <>
          <View style={{ flexDirection: "row", gap: 25 }}>
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
  );
};

export { EditLocationNew };

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchInputContainer: {
    marginBottom: 8,
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
    width: "100%",
    marginBottom: 3,
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
    marginVertical: 8,
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
    marginTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 15,
    borderRadius: 80,
    alignItems: "center",
  },
});
