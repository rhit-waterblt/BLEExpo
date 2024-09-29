/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { useGlobalState } from "./GlobalState";

import * as ExpoDevice from "expo-device";
import { Buffer } from "buffer";

import base64 from "react-native-base64";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

const DATA_SERVICE_UUID = "3a8128a5-a58b-477a-bf68-8b0462524aa7";
const TENSION_CHARACTERISTIC_UUID = "3a8128a5-a58b-477a-bf68-8b0462524aa8";

const bleManager = new BleManager();

function useBLE() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  // const [tension, setTension] = useState(0);

  const { state, dispatch } = useGlobalState();

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();

      startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }

      if (
        device &&
        (device.localName === "ESP32_BLE" || device.name === "ESP32_BLE")
      ) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const onDataUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return;
    } else if (!characteristic?.value) {
      console.log("No Data was received");
      return;
    }

    // const tension = parseInt(base64.decode(characteristic.value));

    // console.log(characteristic.value);

    // const jsonString = Buffer.from(characteristic.value, "base64").toString(
    //   "utf-8"
    // );

    // console.log(jsonString);

    // const data = JSON.parse(jsonString);

    const receivedString = Buffer.from(characteristic.value, "base64").toString(
      "utf-8"
    );
    // console.log("Received String: ", receivedString);
    const [mac, tension] = receivedString.split(","); // Split by comma
    // console.log(`MAC Address: ${mac}, Tension: ${tension}`);
    const tensionNumber = parseInt(tension);

    const updateTension = (newTension: number) => {
      dispatch({ type: "SET_TENSION", payload: newTension });
    };

    const updateStrapMacs = (mac: string, newTension: number) => {
      dispatch({
        type: "SET_STRAPMACS",
        payload: { mac: mac, tension: newTension },
      });
    };

    // setTension(tension);
    updateTension(tensionNumber);
    updateStrapMacs(mac, tensionNumber);
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        DATA_SERVICE_UUID,
        TENSION_CHARACTERISTIC_UUID,
        onDataUpdate
      );
    } else {
      console.log("No Device Connected");
    }
  };

  return {
    connectToDevice,
    allDevices,
    connectedDevice,
    // tension,
    requestPermissions,
    scanForPeripherals,
    startStreamingData,
  };
}

export default useBLE;
