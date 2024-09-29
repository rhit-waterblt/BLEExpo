// TensionDisplayScreen.tsx
import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import TensionDisplay from "./TensionDisplay";
import { useGlobalState } from "./GlobalState";

const TensionDisplayScreen = () => {
  const { state } = useGlobalState();

  return (
    <ScrollView style={styles.container}>
      <TensionDisplay tensions={state.tensions} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
});

export default TensionDisplayScreen;
