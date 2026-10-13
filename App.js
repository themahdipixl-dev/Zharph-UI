import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Image, StyleSheet, StatusBar, Animated, Easing, useWindowDimensions } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import * as ImagePicker from "expo-image-picker";
import { useFonts, MaterialSymbolsRounded_400Regular } from "@expo-google-fonts/material-symbols-rounded";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";

const C = {
  bg: "#111216", surface: "#1B1C22", surface2: "#24252D",
  primary: "#D0BCFF", onPrimary: "#381E72", text: "#E6E1E9",
  muted: "#C5C0D0", outline: "#34343D"
};
const items = [
  ["Alpine dusk", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&auto=format&fit=crop&q=85"],
  ["Quiet coast", "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=700&auto=format&fit=crop&q=85"],
  ["Blue hour", "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&auto=format&fit=crop&q=85"],
  ["Desert lines", "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=700&auto=format&fit=crop&q=85"],
  ["Forest light", "https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&auto=format&fit=crop&q=85"],
  ["Soft horizon", "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=700&auto=format&fit=crop&q=85"],
  ["Misty peaks", "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&auto=format&fit=crop&q=85&sat=-20"],
  ["Emerald lake", "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=700&auto=format&fit=crop&q=85"],
  ["Golden fields", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&auto=format&fit=crop&q=85"],
  ["Ocean cliffs", "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=700&auto=format&fit=crop&q=85"],
  ["Autumn path", "https://images.unsplash.com/photo-1507783548227-7b1b4fa075e0?w=700&auto=format&fit=crop&q=85"],
  ["Snow valley", "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=700&auto=format&fit=crop&q=85"],
  ["Tropical bay", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=85"],
  ["Moonlit lake", "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=700&auto=format&fit=crop&q=85&sat=-35"],
  ["Pine wilderness", "https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&auto=format&fit=crop&q=85&sat=-15"],
  ["Canyon glow", "https://images.unsplash.com/photo-1464013778555-8e723c2f01f8?w=700&auto=format&fit=crop&q=85"],
  ["Rainforest", "https://images.unsplash.com/photo-1511497584788-876760111969?w=700&auto=format&fit=crop&q=85"],
  ["Calm lagoon", "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=700&auto=format&fit=crop&q=85"],
  ["Cloud summit", "https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=700&auto=format&fit=crop&q=85"],
  ["River bend", "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=700&auto=format&fit=crop&q=85"]
];
const tabs = [
  ["Home", "home"], ["Depth", "layers"],
  ["Add", "add"], ["Saved", "bookmark"], ["Settings", "settings"]
];

function findTouch(touches, identifier) {
  if (!touches) return null;
  for (let i = 0; i < touches.length; i++) {
    if ((touches[i].identifier ?? 0) === identifier) return touches[i];
  }
  return null;
}

function GoogleSymbol({ name, size = 24, color, filled = false, style }) {
  const opticalOffset = name === "home" ? { transform: [{ translateX: 1.2 }, { translateY: -1 }] } : null;
  return <Text accessibilityLabel={name} style={[{ width: size, height: size, fontFamily: "MaterialSymbolsRounded_400Regular", fontSize: size, lineHeight: size, color, textAlign: "center", textAlignVertical: "center", includeFontPadding: false, padding: 0, margin: 0 }, opticalOffset, style]}>{name}</Text>;
}

export default function App() {
  const [fontsLoaded] = useFonts({ MaterialSymbolsRounded_400Regular });

  useEffect(() => {
    NavigationBar.setStyle("light");
    NavigationBar.setButtonStyleAsync("dark").catch(() => {});
    NavigationBar.setBackgroundColorAsync("#F3EDF7").catch(() => {});
  }, []);
  const [tab, setTab] = useState("Home");
  const rootRef = useRef(null);
  const previewTargetRef = useRef(null);
  const [sharedTransition, setSharedTransition] = useState(null);
  const lastEditorTransition = useRef(null);
  const transitionX = useRef(new Animated.Value(0)).current;
  const transitionY = useRef(new Animated.Value(0)).current;
  const transitionW = useRef(new Animated.Value(0)).current;
  const transitionH = useRef(new Animated.Value(0)).current;
  const transitionRadius = useRef(new Animated.Value(16)).current;
  const transitionBorderWidth = useRef(new Animated.Value(0)).current;
  const editorBackOpacity = useRef(new Animated.Value(0)).current;
  const editorBackY = useRef(new Animated.Value(-12)).current;
  const editorTitleOpacity = useRef(new Animated.Value(0)).current;
  const editorTitleY = useRef(new Animated.Value(-12)).current;
  const editorApplyOpacity = useRef(new Animated.Value(0)).current;
  const editorApplyY = useRef(new Animated.Value(-12)).current;
  const transitionBgOpacity = useRef(new Animated.Value(0)).current;
  const transitionBgScale = useRef(new Animated.Value(1.04)).current;
  const openEditor = (wallpaper, cardRef) => {
    if (!cardRef?.current || !rootRef.current) {
      setSelectedWallpaper(wallpaper);
      setActiveEditorTool("Depth");
      setTab("Editor");
      requestAnimationFrame(() => buildEditorToolsMotion(false).start());
      return;
    }
    cardRef.current.measureInWindow((cardX, cardY, cardW, cardH) => {
      rootRef.current?.measureInWindow((rootX, rootY) => {
        const start = { x: cardX - rootX, y: cardY - rootY, width: cardW, height: cardH };
        setSelectedWallpaper(wallpaper);
        setActiveEditorTool("Depth");
        lastEditorTransition.current = { uri: wallpaper.uri, start, target: null };
        setSharedTransition({ uri: wallpaper.uri, start, closing: false });
        transitionX.setValue(start.x);
        transitionY.setValue(start.y);
        transitionW.setValue(start.width);
        transitionH.setValue(start.height);
        transitionRadius.setValue(16);
        transitionBorderWidth.setValue(0);
        editorBackOpacity.setValue(0);
        editorBackY.setValue(-12);
        editorTitleOpacity.setValue(0);
        editorTitleY.setValue(-12);
        editorApplyOpacity.setValue(0);
        editorApplyY.setValue(-12);
        transitionBgOpacity.setValue(0);
        transitionBgScale.setValue(1.04);
        setTab("Editor");
      });
    });
  };
  const homeScrollRef = useRef(null);
  const homeScrollY = useRef(0);
  const [selectedWallpaper, setSelectedWallpaper] = useState({ title: items[0][0], uri: items[0][1] });
  const [activeEditorTool, setActiveEditorTool] = useState("Depth");
  const editorToolMotion = useRef(Array.from({ length: 5 }, () => ({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(22)
  }))).current;
  const editorToolsHeaderMotion = useRef(Array.from({ length: 2 }, () => ({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(22)
  }))).current;
  const editorToolsExitRunning = useRef(false);
  const buildEditorToolsMotion = useCallback((closing = false) => {
    const allMotion = editorToolMotion.concat(editorToolsHeaderMotion);
    allMotion.forEach((motion) => {
      motion.opacity.stopAnimation();
      motion.translateY.stopAnimation();
      if (!closing) {
        motion.opacity.setValue(0);
        motion.translateY.setValue(22);
      }
    });
    const makeMotion = (motion) => Animated.parallel([
      Animated.timing(motion.opacity, {
        toValue: closing ? 0 : 1,
        duration: closing ? 180 : 210,
        easing: closing ? Easing.in(Easing.cubic) : Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.timing(motion.translateY, {
        toValue: closing ? 22 : 0,
        duration: closing ? 180 : 240,
        easing: closing ? Easing.in(Easing.cubic) : Easing.out(Easing.cubic),
        useNativeDriver: true
      })
    ]);
    const cards = Animated.stagger(closing ? 35 : 27, editorToolMotion.map(makeMotion));
    const headings = Animated.stagger(closing ? 35 : 55, editorToolsHeaderMotion.map(makeMotion));
    return closing
      ? Animated.parallel([cards, headings])
      : Animated.parallel([cards, Animated.sequence([Animated.delay(150), headings])]);
  }, [editorToolMotion, editorToolsHeaderMotion]);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [filterScrolledLeft, setFilterScrolledLeft] = useState(false);
  const filterFadeOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(filterFadeOpacity, {
      toValue: filterScrolledLeft ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }, [filterScrolledLeft, filterFadeOpacity]);
  const [navTab, setNavTab] = useState("Home");
  const [barWidth, setBarWidth] = useState(0);
  const navTranslateY = useRef(new Animated.Value(0)).current;
  const navScale = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);
  const navHidden = useRef(false);
  const animateNav = useCallback((hide) => {
    navTranslateY.stopAnimation();
    navScale.stopAnimation();
    if (hide) {
      Animated.parallel([
        Animated.timing(navScale, { toValue: 0.86, duration: 330, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(navTranslateY, { toValue: 112, duration: 330, easing: Easing.in(Easing.cubic), useNativeDriver: true })
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(navTranslateY, { toValue: 0, duration: 330, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(navScale, { toValue: 1, duration: 330, easing: Easing.out(Easing.cubic), useNativeDriver: true })
      ]).start();
    }
  }, [navTranslateY, navScale]);
  // Same hide/show motion as list scrolling, driven by opening/closing the editor.
  const NAV_SHOW_DELAY_AFTER_EDITOR = 320; // wait for editor tools exit to finish
  const prevTabRef = useRef(tab);
  useEffect(() => {
    const prev = prevTabRef.current;
    prevTabRef.current = tab;
    if (tab === "Editor") {
      navHidden.current = true;
      animateNav(true);
      return;
    }
    if (prev === "Editor") {
      navHidden.current = false;
      const id = setTimeout(() => animateNav(false), NAV_SHOW_DELAY_AFTER_EDITOR);
      return () => clearTimeout(id);
    }
  }, [tab, animateNav]);
  const layoutHeaderOpacity = useRef(new Animated.Value(1)).current;
  const layoutStickyOpacity = useRef(new Animated.Value(0)).current;
  const layoutStickyY = useRef(new Animated.Value(-48)).current;
  const layoutInStickyBar = useRef(false);
  const [stickyLayoutActive, setStickyLayoutActive] = useState(false);
  useEffect(() => {
    if (tab === "Home" && homeScrollRef.current) {
      requestAnimationFrame(() => homeScrollRef.current?.scrollTo({ y: homeScrollY.current, animated: false }));
    }
  }, [tab]);
  const handlePageScroll = (event) => {
    const y = Math.max(0, event.nativeEvent.contentOffset.y);
    if (tab === "Home" || tab === "Add") homeScrollY.current = y;
    const delta = y - lastScrollY.current;
    lastScrollY.current = y;

    const shouldShowStickyLayout = y > 64;
    if (shouldShowStickyLayout !== layoutInStickyBar.current) {
      layoutInStickyBar.current = shouldShowStickyLayout;
      setStickyLayoutActive(shouldShowStickyLayout);
      layoutHeaderOpacity.stopAnimation();
      layoutStickyOpacity.stopAnimation();
      layoutStickyY.stopAnimation();
      Animated.timing(layoutHeaderOpacity, {
        toValue: shouldShowStickyLayout ? 0 : 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }).start();
      if (shouldShowStickyLayout) {
        layoutStickyY.setValue(-48);
        Animated.parallel([
          Animated.timing(layoutStickyOpacity, {
            toValue: 1,
            duration: 260,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true
          }),
          Animated.spring(layoutStickyY, {
            toValue: 0,
            speed: 16,
            bounciness: 5,
            useNativeDriver: true
          })
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(layoutStickyOpacity, {
            toValue: 0,
            duration: 150,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true
          }),
          Animated.timing(layoutStickyY, {
            toValue: -48,
            duration: 180,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true
          })
        ]).start();
      }
    }

    let shouldHide = navHidden.current;
    if (y > 12 && delta > 3) shouldHide = true;
    else if (delta < -3 || y <= 2) shouldHide = false;
    if (shouldHide === navHidden.current) return;

    navHidden.current = shouldHide;
    animateNav(shouldHide);
  };
  const slotWidth = barWidth > 0 ? (barWidth - 18) / tabs.length : 0;
  const indicatorLeft = 9 + Math.max(0, (slotWidth - 54) / 2);
  const liquidX = useRef(new Animated.Value(0)).current;
  const liquidStretch = useRef(new Animated.Value(1)).current;
  const liquidTapX = useRef(new Animated.Value(1)).current;
  const liquidTapY = useRef(new Animated.Value(1)).current;
  const iconScales = useRef(tabs.reduce((acc, [name]) => {
    acc[name] = new Animated.Value(name === "Home" ? 1.12 : 1);
    return acc;
  }, {})).current;
  const addIconRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const activeIndex = tabs.findIndex(([name]) => name === navTab);
    if (activeIndex < 0 || slotWidth <= 0) return;
    Animated.parallel([
      Animated.spring(liquidX, {
        toValue: activeIndex * slotWidth,
        speed: 14,
        bounciness: 9,
        useNativeDriver: true
      }),
      Animated.sequence([
        Animated.timing(liquidStretch, { toValue: 1.42, duration: 120, useNativeDriver: true }),
        Animated.spring(liquidStretch, { toValue: 1, speed: 12, bounciness: 10, useNativeDriver: true })
      ])
    ]).start();
  }, [navTab, slotWidth, liquidX, liquidStretch]);

  const animateLiquidTap = () => {
    liquidTapX.stopAnimation();
    liquidTapY.stopAnimation();
    liquidTapX.setValue(1);
    liquidTapY.setValue(1);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(liquidTapX, { toValue: 1.2, duration: 85, useNativeDriver: true }),
        Animated.spring(liquidTapX, { toValue: 1, speed: 13, bounciness: 13, useNativeDriver: true })
      ]),
      Animated.sequence([
        Animated.timing(liquidTapY, { toValue: 0.82, duration: 85, useNativeDriver: true }),
        Animated.spring(liquidTapY, { toValue: 1, speed: 13, bounciness: 13, useNativeDriver: true })
      ])
    ]).start();
  };

  useEffect(() => {
    tabs.forEach(([name]) => {
      Animated.spring(iconScales[name], {
        toValue: navTab === name ? 1.16 : 1,
        speed: 18,
        bounciness: 10,
        useNativeDriver: true
      }).start();
    });
  }, [navTab, iconScales]);
  const [addPopupVisible, setAddPopupVisible] = useState(false);
  useEffect(() => {
    addIconRotation.stopAnimation();
    Animated.timing(addIconRotation, {
      toValue: addPopupVisible ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }, [addPopupVisible, addIconRotation]);

  useEffect(() => {
    // Opacity is independent from the elastic spring so its rebound cannot
    // briefly reveal a tiny, faded capsule at the end of closing.
    popupOpacity.stopAnimation();
    Animated.timing(popupOpacity, {
      toValue: addPopupVisible ? 1 : 0,
      duration: addPopupVisible ? 110 : 170,
      useNativeDriver: true
    }).start();

    popupProgress.stopAnimation();
    Animated.spring(popupProgress, {
      toValue: addPopupVisible ? 1 : 0,
      speed: 16,
      bounciness: 14,
      useNativeDriver: true
    }).start(({ finished }) => {
      if (finished && !addPopupVisible) setPopupMounted(false);
    });
  }, [addPopupVisible, popupProgress, popupOpacity]);
  const [filter, setFilter] = useState("All");
  const [gridColumns, setGridColumns] = useState(2);
  const [userImages, setUserImages] = useState([]);
  const renderPage = (pageTab, pointerEvents = "auto") => {
    if (pageTab === "Editor") {
      const previewWidth = Math.max(160, Math.min(windowWidth - 44, 315, (windowHeight - 255) * 9 / 19.5));
      const previewHeight = previewWidth * 19.5 / 9;
      const editorTools = [["Depth", "layers"], ["Crop", "crop"], ["Clock", "schedule"], ["Parallax", "3d_rotation"], ["Effects", "auto_awesome"]];
      return (
        <View style={[s.editorPage, { backgroundColor: sharedTransition ? "transparent" : C.bg }]}>
          <View style={[s.editorHeader, sharedTransition && { opacity: 0 }]}>
            <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => {
              if (editorToolsExitRunning.current) return;
              const last = lastEditorTransition.current;
              if (!last?.target) { setTab("Home"); return; }
              editorToolsExitRunning.current = true;
              transitionX.setValue(last.target.x);
              transitionY.setValue(last.target.y);
              transitionW.setValue(last.target.width);
              transitionH.setValue(last.target.height);
              transitionRadius.setValue(28);
              transitionBorderWidth.setValue(1);
              editorBackOpacity.setValue(1);
              editorBackY.setValue(0);
              editorTitleOpacity.setValue(1);
              editorTitleY.setValue(0);
              editorApplyOpacity.setValue(1);
              editorApplyY.setValue(0);
              transitionBgOpacity.setValue(1);
              transitionBgScale.setValue(1);
              setSharedTransition({ uri: last.uri, start: last.start, closing: true });
              setTab("Home");
            }} style={s.editorBack}><GoogleSymbol name="arrow_back" size={25} color={C.text} /></Pressable>
            <Text style={s.editorTitle}>Edit wallpaper</Text>
            <Pressable style={s.applyButton} onPress={() => {}}><Text style={s.applyText}>Apply</Text></Pressable>
          </View>
          <View style={s.previewStage}>
            <View ref={previewTargetRef} collapsable={false} style={[s.phonePreview, { width: previewWidth, height: previewHeight, opacity: sharedTransition ? 0 : 1 }]}>
              <Image source={{ uri: selectedWallpaper.uri }} style={s.previewImage} resizeMode="cover" />
              <View pointerEvents="none" style={s.previewClock}>
                <Text style={s.previewDate}>MONDAY, OCTOBER 12</Text>
                <Text style={[s.previewTime,{fontSize:Math.min(windowWidth*0.19,68),lineHeight:Math.min(windowWidth*0.2,72)}]}>9:41</Text>
              </View>
            </View>
          </View>
          <View style={s.editorToolsHeader}>
            <Animated.View style={{ opacity: editorToolsHeaderMotion[0].opacity, transform: [{ translateY: editorToolsHeaderMotion[0].translateY }] }}>
              <Text style={s.editorSectionTitle}>Tools</Text>
            </Animated.View>
            <Animated.View style={{ flexShrink: 1, minWidth: 0, opacity: editorToolsHeaderMotion[1].opacity, transform: [{ translateY: editorToolsHeaderMotion[1].translateY }] }}>
              <Text style={s.editorWallpaperName} numberOfLines={1}>{selectedWallpaper.title}</Text>
            </Animated.View>
          </View>
          <View style={s.editorTools}>
            {editorTools.map(([name, icon], index) => <Animated.View key={name} style={{ flex: 1, minWidth: 0, height: 68, alignItems: "stretch", opacity: editorToolMotion[index].opacity, transform: [{ translateY: editorToolMotion[index].translateY }] }}>
              <Pressable accessibilityRole="button" onPress={() => setActiveEditorTool(name)} style={[s.editorTool, activeEditorTool === name && s.editorToolActive]}>
                <GoogleSymbol name={icon} size={name === "Depth" ? 28 : 26} color={activeEditorTool === name ? C.onPrimary : C.text} />
                <Text style={[s.editorToolLabel, activeEditorTool === name && s.editorToolLabelActive]}>{name}</Text>
              </Pressable>
            </Animated.View>)}
          </View>
        </View>
      );
    }
    return (
    <ScrollView ref={(pageTab === "Home" || pageTab === "Add") ? homeScrollRef : undefined} pointerEvents={pointerEvents} nestedScrollEnabled showsVerticalScrollIndicator={false} scrollEventThrottle={16} onScroll={handlePageScroll} stickyHeaderIndices={(pageTab === "Home" || pageTab === "Add") ? [1] : []} contentContainerStyle={s.scroll} style={{ width: stageSize.width || "100%", height: stageSize.height || "100%" }}>
      <View style={s.header}>
        <Text style={s.brand}>Zharph<Text style={{color:C.primary}}>.</Text></Text>
        {(pageTab === "Home" || pageTab === "Add") && <Animated.View style={{ opacity: layoutHeaderOpacity }}>
          <Pressable accessibilityRole="button" accessibilityLabel={gridColumns === 2 ? "Switch to three-column grid" : "Switch to two-column grid"} onPress={() => setGridColumns(columns => columns === 2 ? 3 : 2)} style={s.layoutButton}>
            <GoogleSymbol name={gridColumns === 2 ? "grid_view" : "view_module"} size={26} color={C.text} />
          </Pressable>
        </Animated.View>}
      </View>
      {(pageTab === "Home" || pageTab === "Add") && <View style={s.stickyFilters}>
        <View pointerEvents="none" style={s.stickyFilterBackdrop} />
        <View pointerEvents="none" style={s.filterFade}><Svg width="10" height="100%" viewBox="0 0 10 60" preserveAspectRatio="none"><Defs><LinearGradient id="filterFadeGradient" x1="0" y1="0" x2="1" y2="0"><Stop offset="0" stopColor={C.bg} stopOpacity="0" /><Stop offset="1" stopColor={C.bg} stopOpacity="1" /></LinearGradient></Defs><Rect x="0" y="0" width="10" height="60" fill="url(#filterFadeGradient)" /></Svg></View>
        <Animated.View pointerEvents="none" style={[s.filterFadeLeft, { opacity: filterFadeOpacity }]}><Svg width="10" height="100%" viewBox="0 0 10 60" preserveAspectRatio="none"><Defs><LinearGradient id="filterFadeLeftGradient" x1="1" y1="0" x2="0" y2="0"><Stop offset="0" stopColor={C.bg} stopOpacity="0" /><Stop offset="1" stopColor={C.bg} stopOpacity="1" /></LinearGradient></Defs><Rect x="0" y="0" width="10" height="60" fill="url(#filterFadeLeftGradient)" /></Svg></Animated.View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroller} contentContainerStyle={s.filters} scrollEventThrottle={16} onScroll={event => { const scrolled = event.nativeEvent.contentOffset.x > 1; setFilterScrolledLeft(current => current === scrolled ? current : scrolled); }}>
          {["All","Depth","Parallax","Minimal","Test"].map(x=><Pressable key={x} onPress={()=>setFilter(x)} style={[s.filter,filter===x&&s.filterOn]}><Text style={[s.filterText,filter===x&&{color:C.onPrimary}]}>{x}</Text></Pressable>)}
        </ScrollView>
        <View pointerEvents="none" style={s.stickyFilterIcon}>
          <GoogleSymbol name="tune" size={26} color={C.text} />
        </View>
      </View>}
      {pageTab === "Home" || pageTab === "Add" ? <View style={[s.grid, gridColumns === 2 && s.gridTwoColumns]}>
        {userImages.map((uri,index)=>{ const cardRef = React.createRef(); return <Pressable key={`user-${index}-${uri}`} ref={cardRef} collapsable={false} style={[s.card, gridColumns === 2 && s.cardTwoColumns]} onPress={()=>openEditor({title:"My wallpaper",uri}, cardRef)}><Image source={{uri}} style={s.photo}/></Pressable>; })}
        {items.map(([title,uri])=>{ const cardRef = React.createRef(); return <Pressable key={title} ref={cardRef} collapsable={false} style={[s.card, gridColumns === 2 && s.cardTwoColumns]} onPress={()=>openEditor({title,uri}, cardRef)}><Image source={{uri}} style={s.photo}/></Pressable>; })}
      </View> : <View style={s.placeholder}><View style={s.bigIcon}><GoogleSymbol name={pageTab==="Depth"?"layers":pageTab==="Saved"?"bookmark":pageTab==="Settings"?"settings":"image"} size={34} color={C.primary}/></View><Text style={s.title}>{pageTab==="Editor"?"Wallpaper editor":pageTab}</Text><Text style={s.placeholderText}>{pageTab==="Depth"?"Choose a photo to start creating a depth wallpaper.":pageTab==="Saved"?"Your saved wallpapers will appear here.":pageTab==="Settings"?"Customize your Zharph experience.":"Preview your selected wallpaper."}</Text><Pressable style={s.primaryButton} onPress={()=>setTab("Home")}><Text style={s.primaryText}>Back to Home</Text></Pressable></View>}
    </ScrollView>
    );
  };
  const closeAddPopup = () => {
    setAddPopupVisible(false);
    setNavTab(previousNavTab);
  };
  const addPhoto = async () => {
    closeAddPopup();
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: false, quality: 1 });
    if (!result.canceled && result.assets?.[0]?.uri) setUserImages(prev => [result.assets[0].uri, ...prev]);
  };
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View ref={rootRef} collapsable={false} style={s.root}>
        <View style={{ flex: 1, backgroundColor: C.bg }}>
          <View style={{flex:1, overflow:"hidden", backgroundColor:C.bg}}>
            {renderPage(sharedTransition ? "Home" : tab)}
          </View>
        </View>
        {sharedTransition && <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Animated.View style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, backgroundColor: C.bg, opacity: transitionBgOpacity, transform: [{ scale: transitionBgScale }] }} />
          <Animated.View style={{ position: "absolute", left: transitionX, top: transitionY, width: transitionW, height: transitionH, borderRadius: transitionRadius, borderWidth: transitionBorderWidth, borderColor: C.outline, overflow: "hidden", backgroundColor: C.surface2 }}>
            <Image source={{ uri: sharedTransition.uri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
          </Animated.View>
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>{renderPage("Editor")}</View>
          <View style={{ position: "absolute", left: 20, right: 20, top: 8, height: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Animated.View style={{ width: 42, height: 42, alignItems: "flex-start", justifyContent: "center", opacity: editorBackOpacity, transform: [{ translateY: editorBackY }] }}><GoogleSymbol name="arrow_back" size={25} color={C.text} /></Animated.View>
            <Animated.Text style={{ color: C.text, fontSize: 19, fontWeight: "700", flex: 1, marginLeft: 4, transform: [{ translateY: Animated.add(editorTitleY, -2) }], opacity: editorTitleOpacity }}>Edit wallpaper</Animated.Text>
            <Animated.View style={{ paddingHorizontal: 17, paddingVertical: 10, borderRadius: 20, backgroundColor: C.primary, opacity: editorApplyOpacity, transform: [{ translateY: editorApplyY }] }}><Text style={{ color: C.onPrimary, fontSize: 13, fontWeight: "700", transform: [{ translateY: -2 }] }}>Apply</Text></Animated.View>
          </View>
        </View>}
        <Animated.View pointerEvents={tab === "Editor" ? "none" : "auto"} style={[s.bar, { transform: [{ translateY: navTranslateY }, { scale: navScale }] }]} onLayout={event => setBarWidth(event.nativeEvent.layout.width)}>
          <Animated.View pointerEvents="none" style={[s.liquidIndicator, {
            left: indicatorLeft,
            transform: [
              { translateX: liquidX },
              { scaleX: Animated.multiply(liquidStretch, liquidTapX) },
              { scaleY: liquidTapY }
            ]
          }]} />
          {tabs.map(([name, iconName]) => {
            const active = navTab === name;
            return <Pressable key={name} onPress={() => {
              if (name === navTab) animateLiquidTap();
              if (name === "Add") {
                if (addPopupVisible) {
                  closeAddPopup();
                } else {
                  setPreviousNavTab(navTab);
                  setNavTab("Add");
                  setPopupMounted(true);
                  setAddPopupVisible(true);
                }
              } else {
                setAddPopupVisible(false);
                setTab(name);
                setNavTab(name);
              }
            }} style={s.tab}>
              <Animated.View style={[s.pill, { transform: [{ scale: iconScales[name] }] }]}>
                <View style={name === "Add" ? { transform: [{ translateX: 1 }, { translateY: -1 }] } : undefined}>
                  <View style={{ width: 25, height: 25, alignItems: "center", justifyContent: "center" }}>
                    {name === "Add" ? <Animated.View style={{ transform: [{ rotate: addIconRotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "45deg"] }) }] }}><GoogleSymbol name={iconName} size={25} color={active ? C.onPrimary : C.muted} /></Animated.View> : <GoogleSymbol name={iconName} size={25} color={active ? C.onPrimary : C.muted} />}
                  </View>
                </View>
              </Animated.View>
            </Pressable>;
          })}
        </Animated.View>
        {popupMounted && tab !== "Editor" && <>
          <Animated.View pointerEvents={addPopupVisible ? "auto" : "none"} style={[s.popupDismiss, {
            opacity: popupOpacity
          }]}>
            <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.42)" }]} />
            <Pressable style={StyleSheet.absoluteFill} onPress={closeAddPopup} />
          </Animated.View>
          <Animated.View pointerEvents={addPopupVisible ? "auto" : "none"} style={[s.addPopup, {
            opacity: popupOpacity,
            transform: [
              { translateY: popupProgress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [18, -3, 0] }) },
              { scaleX: popupProgress.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0.82, 1.08, 1] }) },
              { scaleY: popupProgress.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0.72, 0.94, 1] }) }
            ]
          }]}>
            <Pressable onPress={addPhoto} style={s.addPopupAction}><Text style={s.addPopupText}>Open Gallery</Text></Pressable>
          </Animated.View>
        </>}
      </View>
    </SafeAreaView>
  );
}
const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:C.bg},root:{flex:1,backgroundColor:C.bg},scroll:{paddingHorizontal:20,paddingTop:8,paddingBottom:16},
 header:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:20},brand:{color:C.text,fontSize:30,fontWeight:"800",letterSpacing:-1.2,transform:[{translateY:-5}]},layoutButton:{width:42,height:42,alignItems:"center",justifyContent:"center",backgroundColor:"transparent",borderWidth:0,borderColor:"transparent",transform:[{translateX:12},{translateY:-1}]},
 title:{color:C.text,fontSize:21,fontWeight:"700",letterSpacing:-.4},
 stickyFilters:{position:"relative",flexDirection:"row",alignItems:"center",backgroundColor:C.bg,paddingTop:2,paddingBottom:8,marginTop:-12,marginHorizontal:-20,paddingHorizontal:20,paddingRight:45,gap:8,zIndex:2,elevation:2},stickyFilterBackdrop:{position:"absolute",left:"100%",top:0,bottom:0,width:0,backgroundColor:C.bg,zIndex:1},
 stickyFilterIcon:{position:"absolute",right:-33,top:2,width:42,height:42,alignItems:"center",justifyContent:"center",zIndex:2,transform:[{translateX:3},{translateY:-4}]},filterFade:{position:"absolute",right:0,top:0,bottom:0,width:10,zIndex:1},filterFadeLeft:{position:"absolute",left:0,top:0,bottom:0,width:10,zIndex:1},filterScroller:{flex:1,minWidth:0},filters:{gap:8,paddingBottom:8,paddingRight:15},filter:{borderRadius:18,paddingHorizontal:17,paddingVertical:9,backgroundColor:C.surface,borderWidth:1,borderColor:C.outline},filterOn:{backgroundColor:C.primary,borderColor:C.primary},filterText:{color:C.muted,fontSize:12,fontWeight:"600"},
 grid:{flexDirection:"row",flexWrap:"wrap",justifyContent:"flex-start",columnGap:"3.8%",rowGap:14},gridTwoColumns:{columnGap:0,justifyContent:"space-between"},card:{width:"30.8%",marginBottom:2},cardTwoColumns:{width:"48%"},photo:{width:"100%",aspectRatio:0.5,borderRadius:16,backgroundColor:C.surface2},
editorPage:{flex:1,backgroundColor:"transparent",paddingHorizontal:20,paddingTop:8,paddingBottom:12},editorHeader:{height:48,flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:4},editorBack:{width:42,height:42,alignItems:"flex-start",justifyContent:"center"},editorTitle:{color:C.text,fontSize:19,fontWeight:"700",flex:1,marginLeft:4,transform:[{translateY:-2}]},applyButton:{paddingHorizontal:17,paddingVertical:10,borderRadius:20,backgroundColor:C.primary},applyText:{color:C.onPrimary,fontSize:13,fontWeight:"700",transform:[{translateY:-2}]},previewStage:{flex:1,minHeight:0,alignItems:"center",justifyContent:"center",paddingVertical:8},phonePreview:{borderRadius:28,overflow:"hidden",backgroundColor:C.surface2,borderWidth:1,borderColor:C.outline,elevation:0,shadowOpacity:0,shadowRadius:0,shadowOffset:{width:0,height:0}},previewImage:{...StyleSheet.absoluteFillObject,width:"100%",height:"100%"},previewClock:{position:"absolute",top:"17%",left:0,right:0,alignItems:"center"},previewDate:{color:"rgba(255,255,255,0.9)",fontSize:9,fontWeight:"700",letterSpacing:1.4,marginBottom:6},previewTime:{color:"#FFFFFF",fontSize:68,fontWeight:"300",letterSpacing:-3,lineHeight:72},editorToolsHeader:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:8,marginBottom:12},editorSectionTitle:{color:C.text,fontSize:17,fontWeight:"700"},editorWallpaperName:{color:C.muted,fontSize:12,flexShrink:1,marginLeft:12},editorTools:{flexDirection:"row",justifyContent:"space-between",gap:6},editorTool:{width:"100%",height:68,flexGrow:0,flexShrink:0,minWidth:0,borderRadius:15,backgroundColor:C.surface,borderWidth:1,borderColor:C.outline,alignItems:"center",justifyContent:"center",gap:5},editorToolActive:{backgroundColor:C.primary,borderColor:C.primary},editorToolLabel:{color:C.muted,fontSize:10,fontWeight:"600"},editorToolLabelActive:{color:C.onPrimary},popupDismiss:{...StyleSheet.absoluteFillObject,zIndex:3,overflow:"hidden"},addPopup:{position:"absolute",alignSelf:"center",bottom:92,zIndex:5,alignItems:"center",justifyContent:"center",backgroundColor:C.primary,borderRadius:22,paddingHorizontal:20,paddingVertical:14,elevation:8,shadowColor:"#000",shadowOpacity:0.25,shadowRadius:12,shadowOffset:{width:0,height:5}},addPopupAction:{justifyContent:"center",alignItems:"center"},addPopupText:{color:C.onPrimary,fontSize:14,fontWeight:"700"},bar:{position:"absolute",left:16,right:16,bottom:8,zIndex:4,flexDirection:"row",alignItems:"center",backgroundColor:C.surface,borderRadius:36,paddingHorizontal:8,paddingVertical:8,borderWidth:1,borderColor:C.outline},tab:{flex:1,alignItems:"center",justifyContent:"center",alignSelf:"stretch",zIndex:1},pill:{width:54,height:54,borderRadius:27,alignItems:"center",justifyContent:"center"},liquidIndicator:{position:"absolute",top:8,width:54,height:54,borderRadius:27,backgroundColor:C.primary,zIndex:0},
 placeholder:{minHeight:420,alignItems:"center",justifyContent:"center",paddingHorizontal:24},bigIcon:{width:76,height:76,borderRadius:26,backgroundColor:C.surface2,alignItems:"center",justifyContent:"center",marginBottom:20},placeholderText:{color:C.muted,fontSize:14,textAlign:"center",lineHeight:21,marginTop:10},primaryButton:{marginTop:24,backgroundColor:C.primary,paddingHorizontal:22,paddingVertical:12,borderRadius:22},primaryText:{color:C.onPrimary,fontWeight:"700"}
});