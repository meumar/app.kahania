import { StyleSheet, Text, View } from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../../store/auth-context";
import Button from "../../components/Form-items/Button";
import Input from "../../components/Form-items/Input";
import LinkButton from "../../components/Form-items/LinkButton";

function Profile() {
  const authCtx = useContext(AuthContext);
  const userInfo = {
    email: "",
    name: "",
  };
  if (authCtx?.userInfo) {
    const savedData = JSON.parse(JSON.stringify(authCtx.userInfo));
    userInfo.email = savedData.email;
    userInfo.name = savedData.name;
  }
  const [userDetails, setUserDetails] = useState({
    email: {
      isValid: true,
      value: userInfo.email,
    },
    name: {
      isValid: true,
      value: userInfo.name,
    },
  });

  function logoutHandler() {
    authCtx.logout();
  }
  function onUpdateHandler() {}
  function onEmailChange(value) {
    setUserDetails((current) => {
      return { ...current, ...{ email: { value: value, isValid: true } } };
    });
  }
  function onNameChange(value) {
    setUserDetails((current) => {
      return { ...current, ...{ name: { value: value, isValid: true } } };
    });
  }
  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 6 }}>
        <Input
          showLabel={true}
          label="Name"
          placeholder="Name"
          value={userDetails.name.value}
          onChangeText={onNameChange}
          data={userDetails.name}
        />
        <Input
          showLabel={true}
          label="Email"
          placeholder="Email"
          value={userDetails.email.value}
          onChangeText={onEmailChange}
          data={userDetails.email}
        />
      </View>
      <View style={{ marginTop: 12 }}>
        <Button onPress={onUpdateHandler}>Update</Button>
        <View style={{ alignItems: "center", marginTop: 12 }}>
          <LinkButton onPress={logoutHandler}>Logout</LinkButton>
        </View>
      </View>
    </View>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
});
