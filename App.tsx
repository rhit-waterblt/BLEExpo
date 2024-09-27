import React, { useState } from "react";
import { StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BluetoothConnectionScreen, {
  BluetoothConnectionScreenProps,
} from "./BluetoothConnectionScreen";
import TensionDisplayScreen, {
  TensionDisplayScreenProps,
} from "./TensionDisplayScreen";
import HomeScreen from "./Home";
import useBLE from "./useBLE";

export type RootStackParamList = {
  BluetoothConnectionScreen: BluetoothConnectionScreenProps | undefined;
  TensionDisplayScreen: TensionDisplayScreenProps | undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const {
    allDevices,
    connectedDevice,
    connectToDevice,
    tension,
    requestPermissions,
    scanForPeripherals,
  } = useBLE();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="BluetoothConnectionScreen"
          component={BluetoothConnectionScreen}
          initialParams={{
            connectedDevice,
            connectToDevice,
            allDevices,
            requestPermissions,
            scanForPeripherals,
          }}
        />
        <Stack.Screen
          name="TensionDisplayScreen"
          component={TensionDisplayScreen}
          initialParams={{ tension }}
        />
        {/* <SafeAreaView style={[styles.container, { backgroundColor: "white" }]}>
          <ScrollView> */}
        {/* <View style={styles.heartRateTitleWrapper}>
              {connectedDevice ? (
                <>
                  <Text style={styles.heartRateTitleText}>Connected</Text>
                </>
              ) : (
                <Text style={styles.heartRateTitleText}>
                  Please connect to the ESP32 Master
                </Text>
              )}
            </View>
            {!connectedDevice && (
              <TouchableOpacity onPress={openModal} style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Connect</Text>
              </TouchableOpacity>
            )}
            <DeviceModal
              closeModal={hideModal}
              visible={isModalVisible}
              connectToPeripheral={connectToDevice}
              devices={allDevices}
            /> */}
        {/* {connectedDevice && (
              <TensionDisplay
                tensions={[
                  tension,
                  tension,
                  tension,
                  tension,
                  tension,
                  tension,
                  tension,
                  tension,
                  tension,
                  tension,
                ]}
              />
            )} */}
        {/* </ScrollView>
        </SafeAreaView> */}
      </Stack.Navigator>
    </NavigationContainer>
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
