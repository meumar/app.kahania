import { View, StyleSheet } from "react-native";

export default function Card({ children, parentStyle }) {
  return (
    <View style={styles.container}>
      <View style={[styles.innerContainer, parentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: 'white',
    // elevation: 3,
  },
});
