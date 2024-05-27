import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors } from "../../constants/colors";

function SkeletonPlaceholderComponent() {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}></View>
      <View style={styles.innerContainer}></View>
    </View>
  );
}

export default SkeletonPlaceholderComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    height: 200,
  }
});