import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useGlobalState } from "../../context/GlobalState";
import { Link } from "expo-router";
import React from "react";
import TensionDisplay from "../../components/TensionDisplay";

export default function Tab() {
  const { state } = useGlobalState();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/straptechlogo.jpg")}
        style={styles.logo}
      />
      {/* <Text>Tab Home</Text> */}
      {/* <Text>{state.tensions.length}</Text> */}
      {!state.connectedDevice && state.strapMACs.length <= 0 && (
        <Link href="/(tabs)/connectivity">Please Connect to a Master</Link>
      )}
      {state.connectedDevice && state.strapMACs.length == 0 && (
        <Link href="/(tabs)/connectivity">Connect Straps</Link>
      )}
      {state.connectedDevice && state.strapMACs.length > 0 && (
        <TensionDisplayScreen />
      )}
    </View>
  );
}

const TensionDisplayScreen = () => {
  const { state } = useGlobalState();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TensionDisplay tensions={state.tensions} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
});
