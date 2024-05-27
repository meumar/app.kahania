import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

function LoadingOverlay({ message }) {
  return (
    <View style={styles.rootContainer}>
      <ActivityIndicator size="large" color={colors.primary800} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
  },
});
