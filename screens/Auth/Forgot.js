import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import Banner from "../../components/UI-widgets/Banner";
import Heading from "../../components/UI-widgets/Heading";
import Input from "../../components/Form-items/Input";

import Button from "../../components/Form-items/Button";
import LinkButton from "../../components/Form-items/LinkButton";
import { resendCode } from "../../http/auth";
import { validateEmail } from "../../helpers/validations";

import { colors, messages } from "../../constants/colors";

function Forgot({ navigation }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotDetails, setForgotDetails] = useState({
    email: {
      isValid: true,
      value: "",
      message: "",
    },
  });
  async function sendVerificationHandler() {
    setError("");
    setSuccess("");
    const isValidEmail = validateEmail(forgotDetails.email.value);
    if (isValidEmail) {
      setForgotLoading(true);
      const forgotDeatils = await resendCode(
        forgotDetails.email.value,
        "FORGOT_PASSWORD"
      );
      if (forgotDeatils?.success) {
        setSuccess(messages.verificationSuccess + ' ' + messages.tryLogin);
        setTimeout(() => {
          navigation.navigate("Verification", {
            email: forgotDetails.email.value,
            type: "FORGOT_PASSWORD",
          });
        }, 2000);
      } else {
        setError(forgotDeatils.message);
      }
      setForgotLoading(false);
    } else {
      setError(messages.invalidEmail);
    }
  }
  function onInputChange(type, value) {
    setError("");
    setForgotDetails((current) => {
      return {
        ...current,
        ...{ [type]: { value: value, isValid: true, message: "" } },
      };
    });
  }
  function gotoSignUpHandler() {
    navigation.navigate("Signup");
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View>
        <Banner />
      </View>
      <Heading heading="Forgot password" caption="Enter mail to continue" />
      <View>
        <Input
          label="Email"
          placeholder="Email"
          value={forgotDetails.email.value}
          onChangeText={onInputChange.bind(this, "email")}
          data={forgotDetails.email}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {success && <Text style={styles.successText}>{success}</Text>}
      <View style={styles.button}>
        <Button
          onPress={sendVerificationHandler}
          disabled={!forgotDetails.email.value}
          loading={forgotLoading}
        >
          Send Verification
        </Button>
      </View>
      <View style={{ alignItems: "center" }}>
        <View style={styles.registerContainer}>
          <Text>Don't have account?</Text>
          <LinkButton onPress={gotoSignUpHandler}>Register</LinkButton>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Forgot;

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
  button: {
    marginTop: 6,
  },
  successText: {
    color: colors.success500,
    textAlign: "center",
    marginBottom: 12,
  },
});
