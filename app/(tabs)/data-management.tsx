import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const fileUri = FileSystem.documentDirectory + "ble_data.json";

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

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab Data Management</Text>
      <TouchableOpacity onPress={downloadFile} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>Export Saved Data</Text>
      </TouchableOpacity>
    </View>
  );
}

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
