import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

export default function WallpaperCard({ item, onPress, isAdd = false }) {
  if (isAdd) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.addCard, pressed && styles.pressed]}>
        <View style={styles.addIcon}><MaterialCommunityIcons name="plus" size={28} color={theme.onPrimary} /></View>
        <Text style={styles.addTitle}>Your photo</Text>
        <Text style={styles.addSub}>Create wallpaper</Text>
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.imageShade} />
      <View style={styles.cardBadge}><MaterialCommunityIcons name="layers-outline" size={12} color="#FFFFFF" /></View>
      <View style={styles.caption}>
        <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: "31.5%", height: 184, borderRadius: 18, overflow: "hidden", backgroundColor: theme.surface2 },
  image: { width: "100%", height: "100%" },
  imageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(8,8,12,0.12)" },
  cardBadge: { position: "absolute", top: 8, right: 8, width: 27, height: 27, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(16,16,20,0.52)" },
  caption: { position: "absolute", left: 9, right: 6, bottom: 10 },
  title: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  category: { color: "#E1DDE8", fontSize: 10, marginTop: 3 },
  addCard: { width: "31.5%", height: 184, borderRadius: 18, borderWidth: 1.5, borderColor: theme.outline, borderStyle: "dashed", backgroundColor: theme.surface, alignItems: "center", justifyContent: "center", paddingHorizontal: 5 },
  addIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.primary, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  addTitle: { color: theme.text, fontSize: 12, fontWeight: "700" },
  addSub: { color: theme.muted, fontSize: 10, marginTop: 5, textAlign: "center" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] }
});