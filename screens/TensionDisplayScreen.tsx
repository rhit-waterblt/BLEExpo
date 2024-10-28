// TensionDisplayScreen.tsx
import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import TensionDisplay from "../components/TensionDisplay";
import { useGlobalState } from "../context/GlobalState";

import { RootStackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type TensionProps = NativeStackScreenProps<
  RootStackParamList,
  "TensionDisplayScreen"
>;

const TensionDisplayScreen = (props: TensionProps) => {
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
