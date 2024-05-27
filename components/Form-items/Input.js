import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

function Input({ label, data, showLabel, secureTextEntry, ...options }) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.text}>{label}</Text>}
      <View style={[styles.inputContainer, (!data || !data.isValid) && styles.error]}>
        <TextInput
          secureTextEntry={secureTextEntry && !showPassword}
          style={[styles.input]}
          {...options}
        />
        {secureTextEntry && (
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="black"
            style={styles.icon}
            onPress={toggleShowPassword}
          />
        )}
      </View>
      {data && data.message && (
        <Text style={styles.errorText}>{data.message}</Text>
      )}
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.textBackground,
    borderRadius: 36,
    paddingHorizontal: 14,
  },
  container: {
    padding: 6,
  },
  icon: {
    marginLeft: 10,
  },
  text: {
    color: colors.mainText,
    marginBottom: 3,
    fontWeight: "500",
    marginLeft: 6,
  },
  input: {
    flex: 1,
    width: "100%",
    padding: 12,
  },
  error: {
    backgroundColor: colors.error100,
  },
  errorText: {
    color: colors.error500,
  },
});
