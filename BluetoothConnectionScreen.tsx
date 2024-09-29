// BluetoothConnectionScreen.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ScrollView,
} from "react-native";
import DeviceModal from "./DeviceConnectionModal";
import { RootStackParamList } from "./App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useBLE from "./useBLE";

type BLEProps = NativeStackScreenProps<
  RootStackParamList,
  "BluetoothConnectionScreen"
>;

const BluetoothConnectionScreen = (props: BLEProps) => {
  const {
    allDevices,
    connectedDevice,
    connectToDevice,
    requestPermissions,
    scanForPeripherals,
  } = useBLE();

  // console.log("connectedDevice", connectedDevice);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (connectedDevice) {
      // navigation.navigate("TensionDisplayScreen");
      props.navigation.goBack();
    }
  }, [connectedDevice]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "white" }]}>
      <ScrollView>
        <View style={styles.heartRateTitleWrapper}>
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
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
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
    backgroundColor: "#eaab2d",
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

export default BluetoothConnectionScreen;
