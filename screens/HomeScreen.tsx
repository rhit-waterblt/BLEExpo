import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type HomeProps = NativeStackScreenProps<RootStackParamList, "HomeScreen">;

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const fileUri = FileSystem.documentDirectory + "ble_data.json";

const downloadFile = async () => {
  const fileUri = FileSystem.documentDirectory + "ble_data.json";
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

const readDataFromFile = async () => {
  try {
    const data = await FileSystem.readAsStringAsync(fileUri);
    console.log("Data from file:", JSON.parse(data));
  } catch (error) {
    console.error("Error reading data from file:", error);
  }
};

const HomeScreen = (props: HomeProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
