import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useGlobalState } from "../context/GlobalState";
import { Device } from "react-native-ble-plx";
import { Buffer } from "buffer";

type HomeProps = NativeStackScreenProps<RootStackParamList, "HomeScreen">;

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const fileUri = FileSystem.documentDirectory + "ble_data.json";

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

const downloadFile = async () => {
  try {
    // Ensure the file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (fileInfo.exists) {
      // Share or download the file
      await Sharing.shareAsync(fileUri);
    } else {
      console.error("File does not exist.");
    }
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

const HomeScreen = (props: HomeProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { state } = useGlobalState();
  const [isBroadcast, setIsBroadcast] = useState<Boolean>(false);

  const handleBroadcast = async () => {
    toggleMode(state.connectedDevice, isBroadcast);
    setIsBroadcast(!isBroadcast);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/straptechlogo.jpg")}
        style={styles.logo}
      />
      <Text style={styles.title}>StrapTech</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("BluetoothConnectionScreen")}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>Go to Bluetooth Connection</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("TensionDisplayScreen")}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>Go to Tension Display</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={downloadFile} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>Export Saved Data</Text>
      </TouchableOpacity>
      {state.connectedDevice && (
        <TouchableOpacity onPress={handleBroadcast} style={styles.ctaButton}>
          {!isBroadcast ? (
            <Text style={styles.ctaButtonText}>Start Broadcast</Text>
          ) : (
            <Text style={styles.ctaButtonText}>Stop Broadcast</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    marginHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
});

export default HomeScreen;
