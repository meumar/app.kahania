import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

import { useEffect, useContext, useState, useCallback } from "react";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import { io } from "socket.io-client";
import { SocketProvider } from "./http/SocketContext";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

//screens
// auth
import SignIn from "./screens/Auth/SignIn";
import SignUp from "./screens/Auth/SignUp";
import Forgot from "./screens/Auth/Forgot";
import Verification from "./screens/Auth/Verification";
//Main
import Home from "./screens/Dasboard/Home";
import Profile from "./screens/Dasboard/Profile";
import Exporer from "./screens/Dasboard/Explorer";
import NewPost from "./screens/Dasboard/NewPost";

//messages
import MessageList from "./screens/Messages/MessagesList";
import MessageChat from "./screens/Messages/MessageChat";

// components
import Logo from "./components/UI-widgets/Logo";
import IconButton from "./components/Form-items/IconButtom";

import { colors } from "./constants/colors";

function BottomNavigationsRoutes() {
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerTintColor: "black",
        tabBarShowLabel: false,
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: colors.primary800,
        },
        contentStyle: {
          backgroundColor: "white",
        },
      })}
    >
      <BottomTabs.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          title: "Home",
          headerTitle: () => {
            return <Logo />;
          },
          tabBarIcon: ({ size, color }) => (
            <Ionicons size={size} color={color} name="home-outline" />
          ),
          headerRight: ({ tintColor }) => {
            return (
              <IconButton
                size={24}
                color={tintColor}
                icon="chatbox-outline"
                style={{ padding: 5 }}
                onPress={() => navigation.navigate("MessageList")}
              />
            );
          },
        })}
      />
      <BottomTabs.Screen
        name="Exporer"
        component={Exporer}
        options={{
          title: "Exporer",
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons size={size} color={color} name="search-outline" />
          ),
        }}
      />
      <BottomTabs.Screen
        name="NewPost"
        component={NewPost}
        options={{
          title: "New Post",
          tabBarIcon: ({ size, color }) => (
            <Ionicons size={size} color={color} name="add-circle-outline" />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => (
            <Ionicons size={size} color={color} name="person-outline" />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

function AuthenticatedRoutes() {
  const authCtx = useContext(AuthContext);
  const authToken = authCtx.token;
  return (
    <SocketProvider authToken={authToken}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "white",
          },
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      >
        <Stack.Screen
          name="BottomNavigationsRoutes"
          component={BottomNavigationsRoutes}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MessageList"
          component={MessageList}
          options={{
            title: "Messages",
          }}
        />
        <Stack.Screen
          name="MessageChat"
          component={MessageChat}
          options={{
            title: "Chat",
          }}
        />
      </Stack.Navigator>
    </SocketProvider>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "white",
        },
        contentStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Stack.Screen name="Login" component={SignIn} />
      <Stack.Screen name="Signup" component={SignUp} />
      <Stack.Screen name="Forgot" component={Forgot} />
      <Stack.Screen name="Verification" component={Verification} />
    </Stack.Navigator>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(false);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      try{
        await SplashScreen.preventAutoHideAsync();
        const [storedToken, userInfo] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("userInfo"),
        ]);
        if (storedToken) {
          authCtx.authenticate(storedToken, JSON.parse(userInfo));
        }
        setIsTryingLogin(true);
      }catch(e){
        conbsole.log("error", e);
      }
    }
    fetchToken();
  }, []);
  let [fontsLoaded, fontError] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  const onLayoutRootView = useCallback(async () => {
    try {
      if (isTryingLogin || fontsLoaded || fontError) {
        await SplashScreen.hideAsync();
      }
    } catch (error) {
      console.error("Error hiding SplashScreen:", error);
    }
  }, [isTryingLogin, fontsLoaded, fontError]);

  if (!isTryingLogin) {
    return null;
  }
  return (
    <NavigationContainer onReady={onLayoutRootView}>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedRoutes />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
