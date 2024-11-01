import { Stack } from "expo-router/stack";
import { GlobalProvider } from "../context/GlobalState";

export default function Layout() {
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
}
