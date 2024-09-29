import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./App";

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Image source={require("./straptechlogo.jpg")} style={styles.logo} />
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
