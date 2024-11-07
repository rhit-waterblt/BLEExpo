import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useGlobalState } from "../../context/GlobalState";

export default function DataManagementScreen() {
  const [activeFileName, setActiveFileName] = useState("ble_data.json"); // Default file name
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [newFileName, setNewFileName] = useState(""); // New file name input
  const [fileContent, setFileContent] = useState(""); // State to hold file content
  const [contentModalVisible, setContentModalVisible] = useState(false); // Modal visibility for content display
  const [selectedFileName, setSelectedFileName] = useState("");

  const { state, dispatch } = useGlobalState();

  // Helper to construct the file path
  const formatFilePath = (fileName: string) =>
    `${FileSystem.documentDirectory}${fileName}`;

  const listFiles = async () => {
    try {
      if (FileSystem.documentDirectory) {
        const files = await FileSystem.readDirectoryAsync(
          FileSystem.documentDirectory
        );
        const filteredFiles = files.filter((filename) =>
          filename.endsWith(".json")
        );
        setFileList(filteredFiles); // Update state with list of files
        console.log("Files in document directory:", filteredFiles);
      } else {
        console.error("Document directory not found.");
      }
    } catch (error) {
      console.error("Error reading directory:", error);
    }
  };

  const handleActiveFileChange = (fileName: string) => {
    setActiveFileName(fileName);
    dispatch({ type: "SET_CURRENT_SAVE_FILE", payload: fileName });
  };

  const viewFileContent = async (file: string) => {
    try {
      const content = await FileSystem.readAsStringAsync(file);
      setFileContent(content);
      setSelectedFileName(file);
      setContentModalVisible(true); // Open modal to display content
    } catch (error) {
      console.error("Error reading file content:", error);
    }
  };

  const shareFile = async (filePath: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        await Sharing.shareAsync(filePath);
      } else {
        console.error("File does not exist.");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const createFile = async () => {
    if (!newFileName) {
      alert("Please enter a file name");
      return;
    }
    try {
      const fileUri = `${FileSystem.documentDirectory}${newFileName}.json`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify([])); // Initialize with empty array
        console.log("File created successfully:", newFileName);
        listFiles(); // Refresh file list
        setIsModalVisible(false); // Close modal
        setNewFileName(""); // Clear input field
      } else {
        alert("File already exists");
      }
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  const deleteFile = async (filePath: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(filePath);
        listFiles();
        console.log("File deleted successfully.");
      } else {
        console.log("File does not exist.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const clearFile = async (filePath: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        const emptyData = JSON.stringify([]); // Clear with empty array
        await FileSystem.writeAsStringAsync(filePath, emptyData);
        console.log("File content cleared.");
      } else {
        console.error("File does not exist.");
      }
    } catch (error) {
      console.error("Error clearing file:", error);
    }
  };

  useEffect(() => {
    listFiles(); // Load files initially
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Data Management</Text> */}
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={styles.createButton}
      >
        <Text style={styles.createButtonText}>Create New File</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter File Name</Text>
            <TextInput
              style={styles.input}
              placeholder="File name"
              value={newFileName}
              onChangeText={setNewFileName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={createFile} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={contentModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setContentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.contentModalContainer}>
            <Text style={styles.modalTitle}>
              Contents of {selectedFileName}
            </Text>
            <ScrollView style={styles.contentContainer}>
              <Text style={styles.fileContentText}>{fileContent}</Text>
            </ScrollView>
            <TouchableOpacity
              onPress={() => setContentModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={fileList}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => viewFileContent(formatFilePath(item))}
          >
            <View style={styles.fileCard}>
              <View style={styles.fileInfo}>
                <TouchableOpacity onPress={() => handleActiveFileChange(item)}>
                  <MaterialIcons
                    name="insert-drive-file"
                    size={24}
                    color={activeFileName == item ? "#4CAF50" : "#333"}
                  />
                </TouchableOpacity>
                <Text style={styles.fileName}>{item}</Text>
              </View>
              <View style={styles.fileActions}>
                <TouchableOpacity
                  onPress={() => shareFile(formatFilePath(item))}
                >
                  <MaterialIcons name="share" size={24} color="#1e90ff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => clearFile(formatFilePath(item))}
                >
                  <FontAwesome name="eraser" size={24} color="orange" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteFile(formatFilePath(item))}
                >
                  <MaterialIcons name="delete" size={24} color="#ff4500" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* <TouchableOpacity
        onPress={() => console.log(state.currentSaveFile)}
        style={styles.createButton}
      >
        <Text style={styles.createButtonText}>Refresh Files</Text>
      </TouchableOpacity> */}

      <Text style={styles.fileContentText}>
        All incoming readings are saved to the active file.
      </Text>
      <Text style={styles.title}>Active File: {activeFileName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  createButton: {
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "100%",
    borderRadius: 8,
    marginBottom: 20,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  fileCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileName: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  fileActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },
  modalButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: "#ff4500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  contentContainer: {
    marginBottom: 10,
  },
  fileContentText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  contentModalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
  },
});
