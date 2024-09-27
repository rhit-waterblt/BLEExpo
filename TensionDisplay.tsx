import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

interface TensionTileProps {
  label: string;
  value: number;
  maxValue: number;
}

const TensionTile: React.FC<TensionTileProps> = ({ label, value, maxValue }) => (
  <View style={styles.tile}>
    <Text style={styles.label}>{label}</Text>
    <Progress.Bar progress={value / maxValue} width={200} color="blue" />
    <Text style={styles.value}>{value}</Text>
  </View>
);

interface TensionDisplayProps {
  tensions: number[];
}

const TensionDisplay: React.FC<TensionDisplayProps> = ({ tensions }) => (
  <View style={styles.container}>
    {tensions.map((tension, index) => (
      <TensionTile key={index} label={`Tension ${index + 1}`} value={tension} maxValue={20} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  tile: {
    marginVertical: 10,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  value: {
    marginTop: 10,
    fontSize: 18,
    color: 'blue',
  },
});

export default TensionDisplay;
