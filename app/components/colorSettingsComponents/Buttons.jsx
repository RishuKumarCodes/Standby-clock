import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";

const Buttons = ({ setTempColor, tempColor, userColor, setUserColor }) => {
  const generateRandomColor = () => {
    let color = "#";
    const letters = "0123456789ABCDEF";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleApplyColor = () => {
    setUserColor(tempColor);
  };

  const handleGenerateRandomColor = () => {
    const randomColor = generateRandomColor();
    setUserColor(randomColor);
    setTempColor(randomColor);
  };

  return (
    <>
      {/* Custom Color Input */}
      <View
        style={[
          styles.CustomColCard,
          { borderBottomRightRadius: 6, borderBottomLeftRadius: 6 },
        ]}
      >
        <View style={styles.cardElement}>
          <TextInput
            style={styles.input}
            value={tempColor}
            onChangeText={setTempColor}
            placeholder="#FFFFFF"
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.cardBtn} onPress={handleApplyColor}>
            <Text style={styles.cardBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Random Color Generator */}
      <View
        style={[
          styles.CustomColCard,
          { borderTopRightRadius: 6, borderTopLeftRadius: 6 },
        ]}
      >
        <View style={styles.cardElement}>
          <TouchableOpacity
            style={styles.cardBtn}
            onPress={handleGenerateRandomColor}
          >
            <Text style={styles.cardBtnText}>Randomise</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.randomColPreview,
              { backgroundColor: userColor || "#000" },
            ]}
          />
        </View>
      </View>
    </>
  );
};

export default Buttons;

const styles = StyleSheet.create({
  CustomColCard: {
    backgroundColor: "#151f1b",
    borderColor: "#101413",
    borderWidth: 1,
    borderRadius: 23,
    paddingHorizontal: 13,
    padding: 7.5,
    marginHorizontal: "auto",
    width: 250,
    marginBottom: 3,
  },
  input: {
    flex: 1,
    color: "#fff",
    padding: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  cardElement: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardBtn: {
    backgroundColor: "#888f00",
    paddingVertical: 7,
    paddingHorizontal: 23,
    borderRadius: 30,
  },

  cardBtnText: {
    color: "#fff",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },

  randomColPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
  },
});
