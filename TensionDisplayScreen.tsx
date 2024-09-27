// TensionDisplayScreen.tsx
import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import TensionDisplay from "./TensionDisplay";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./App";

type TensionProps = NativeStackScreenProps<
  RootStackParamList,
  "TensionDisplayScreen"
>;

export interface TensionDisplayScreenProps {
  tension: number;
}

const TensionDisplayScreen = (props: TensionProps) => {
  let tension = props.route.params?.tension;
  tension = tension ? tension : 0;
  return (
    <ScrollView style={styles.container}>
      <TensionDisplay
        tensions={[
          tension,
          tension,
          tension,
          tension,
          tension,
          tension,
          tension,
          tension,
          tension,
          tension,
        ]}
      />
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
