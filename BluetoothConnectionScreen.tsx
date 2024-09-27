// BluetoothConnectionScreen.tsx
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
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

type BLEProps = NativeStackScreenProps<
  RootStackParamList,
  "BluetoothConnectionScreen"
>;

export interface BluetoothConnectionScreenProps {
  connectedDevice: any; // Replace 'any' with the appropriate type
  connectToDevice: (device: any) => void; // Replace 'any' with the appropriate type
  allDevices: any[]; // Replace 'any' with the appropriate
  requestPermissions: () => Promise<boolean>;
  scanForPeripherals: () => void;
}

const BluetoothConnectionScreen = (props: BLEProps) => {
  if (!props || !props.route || !props.route.params) {
    throw new Error("Props or route parameters are undefined");
  }

  const {
    connectedDevice,
    connectToDevice,
    allDevices,
    requestPermissions,
    scanForPeripherals,
  } = props.route.params;

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

export default BluetoothConnectionScreen;
