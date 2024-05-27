import { Image, StyleSheet, View } from "react-native";

export default function Banner() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/icon.png")}
        resizeMode="cover"
        style={styles.rootScreen}
        imageStyle={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  rootScreen: {
    width: 100,
    height: 100,
  },
  image: {},
});
