import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { theme } from "../constants/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={theme.bg} />
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.bg },
        animation: "fade"
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="depth" />
        <Stack.Screen name="saved" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="editor" options={{ animation: "slide_from_right" }} />
      </Stack>
    </SafeAreaProvider>
  );
}