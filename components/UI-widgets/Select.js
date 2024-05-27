import { View, StyleSheet, Text } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialIcons } from "@expo/vector-icons";

export default function Select({ data, onSelect , defaultValue}) {
  return (
    <SelectDropdown
      data={data}
      onSelect={(selectedItem, index) => {
        onSelect(selectedItem, index)
      }}
      renderButton={(selectedItem, isOpened) => {
        return (
          <View style={styles.dropdownButtonStyle}>
            {selectedItem && (
              <MaterialIcons
                name={selectedItem.icon}
                style={styles.dropdownButtonIconStyle}
              />
            )}
            <Text style={styles.dropdownButtonTxtStyle}>
              {(selectedItem && selectedItem.title) || "Select your mood"}
            </Text>
          </View>
        );
      }}
      renderItem={(item, index, isSelected) => {
        return (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && { backgroundColor: "#D2D9DF" }),
            }}
          >
            <MaterialIcons name={item.icon} size={18} color="black" />
            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
          </View>
        );
      }}
      defaultValue={defaultValue}
    />
  );
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: 100,
    height: 25,
    backgroundColor: "#E9ECEF",
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 12,
  },
  dropdownButtonIconStyle: {
    fontSize: 16,
    marginRight: 4,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 12,
    marginRight: 4,
  },
});
