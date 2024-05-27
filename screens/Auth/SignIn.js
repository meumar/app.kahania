import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { useState, useContext } from "react";

import Banner from "../../components/UI-widgets/Banner";
import Heading from "../../components/UI-widgets/Heading";
import Input from "../../components/Form-items/Input";
import Button from "../../components/Form-items/Button";
import LinkButton from "../../components/Form-items/LinkButton";

import { login } from "../../http/auth";
import { AuthContext } from "../../store/auth-context";

import { colors, messages } from "../../constants/colors";
import { validateEmail } from "../../helpers/validations";

function SignIn({ navigation }) {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginDetails, setLoginDetails] = useState({
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
  });
  const authCtx = useContext(AuthContext);
  function onInputChange(type, value) {
    setError("");
    setLoginDetails((current) => {
      return {
        ...current,
        ...{ [type]: { value: value, isValid: true, message: "" } },
      };
    });
  }
  async function onLoginHandler() {
    try {
      setError("");
      const isValidEmail = validateEmail(loginDetails.email.value);
      if (isValidEmail) {
        setIsLoginLoading(true);
        const email = loginDetails.email.value;
        const password = loginDetails.password.value;
        const authDetails = await login(email, password);
        if (authDetails?.success) {
          setTimeout(() => {
            authCtx.authenticate(
              authDetails.data.token,
              authDetails.data.userInfo
            );
            setIsLoginLoading(false);
          }, 1000);
        } else {
          setError(authDetails.message || messages.invalidCredentials);
          setIsLoginLoading(false);
        }
      } else {
        setLoginDetails((current) => {
          return {
            ...current,
            ...{
              email: {
                value: current.email.value,
                isValid: false,
                message: messages.invalidEmail,
              },
            },
          };
        });
      }
    } catch (e) {
      console.log("Login Error:", e);
    }
  }

  function gotoSignUpHandler() {
    navigation.navigate("Signup");
  }
  function gotoForgotHandler() {
    navigation.navigate("Forgot");
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View>
        <Banner />
      </View>
      <Heading heading="Login" caption="Login to continue" />
      <View>
        <Input
          label="Email"
          placeholder="Email"
          value={loginDetails.email.value}
          onChangeText={onInputChange.bind(this, "email")}
          data={loginDetails.email}
        />
        <Input
          label="Password"
          placeholder="Password"
          secureTextEntry={true}
          value={loginDetails.password.value}
          onChangeText={onInputChange.bind(this, "password")}
          data={loginDetails.password}
        />
      </View>
      <View
        style={{
          alignItems: "flex-end",
          marginVertical: 4,
        }}
      >
        <LinkButton
          style={{
            color: colors.primary800,
          }}
          onPress={gotoForgotHandler}
        >
          Forgot password?
        </LinkButton>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button
        style={{ marginTop: 8 }}
        onPress={onLoginHandler}
        loading={isLoginLoading}
      >
        Login
      </Button>
      <View style={{ alignItems: "center" }}>
        <View style={styles.registerContainer}>
          <Text>Don't have account?</Text>
          <LinkButton onPress={gotoSignUpHandler}>Register</LinkButton>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default SignIn;

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
