import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Switch } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import { theme } from "../constants/theme";

function SettingRow({ icon, title, subtitle, right }) {
  return <View style={styles.row}><View style={styles.rowIcon}><MaterialCommunityIcons name={icon} size={21} color={theme.primary} /></View><View style={styles.rowText}><Text style={styles.rowTitle}>{title}</Text>{subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}</View>{right}</View>;
}

export default function SettingsScreen() {
  const [dark, setDark] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [motion, setMotion] = useState(false);
  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Settings</Text>
        <Text style={styles.subtitle}>Make Zharph feel like yours.</Text>
        <Text style={styles.section}>APPEARANCE</Text>
        <View style={styles.group}>
          <SettingRow icon="theme-light-dark" title="Dark theme" subtitle="A comfortable, low-glare interface" right={<Switch value={dark} onValueChange={setDark} trackColor={{ false: theme.surface3, true: "#65558F" }} thumbColor={dark ? theme.primary : theme.muted} />} />
          <View style={styles.divider} />
          <SettingRow icon="palette-outline" title="Color palette" subtitle="Material You · Lavender" right={<MaterialCommunityIcons name="chevron-right" size={22} color={theme.muted} />} />
        </View>
        <Text style={styles.section}>EXPERIENCE</Text>
        <View style={styles.group}>
          <SettingRow icon="vibrate" title="Haptic feedback" subtitle="Subtle touch responses" right={<Switch value={haptics} onValueChange={setHaptics} trackColor={{ false: theme.surface3, true: "#65558F" }} thumbColor={haptics ? theme.primary : theme.muted} />} />
          <View style={styles.divider} />
          <SettingRow icon="motion-outline" title="Parallax motion" subtitle="Preview motion effects" right={<Switch value={motion} onValueChange={setMotion} trackColor={{ false: theme.surface3, true: "#65558F" }} thumbColor={motion ? theme.primary : theme.muted} />} />
        </View>
        <Text style={styles.section}>ABOUT</Text>
        <View style={styles.group}>
          <SettingRow icon="information-outline" title="About Zharph" subtitle="UI prototype · Version 1.0.0" right={<MaterialCommunityIcons name="chevron-right" size={22} color={theme.muted} />} />
        </View>
        <Text style={styles.footer}>Made for your screen.</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingTop: 18, paddingBottom: 28 },
  heading: { color: theme.text, fontSize: 29, fontWeight: "800", letterSpacing: -0.8 },
  subtitle: { color: theme.muted, fontSize: 13, marginTop: 7, marginBottom: 28 },
  section: { color: theme.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1.6, marginBottom: 10, marginTop: 4 },
  group: { borderRadius: 20, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.outlineSoft, paddingHorizontal: 14, marginBottom: 24 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 15, gap: 12 },
  rowIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: theme.surface3, alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1 },
  rowTitle: { color: theme.text, fontSize: 13, fontWeight: "700" },
  rowSub: { color: theme.muted, fontSize: 10, marginTop: 4 },
  divider: { height: 1, backgroundColor: theme.outlineSoft, marginLeft: 52 },
  footer: { color: theme.muted, textAlign: "center", fontSize: 11, marginTop: 4 }
});