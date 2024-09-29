import React, { useState } from "react";
import { StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BluetoothConnectionScreen from "./BluetoothConnectionScreen";
import TensionDisplayScreen from "./TensionDisplayScreen";
import HomeScreen from "./Home";
import { GlobalProvider } from "./GlobalState";

export type RootStackParamList = {
  BluetoothConnectionScreen: undefined;
  TensionDisplayScreen: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "Real-Time Load Monitoring",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="BluetoothConnectionScreen"
            component={BluetoothConnectionScreen}
            options={{
              title: "Bluetooth Configuration",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="TensionDisplayScreen"
            component={TensionDisplayScreen}
            options={{ title: "Active Readings", headerTitleAlign: "center" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default App;
