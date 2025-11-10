import { Stack } from "expo-router";
import 'react-native-url-polyfill/auto';
import React from "react";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="authenticate" />
      <Stack.Screen name="accountCreation" />
      <Stack.Screen name="index" />
      <Stack.Screen name="customerDetails" />
      <Stack.Screen name="transactionLogs" />
      <Stack.Screen name="perks" />
    </Stack>
  );
}
