import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MdTxt } from "@/app/components/ui/CustomText";
import { ScrollView } from "react-native-gesture-handler";

const colorGroups = [
  {
    title: "Neutrals",
    colors: ["#FFFFFF", "#ffe0c4", "#d9d9ff", "#737373", "#6B5762", "#565C6A"],
  },
  {
    title: "Pastels",
    colors: [
      "#9AC78F",
      "#7DC4C9",
      "#B0E0E6",
      "#7AAAF1",
      "#8683FF",
      "#c78fc0",
      "#E683BD",
      "#FF788C",
      "#FF8D7B",
      "#FFA568",
      "#F8D175",
      "#b88d33",
    ],
  },
  {
    title: "Saturated",
    colors: ["#8e9e00", "#008080", "#2070ba", "#673AB7", "#ad174e", "#bf280d"],
  },
  {
    title: "Neon",
    colors: ["#00FFFF", "#39FF14", "#FFFF33", "#FF00FF", "#FF0000", "#001eff"],
  },
];

const ColorPallete = ({ userColor, setUserColor, setTempColor }) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.rightSection}
      contentContainerStyle={styles.rightContent}
    >
      {colorGroups.map((group) => (
        <View key={group.title} style={styles.groupContainer}>
          <MdTxt style={styles.colorTitle}>{group.title}</MdTxt>
          <View style={styles.colorRow}>
            {group.colors.map((color) => {
              const isSelected =
                userColor?.toLowerCase() === color.toLowerCase();
              return (
                <TouchableOpacity
                  key={color}
                  style={[
                    // styles.swatch,
                    { margin: 5 },
                    isSelected && styles.selectedSwatchBorder,
                  ]}
                  onPress={() => {
                    setUserColor(color);
                    setTempColor(color);
                  }}
                >
                  <View
                    style={[
                      styles.swatch,
                      { backgroundColor: color },
                      isSelected && styles.selectedSwatch,
                    ]}
                  ></View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default ColorPallete;

const styles = StyleSheet.create({
  rightSection: {
    maxWidth: 340,
    Width: 340,
    minWidth: 340,
  },
  rightContent: {
    paddingTop: 70,
    paddingBottom: 40,
  },

  groupContainer: {
    marginBottom: 16,
  },
  colorTitle: {
    paddingLeft: 5,
    color: "#aaa",
  },

  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
  },
  selectedSwatchBorder: {
    borderRadius: 20,
    borderColor: "#E6F904",
    borderWidth: 3,
  },
  selectedSwatch: {
    width: 32,
    margin: 1,
    height: 32,
  },
});
