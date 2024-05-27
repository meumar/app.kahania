import { createContext, useState, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
  token: "",
  userInfo: "",
  isAuthenticated: false,
  authenticate: () => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [userInfo, setUserInfo] = useState();



  function authenticate(token, userInfo) {
    let t = "";
    if(token.includes('Bearer')){
      t = token;
    }else{
      t = "Bearer " + token;
    }
    setAuthToken(t);
    setUserInfo(userInfo);
    AsyncStorage.setItem("token", t);
    AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
  }
  function logout(token) {
    setAuthToken(null);
    setUserInfo(null);
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("userInfo");
  }
  const value = {
    token: authToken,
    userInfo: userInfo,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
