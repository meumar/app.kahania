import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import Banner from "../../components/UI-widgets/Banner";
import Heading from "../../components/UI-widgets/Heading";
import Input from "../../components/Form-items/Input";
import {
  validateEmail,
  passwordValid,
  nameValid,
} from "../../helpers/validations";

import Button from "../../components/Form-items/Button";
import LinkButton from "../../components/Form-items/LinkButton";

import { createUser } from "../../http/auth";

import { colors, messages } from "../../constants/colors";

function SignUp({ navigation }) {
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [error, setError] = useState("");
  const [signUpDetails, setSignUpDetails] = useState({
    name: {
      isValid: true,
      value: "",
      message: "",
    },
    email: {
      isValid: true,
      value: "",
      message: "",
    },
    password: {
      isValid: true,
      value: "",
      message: "",
    },
    confirm_password: {
      isValid: true,
      value: "",
      message: "",
    },
  });
  function onInputChange(type, value) {
    setSignUpDetails((current) => {
      return {
        ...current,
        ...{ [type]: { value: value, isValid: true, message: "" } },
      };
    });
  }
  function gotoSignInHandler() {
    navigation.navigate("Login");
  }

  async function onSignUpHandler() {
    setError("");
    const isValidEmail = validateEmail(signUpDetails.email.value);
    const isPasswordvalid = passwordValid(signUpDetails.password.value);
    const isNamevalid = nameValid(signUpDetails.name.value);
    const isConfirmPasswordvalid =
      signUpDetails.confirm_password.value === signUpDetails.password.value;
    if (
      isValidEmail &&
      isPasswordvalid &&
      isNamevalid &&
      isConfirmPasswordvalid
    ) {
      setIsSignUpLoading(true);
      const authDetails = await createUser(
        signUpDetails.email.value,
        signUpDetails.password.value,
        signUpDetails.name.value
      );
      setIsSignUpLoading(false);
      if (authDetails?.success && authDetails?.data?.email) {
        navigation.navigate("Verification", {
          email: authDetails.data.email,
          type: "ACCOUNT_VERIFICATION",
        });
      } else {
        setError(authDetails.message);
      }
    } else {
      setSignUpDetails((current) => {
        return {
          ...current,
          ...{
            name: {
              value: current.name.value,
              isValid: isNamevalid,
              message: isNamevalid ? "" : messages.invalidName,
            },
            email: {
              value: current.email.value,
              isValid: isValidEmail,
              message: isValidEmail ? "" : messages.invalidEmail,
            },
            password: {
              value: current.password.value,
              isValid: isPasswordvalid,
              message: isPasswordvalid ? "" : messages.passwordRestriction,
            },
            confirm_password: {
              value: current.confirm_password.value,
              isValid: isConfirmPasswordvalid,
              message: isConfirmPasswordvalid ? "" : messages.passwordMismatch,
            },
          },
        };
      });
    }
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View>
        <Banner />
      </View>
      <Heading heading="Register" caption="Enter your details" />
      <View>
        <Input
          label="Name"
          placeholder="Name"
          value={signUpDetails.name.value}
          onChangeText={onInputChange.bind(this, "name")}
          data={signUpDetails.name}
        />
        <Input
          label="Email"
          placeholder="Email"
          value={signUpDetails.email.value}
          onChangeText={onInputChange.bind(this, "email")}
          data={signUpDetails.email}
        />
        <Input
          label="Password"
          placeholder="Password"
          secureTextEntry={true}
          value={signUpDetails.password.value}
          onChangeText={onInputChange.bind(this, "password")}
          data={signUpDetails.password}
        />
        <Input
          label="Confirm password"
          placeholder="Confirm password"
          secureTextEntry={true}
          value={signUpDetails.confirm_password.value}
          onChangeText={onInputChange.bind(this, "confirm_password")}
          data={signUpDetails.confirm_password}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button
        style={{ marginTop: 12 }}
        loading={isSignUpLoading}
        onPress={onSignUpHandler}
      >
        Register
      </Button>
      <View style={{ alignItems: "center" }}>
        <View style={styles.registerContainer}>
          <Text>Already have account?</Text>
          <LinkButton onPress={gotoSignInHandler}>Login</LinkButton>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default SignUp;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    padding: 12,
  },
  registerContainer: {
    flexDirection: "row",
    gap: 5,
    marginVertical: 9,
  },
  errorText: {
    color: colors.error500,
    textAlign: "center",
  },
});
