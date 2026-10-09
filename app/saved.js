import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import Screen from "../components/Screen";
import WallpaperCard from "../components/WallpaperCard";
import { theme, wallpapers } from "../constants/theme";

export default function SavedScreen() {
  const saved = wallpapers.slice(0, 2);
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Saved</Text>
        <Text style={styles.subtitle}>Your favorites, all in one place.</Text>
        <View style={styles.grid}>
          {saved.map((item) => <WallpaperCard key={item.id} item={item} onPress={() => router.push({ pathname: "/editor", params: { image: item.image, title: item.title } })} />)}
        </View>
        <View style={styles.note}><Text style={styles.noteText}>These are sample items for the UI prototype. Persistent saved wallpapers will be wired in later.</Text></View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingTop: 18 },
  heading: { color: theme.text, fontSize: 29, fontWeight: "800", letterSpacing: -0.8 },
  subtitle: { color: theme.muted, fontSize: 13, marginTop: 7, marginBottom: 22 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  note: { backgroundColor: theme.surface, borderRadius: 16, padding: 14, marginTop: 20, borderWidth: 1, borderColor: theme.outlineSoft },
  noteText: { color: theme.muted, fontSize: 11, lineHeight: 17 }
});