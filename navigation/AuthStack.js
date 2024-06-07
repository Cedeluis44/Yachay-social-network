import React, { useState, useEffect } from "react";
import {View} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";

import FontAwesome from "react-native-vector-icons/FontAwesome";

const Stack = createStackNavigator();

const AuthStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  let routeName;

  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then(value => {
      if (value == null) {
        AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
      routeName = 'Onboarding';
  } else {
      routeName = 'Login';
  }

    return (
      <Stack.Navigator initialRouteName={routeName}>       
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ header: () => null }}
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={({ navigation }) => ({
            title: "",
            headerStyle: {
              backgroundColor: "#f9fafd",
              shadowColor: "#f9fafd",
              elevation: 0,
            },
            headerLeft: () => (
              <View style={{ marginLeft: 10 }}>
                <FontAwesome.Button
                  name="long-arrow-left"
                  size={25}
                  backgroundColor="#f9fafd"
                  color="#333"
                  onPress={() => navigation.navigate("Login")}
                />
              </View>
            ),
          })}
        />
        <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ header: () => null }}
        />
      </Stack.Navigator>
    );
};

export default AuthStack;
