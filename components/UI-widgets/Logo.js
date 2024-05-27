import { StyleSheet, Text, View, Button } from "react-native";

function SignIn({}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Kahania</Text>
    </View>
  );
}

export default SignIn;

const styles = StyleSheet.create({
  container: {},
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: 'white'
  },
});
