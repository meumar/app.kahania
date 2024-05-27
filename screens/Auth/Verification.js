import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import Banner from "../../components/UI-widgets/Banner";
import Heading from "../../components/UI-widgets/Heading";

import Button from "../../components/Form-items/Button";
import LinkButton from "../../components/Form-items/LinkButton";
import Input from "../../components/Form-items/Input";

import { verifyUser, resendCode } from "../../http/auth";
import { colors, messages } from "../../constants/colors";

import { OtpInput } from "react-native-otp-entry";

function Verification({ navigation, route }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpEntered, setOtpEntered] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [forgotDetails, setForgotDetails] = useState({
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
  const { email, type } = route.params;

  function onInputChange(type, value) {
    setForgotDetails((current) => {
      return {
        ...current,
        ...{ [type]: { value: value, isValid: true, message: "" } },
      };
    });
    setError("");
    setSuccess("");
  }
  function userInputHandler(value) {
    setOtp(value);
    setError("");
    setSuccess("");
  }
  async function onResendHandler() {
    setError("");
    setSuccess("");
    await resendCode(email, type);
    setSuccess(messages.verificationSentSuccess);
  }
  async function callAccountverification(mode, navigateLogin, message) {
    setIsOtpLoading(true);
    const response = await verifyUser(
      mode,
      email,
      otp,
      type,
      forgotDetails.password.value
    );

    if (response.success) {
      setSuccess(message);
      if (navigateLogin) {
        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000);
      } else {
        setOtpEntered(true);
      }
    } else {
      setError(response.message);
    }
    setIsOtpLoading(false);
  }
  async function verifyOtpHandler() {
    setSuccess("");
    setError("");
    if (type == "FORGOT_PASSWORD") {
      if (otpEntered) {
        if (
          type == "FORGOT_PASSWORD" &&
          forgotDetails.password.value !== forgotDetails.confirm_password.value
        ) {
          setError(messages.passwordMismatch);
        } else {
          callAccountverification(
            "/forgot-password/verify",
            true,
            messages.verificationSuccess + " " + messages.tryLogin
          );
        }
      } else {
        callAccountverification(
          "/account-verify",
          false,
          messages.verificationSuccess + " " + messages.tryPassword
        );
      }
    } else {
      callAccountverification(
        "/account-verify",
        true,
        messages.verificationSuccess + " " + messages.tryLogin
      );
    }
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View>
        <Banner />
      </View>
      <Heading
        heading={
          type === "ACCOUNT_VERIFICATION"
            ? "Account verification"
            : "Forgot password"
        }
        caption={
          type === "ACCOUNT_VERIFICATION"
            ? "Otp has sent to entered email"
            : "Enter mail to continue"
        }
      />
      {type === "FORGOT_PASSWORD" ? (
        <>
          {otpEntered ? (
            <View style={styles.passwordContainer}>
              <Input
                label="Password"
                placeholder="Password"
                showLabel={true}
                secureTextEntry={true}
                value={forgotDetails.password.value}
                onChangeText={onInputChange.bind(this, "password")}
                data={forgotDetails.password}
              />
              <Input
                label="Confirm password"
                placeholder="Confirm password"
                showLabel={true}
                secureTextEntry={true}
                value={forgotDetails.confirm_password.value}
                onChangeText={onInputChange.bind(this, "confirm_password")}
                data={forgotDetails.confirm_password}
              />
            </View>
          ) : (
            <View style={styles.otpInputArea}>
              <OtpInput numberOfDigits={6} onTextChange={userInputHandler} />
            </View>
          )}
        </>
      ) : (
        <View style={styles.otpInputArea}>
          <OtpInput numberOfDigits={6} onTextChange={userInputHandler} />
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {success && <Text style={styles.successText}>{success}</Text>}
      <Button
        disabled={
          otp.length < 6 ||
          (!forgotDetails.password.value &&
            type === "FORGOT_PASSWORD" &&
            otpEntered)
        }
        onPress={verifyOtpHandler}
        loading={isOtpLoading}
      >
        Verify
      </Button>
      <View style={{ alignItems: "center" }}>
        {!otpEntered && (
          <View style={styles.registerContainer}>
            <Text>Don't get OTP?</Text>
            <LinkButton onPress={onResendHandler}>Resend</LinkButton>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

export default Verification;

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
  otpInputArea: {
    marginBottom: 12,
    padding: 12,
  },
  successText: {
    color: colors.success500,
    textAlign: "center",
    marginBottom: 12,
  },
  errorText: {
    color: colors.error500,
    textAlign: "center",
    marginBottom: 12,
  },
  passwordContainer: {
    marginTop: 8,
  },
});
