import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import DeviceModal from "../../components/DeviceConnectionModal";
import useBLE from "../../hooks/useBLE";
import { useGlobalState } from "../../context/GlobalState";
import { Device } from "react-native-ble-plx";
import { Buffer } from "buffer";
// import { useRouter } from "expo-router";

export default function Tab() {
  return <BluetoothConnectionScreen />;
}

const toggleMode = async (connectedDevice: Device, isBroadcast: Boolean) => {
  const DATA_SERVICE_UUID = "3a8128a5-a58b-477a-bf68-8b0462524aa7";
  const COMMAND_CHARACTERISTIC_UUID = "3a8128a5-a58b-477a-bf68-8b0462524aa9";

  try {
    const message = isBroadcast ? "STOP_BROADCAST" : "START_BROADCAST";
    const encodedMessage = Buffer.from(message, "utf-8").toString("base64");

    await connectedDevice.writeCharacteristicWithResponseForService(
      DATA_SERVICE_UUID,
      COMMAND_CHARACTERISTIC_UUID,
      encodedMessage
    );
  } catch (error) {
    console.error("Failed to write to characteristic:", error);
  }
};

const BluetoothConnectionScreen = () => {
  const {
    allDevices,
    // connectedDevice,
    connectToDevice,
    requestPermissions,
    scanForPeripherals,
  } = useBLE();

  const { state } = useGlobalState();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  //   const router = useRouter();

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

  const [isBroadcast, setIsBroadcast] = useState<Boolean>(false);

  const handleBroadcast = async () => {
    toggleMode(state.connectedDevice, isBroadcast);
    setIsBroadcast(!isBroadcast);
  };

  //   useEffect(() => {
  //     if (connectedDevice) {
  //       router.back();
  //     }
  //   }, [connectedDevice]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "white" }]}>
      <ScrollView>
        <View style={styles.heartRateTitleWrapper}>
          {state.connectedDevice ? (
            <>
              <Text style={styles.heartRateTitleText}>
                Connected to ESP32 Master
              </Text>
              <TouchableOpacity
                onPress={handleBroadcast}
                style={styles.ctaButton}
              >
                {!isBroadcast ? (
                  <Text style={styles.ctaButtonText}>Start Broadcast</Text>
                ) : (
                  <Text style={styles.ctaButtonText}>Stop Broadcast</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.heartRateTitleText}>
              Please connect to the ESP32 Master
            </Text>
          )}
        </View>
        {!state.connectedDevice && (
          <TouchableOpacity onPress={openModal} style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Connect</Text>
          </TouchableOpacity>
        )}
        {state.strapMACs.length > 0 && (
          <Text style={styles.heartRateTitleText}>
            Connected to {state.strapMACs.length} Straps
          </Text>
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
