import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { usePathname, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

const tabs = [
  { label: "Home", route: "/", icon: "view-grid-outline", active: "view-grid" },
  { label: "Depth", route: "/depth", icon: "layers-triple-outline", active: "layers-triple" },
  { label: "Saved", route: "/saved", icon: "bookmark-outline", active: "bookmark" },
  { label: "Settings", route: "/settings", icon: "cog-outline", active: "cog" }
];

export default function BottomBar() {
  const pathname = usePathname();
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const selected = tab.route === "/" ? pathname === "/" : pathname.startsWith(tab.route);
          return (
            <Pressable key={tab.route} onPress={() => router.replace(tab.route)} style={styles.item}>
              <View style={[styles.pill, selected && styles.pillSelected]}>
                <MaterialCommunityIcons name={selected ? tab.active : tab.icon} size={22} color={selected ? theme.onPrimary : theme.muted} />
              </View>
              <Text style={[styles.label, selected && styles.labelSelected]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, backgroundColor: theme.bg },
  bar: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", backgroundColor: theme.surface, borderRadius: 28, paddingHorizontal: 5, paddingVertical: 8, borderWidth: 1, borderColor: theme.outlineSoft },
  item: { flex: 1, alignItems: "center", gap: 4 },
  pill: { minWidth: 56, height: 32, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  pillSelected: { backgroundColor: theme.primary },
  label: { fontSize: 11, color: theme.muted, fontWeight: "500" },
  labelSelected: { color: theme.text, fontWeight: "700" }
});