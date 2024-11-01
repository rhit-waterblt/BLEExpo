import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="connectivity"
        options={{
          title: "Connect",
          //   headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="bluetooth" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="data-management"
        options={{
          title: "Data Management",
          //   headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="database" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          //   headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
