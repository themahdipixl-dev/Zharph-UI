import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomBar from "./BottomBar";
import { theme } from "../constants/theme";

export default function Screen({ children, showBottomBar = true, contentStyle }) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
      {showBottomBar ? <BottomBar /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  content: { flex: 1 }
});