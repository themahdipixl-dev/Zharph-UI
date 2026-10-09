import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import WallpaperCard from "../components/WallpaperCard";
import { theme, wallpapers } from "../constants/theme";

const filters = ["All", "Depth", "Parallax", "Minimal"];

export default function HomeScreen() {
  const [filter, setFilter] = useState("All");
  const openPicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets?.[0]?.uri) {
      router.push({ pathname: "/editor", params: { image: result.assets[0].uri, source: "gallery" } });
    }
  };
  const visible = filter === "All" || filter === "Depth" || filter === "Parallax"
    ? wallpapers
    : wallpapers.filter((item) => item.category === filter);
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Zharph<Text style={styles.dot}>.</Text></Text>
            <Text style={styles.subtitle}>Your screen, reimagined</Text>
          </View>
          <Pressable onPress={() => router.push("/settings")} style={styles.avatar}>
            <MaterialCommunityIcons name="tune-variant" size={22} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Discover</Text>
          <Pressable onPress={() => router.push("/depth")} style={styles.textAction}>
            <Text style={styles.actionText}>Make depth</Text>
            <MaterialCommunityIcons name="arrow-up-right" size={16} color={theme.primary} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((name) => (
            <Pressable key={name} onPress={() => setFilter(name)} style={[styles.filter, filter === name && styles.filterActive]}>
              <Text style={[styles.filterText, filter === name && styles.filterTextActive]}>{name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          <WallpaperCard isAdd onPress={openPicker} />
          {visible.map((item) => (
            <WallpaperCard key={item.id} item={item} onPress={() => router.push({ pathname: "/editor", params: { image: item.image, title: item.title } })} />
          ))}
        </View>
        <View style={styles.tip}>
          <View style={styles.tipIcon}><MaterialCommunityIcons name="auto-awesome" size={20} color={theme.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Give your wallpaper depth</Text>
            <Text style={styles.tipText}>Bring the foreground in front of your lock-screen clock.</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color={theme.muted} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 18 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 28 },
  brand: { color: theme.text, fontSize: 30, fontWeight: "800", letterSpacing: -1.2 },
  dot: { color: theme.primary },
  subtitle: { color: theme.muted, fontSize: 12, marginTop: 3, letterSpacing: 0.2 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: theme.surface2, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: theme.outlineSoft },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  sectionTitle: { color: theme.text, fontSize: 21, fontWeight: "700", letterSpacing: -0.4 },
  textAction: { flexDirection: "row", alignItems: "center", gap: 3 },
  actionText: { color: theme.primary, fontSize: 13, fontWeight: "600" },
  filters: { gap: 8, paddingBottom: 18 },
  filter: { borderRadius: 18, paddingHorizontal: 17, paddingVertical: 9, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.outlineSoft },
  filterActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  filterText: { color: theme.muted, fontSize: 12, fontWeight: "600" },
  filterTextActive: { color: theme.onPrimary },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tip: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, marginTop: 22, borderRadius: 20, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.outlineSoft },
  tipIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: theme.surface3, alignItems: "center", justifyContent: "center" },
  tipTitle: { color: theme.text, fontWeight: "700", fontSize: 13 },
  tipText: { color: theme.muted, fontSize: 11, lineHeight: 16, marginTop: 4 }
});