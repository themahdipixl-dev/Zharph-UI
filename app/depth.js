import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import { theme, wallpapers } from "../constants/theme";

export default function DepthScreen() {
  const [photo, setPhoto] = useState(wallpapers[0].image);
  const [mode, setMode] = useState("Depth");
  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets?.[0]?.uri) setPhoto(result.assets[0].uri);
  };
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>CREATE</Text>
        <Text style={styles.heading}>Make it yours</Text>
        <Text style={styles.description}>Turn any photo into a wallpaper with a little more dimension.</Text>

        <Pressable onPress={choosePhoto} style={styles.previewWrap}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.previewShade} />
          <View style={styles.scanBadge}><MaterialCommunityIcons name="image-edit-outline" size={16} color={theme.text} /><Text style={styles.scanText}>Preview photo</Text></View>
          <View style={styles.previewBottom}><Text style={styles.previewTitle}>A new perspective</Text><Text style={styles.previewSub}>Tap to choose another photo</Text></View>
        </Pressable>

        <Text style={styles.label}>WALLPAPER STYLE</Text>
        <View style={styles.modeRow}>
          {[{ name: "Depth", icon: "layers-triple-outline", detail: "Foreground over clock" }, { name: "Parallax", icon: "axis-arrow", detail: "Subtle motion" }].map((item) => (
            <Pressable key={item.name} onPress={() => setMode(item.name)} style={[styles.modeCard, mode === item.name && styles.modeCardActive]}>
              <View style={[styles.modeIcon, mode === item.name && styles.modeIconActive]}><MaterialCommunityIcons name={item.icon} size={22} color={mode === item.name ? theme.onPrimary : theme.muted} /></View>
              <Text style={styles.modeTitle}>{item.name}</Text><Text style={styles.modeDetail}>{item.detail}</Text>
              {mode === item.name ? <MaterialCommunityIcons name="check-circle" size={18} color={theme.primary} style={styles.check} /> : null}
            </Pressable>
          ))}
        </View>

        <View style={styles.infoRow}><MaterialCommunityIcons name="auto-awesome" size={20} color={theme.primary} /><Text style={styles.infoText}>Depth processing will connect to the real image pipeline during integration.</Text></View>
        <Pressable onPress={() => router.push({ pathname: "/editor", params: { image: photo, mode } })} style={styles.primaryButton}><Text style={styles.primaryText}>Continue to editor</Text><MaterialCommunityIcons name="arrow-right" size={19} color={theme.onPrimary} /></Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingTop: 14, paddingBottom: 24 },
  eyebrow: { color: theme.primary, fontSize: 11, fontWeight: "800", letterSpacing: 2, marginBottom: 8 },
  heading: { color: theme.text, fontSize: 28, fontWeight: "800", letterSpacing: -0.8 },
  description: { color: theme.muted, fontSize: 13, lineHeight: 19, marginTop: 7, marginBottom: 22, maxWidth: 300 },
  previewWrap: { height: 270, borderRadius: 26, overflow: "hidden", backgroundColor: theme.surface2 },
  preview: { width: "100%", height: "100%" },
  previewShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10,10,16,0.18)" },
  scanBadge: { position: "absolute", top: 14, left: 14, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "rgba(20,20,26,0.72)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  scanText: { color: theme.text, fontSize: 11, fontWeight: "600" },
  previewBottom: { position: "absolute", left: 18, bottom: 18 },
  previewTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" },
  previewSub: { color: "#F0ECF6", fontSize: 12, marginTop: 5 },
  label: { color: theme.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginTop: 24, marginBottom: 12 },
  modeRow: { flexDirection: "row", gap: 12 },
  modeCard: { flex: 1, minHeight: 142, padding: 14, borderRadius: 20, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.outlineSoft },
  modeCardActive: { borderColor: theme.primary, backgroundColor: "#272331" },
  modeIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: theme.surface3, marginBottom: 12 },
  modeIconActive: { backgroundColor: theme.primary },
  modeTitle: { color: theme.text, fontWeight: "700", fontSize: 14 },
  modeDetail: { color: theme.muted, fontSize: 10, marginTop: 5 },
  check: { position: "absolute", top: 12, right: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 16, backgroundColor: theme.surface, marginTop: 18 },
  infoText: { color: theme.muted, fontSize: 11, lineHeight: 16, flex: 1 },
  primaryButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, backgroundColor: theme.primary, borderRadius: 18, paddingVertical: 16, marginTop: 18 },
  primaryText: { color: theme.onPrimary, fontSize: 14, fontWeight: "800" }
});