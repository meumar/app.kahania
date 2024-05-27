import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../constants/colors";

export default function Button({
  children,
  style,
  onPress,
  loading,
  disabled = false,
}) {
  if (loading) {
    return (
      <View style={[styles.container]}>
        <View style={styles.loadingContaiter}>
          <Text style={[styles.text, styles.loadingText]}>{children}</Text>
          <ActivityIndicator size="small" color="white" />
        </View>
      </View>
    );
  }
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        style,
        pressed && styles.pressed,
        disabled && styles.pressed
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={[styles.text]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    marginRight: 6,
  },
  loadingContaiter: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  pressed: {
    opacity: 0.75,
  },
  container: {
    padding: 6,
    backgroundColor: colors.primary800,
    borderRadius: 36,
    padding: 12,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
