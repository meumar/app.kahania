import { Pressable, StyleSheet } from "react-native";
import {
  Ionicons,
  AntDesign,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";

function IconButton({
  icon,
  color,
  size,
  onPress,
  style,
  isAntDesign,
  isFontAwesome,
  isMaterialIcons,
}) {
  let iconComponent = <Ionicons name={icon} color={color} size={size} />;
  if (isAntDesign) {
    iconComponent = <AntDesign name={icon} color={color} size={size} />;
  }
  if (isFontAwesome) {
    iconComponent = <FontAwesome name={icon} color={color} size={size} />;
  }
  if (isMaterialIcons) {
    iconComponent = <MaterialIcons name={icon} color={color} size={size} />;
  }
  return (
    <Pressable
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
      onPress={onPress}
    >
      {iconComponent}
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  button: {
    margin: 8,
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});
