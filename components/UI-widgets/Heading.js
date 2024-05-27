import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";


export default function Heading({ heading, caption }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.headingText}>{heading}</Text>
      <Text style={styles.headingCaption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    alignItems: "flex-start",
    padding: 12,
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.mainText,
  },
  headingCaption: {
    fontSize: 12,
    marginVertical: 6,
    color: colors.subText,
  },
});
