import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../../constants/colors";

export default function LinkButton({ children, textStyle, onPress }) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {},
  text: {
    fontWeight: "600",
    color: colors.primary800
  },
});
