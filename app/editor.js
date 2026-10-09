import React, { useMemo, useRef, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet, PanResponder, ScrollView, Dimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import { theme, wallpapers } from "../constants/theme";

const { width: screenWidth } = Dimensions.get("window");

export default function EditorScreen() {
  const params = useLocalSearchParams();
  const imageUri = typeof params.image === "string" ? params.image : wallpapers[0].image;
  const title = typeof params.title === "string" ? params.title : "New wallpaper";
  const [clock, setClock] = useState({ x: 0, y: 0 });
  const [activeLayer, setActiveLayer] = useState("Mountain");
  const [showClock, setShowClock] = useState(true);
  const [layers, setLayers] = useState([
    { name: "Sky", detail: "Behind clock", icon: "weather-sunset" },
    { name: "Mountain", detail: "In front of clock", icon: "image-filter-hdr" },
    { name: "Background", detail: "Base photo", icon: "image-outline" }
  ]);
  const pan = useRef({ x: 0, y: 0 });
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { pan.current = { ...clock }; },
    onPanResponderMove: (_, gesture) => setClock({ x: pan.current.x + gesture.dx, y: pan.current.y + gesture.dy }),
    onPanResponderRelease: () => { pan.current = { ...clock }; }
  }), [clock]);
  const toggleLayer = (name) => setActiveLayer(name);
  const moveLayer = (name, direction) => setLayers((old) => {
    const i = old.findIndex((layer) => layer.name === name);
    const j = i + direction;
    if (j < 0 || j >= old.length) return old;
    const next = [...old]; [next[i], next[j]] = [next[j], next[i]]; return next;
  });

  return (
    <Screen showBottomBar={false}>
      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} style={styles.back}><MaterialCommunityIcons name="arrow-left" size={23} color={theme.text} /></Pressable>
        <View style={{ flex: 1 }}><Text style={styles.topTitle}>Wallpaper editor</Text><Text style={styles.topSub} numberOfLines={1}>{title}</Text></View>
        <Pressable onPress={() => router.replace("/")} style={styles.done}><Text style={styles.doneText}>Done</Text></Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.previewFrame}>
          <Image source={{ uri: imageUri }} style={styles.photo} resizeMode="cover" />
          <View style={styles.photoShade} />
          <View style={[styles.clock, { transform: [{ translateX: clock.x }, { translateY: clock.y }] }]} {...responder.panHandlers}>
            {showClock ? <><Text style={styles.time}>9:41</Text><Text style={styles.date}>FRIDAY, OCTOBER 9</Text></> : <Text style={styles.clockOff}>Clock hidden</Text>}
          </View>
          <View style={styles.foregroundDemo}><MaterialCommunityIcons name="image-filter-hdr" size={88} color="#172A31" /><View style={styles.fgSun} /></View>
          <View style={styles.previewHint}><MaterialCommunityIcons name="gesture-tap" size={15} color="#FFFFFF" /><Text style={styles.previewHintText}>Drag the clock to position it</Text></View>
        </View>

        <View style={styles.toolsRow}>
          <Pressable onPress={() => setShowClock(!showClock)} style={styles.tool}><MaterialCommunityIcons name={showClock ? "clock-outline" : "clock-off-outline"} size={19} color={theme.primary} /><Text style={styles.toolText}>{showClock ? "Clock on" : "Clock off"}</Text></Pressable>
          <View style={styles.toolDivider} />
          <Pressable onPress={() => setClock({ x: 0, y: 0 })} style={styles.tool}><MaterialCommunityIcons name="target" size={19} color={theme.primary} /><Text style={styles.toolText}>Reset position</Text></Pressable>
        </View>

        <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Layer order</Text><Text style={styles.sectionMeta}>Drag clock to preview</Text></View>
        <View style={styles.layerList}>
          {layers.map((layer) => (
            <Pressable key={layer.name} onPress={() => toggleLayer(layer.name)} style={[styles.layer, activeLayer === layer.name && styles.layerActive]}>
              <View style={styles.layerIcon}><MaterialCommunityIcons name={layer.icon} size={20} color={activeLayer === layer.name ? theme.onPrimary : theme.muted} /></View>
              <View style={{ flex: 1 }}><Text style={styles.layerName}>{layer.name}</Text><Text style={styles.layerDetail}>{layer.detail}</Text></View>
              <Pressable onPress={() => moveLayer(layer.name, -1)} hitSlop={8} style={styles.orderButton}><MaterialCommunityIcons name="chevron-up" size={20} color={theme.muted} /></Pressable>
              <Pressable onPress={() => moveLayer(layer.name, 1)} hitSlop={8} style={styles.orderButton}><MaterialCommunityIcons name="chevron-down" size={20} color={theme.muted} /></Pressable>
            </Pressable>
          ))}
        </View>
        <View style={styles.prototypeNotice}><MaterialCommunityIcons name="information-outline" size={17} color={theme.primary} /><Text style={styles.noticeText}>Prototype only: layer controls are visual and will connect to the depth engine during integration.</Text></View>
        <Pressable onPress={() => router.replace("/")} style={styles.applyButton}><MaterialCommunityIcons name="check" size={20} color={theme.onPrimary} /><Text style={styles.applyText}>Save design preview</Text></Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topbar: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingVertical: 10 },
  back: { width: 42, height: 42, borderRadius: 21, backgroundColor: theme.surface, alignItems: "center", justifyContent: "center" },
  topTitle: { color: theme.text, fontSize: 16, fontWeight: "800" },
  topSub: { color: theme.muted, fontSize: 11, marginTop: 3 },
  done: { backgroundColor: theme.surface2, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  doneText: { color: theme.primary, fontWeight: "700", fontSize: 12 },
  scroll: { paddingHorizontal: 18, paddingBottom: 24 },
  previewFrame: { width: Math.min(screenWidth - 36, 390), height: Math.min((screenWidth - 36) * 1.55, 570), alignSelf: "center", borderRadius: 28, overflow: "hidden", backgroundColor: theme.surface2, marginTop: 4 },
  photo: { width: "100%", height: "100%" },
  photoShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,8,15,0.2)" },
  clock: { position: "absolute", top: "17%", left: 0, right: 0, alignItems: "center", paddingVertical: 5, zIndex: 2 },
  time: { color: "#FFFFFF", fontSize: 66, fontWeight: "300", letterSpacing: -3, textShadowColor: "rgba(0,0,0,0.2)", textShadowRadius: 8 },
  date: { color: "#FFFFFF", fontSize: 10, letterSpacing: 2, fontWeight: "700", marginTop: -3 },
  clockOff: { color: "#FFFFFF", fontSize: 14, backgroundColor: "rgba(20,20,25,0.5)", padding: 8, borderRadius: 12 },
  foregroundDemo: { position: "absolute", bottom: 22, left: -5, right: -5, height: 145, justifyContent: "flex-end", alignItems: "center", zIndex: 3 },
  fgSun: { position: "absolute", width: 72, height: 72, borderRadius: 36, backgroundColor: "#D9B77D", right: "19%", top: 0, opacity: 0.9 },
  previewHint: { position: "absolute", bottom: 12, alignSelf: "center", flexDirection: "row", gap: 6, alignItems: "center", backgroundColor: "rgba(15,15,20,0.65)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, zIndex: 4 },
  previewHintText: { color: "#FFFFFF", fontSize: 10, fontWeight: "600" },
  toolsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", backgroundColor: theme.surface, borderRadius: 18, paddingVertical: 14, marginTop: 14, borderWidth: 1, borderColor: theme.outlineSoft },
  tool: { flexDirection: "row", alignItems: "center", gap: 8 },
  toolText: { color: theme.text, fontSize: 12, fontWeight: "600" },
  toolDivider: { width: 1, height: 25, backgroundColor: theme.outlineSoft },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 24, marginBottom: 12 },
  sectionTitle: { color: theme.text, fontSize: 17, fontWeight: "800" },
  sectionMeta: { color: theme.muted, fontSize: 10 },
  layerList: { gap: 8 },
  layer: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.outlineSoft, borderRadius: 17, padding: 10 },
  layerActive: { borderColor: theme.primary, backgroundColor: "#24212D" },
  layerIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: theme.surface3, alignItems: "center", justifyContent: "center" },
  layerName: { color: theme.text, fontSize: 12, fontWeight: "700" },
  layerDetail: { color: theme.muted, fontSize: 10, marginTop: 3 },
  orderButton: { width: 28, height: 30, alignItems: "center", justifyContent: "center" },
  prototypeNotice: { flexDirection: "row", gap: 9, alignItems: "center", padding: 12, backgroundColor: theme.surface, borderRadius: 14, marginTop: 14 },
  noticeText: { flex: 1, color: theme.muted, fontSize: 10, lineHeight: 15 },
  applyButton: { flexDirection: "row", gap: 8, justifyContent: "center", alignItems: "center", backgroundColor: theme.primary, paddingVertical: 15, borderRadius: 18, marginTop: 14 },
  applyText: { color: theme.onPrimary, fontSize: 13, fontWeight: "800" }
});