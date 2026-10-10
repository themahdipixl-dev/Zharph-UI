import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, Pressable, Image, StyleSheet, StatusBar, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import * as ImagePicker from "expo-image-picker";
import { useFonts, MaterialSymbolsRounded_400Regular } from "@expo-google-fonts/material-symbols-rounded";

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
  ["Soft horizon", "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=700&auto=format&fit=crop&q=85"]
];
const tabs = [
  ["Home", "home"], ["Depth", "layers"],
  ["Add", "add"], ["Saved", "bookmark"], ["Settings", "settings"]
];

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
  const [navTab, setNavTab] = useState("Home");
  const [barWidth, setBarWidth] = useState(0);
  const slotWidth = barWidth > 0 ? (barWidth - 18) / tabs.length : 0;
  const indicatorLeft = 9 + Math.max(0, (slotWidth - 54) / 2);
  const liquidX = useRef(new Animated.Value(0)).current;
  const liquidStretch = useRef(new Animated.Value(1)).current;
  const liquidTapX = useRef(new Animated.Value(1)).current;
  const liquidTapY = useRef(new Animated.Value(1)).current;
  const iconScales = useRef(tabs.reduce((acc, [name]) => { acc[name] = new Animated.Value(name === "Home" ? 1.12 : 1); return acc; }, {})).current;
  const addIconRotation = useRef(new Animated.Value(0)).current;
  const [addPopupVisible, setAddPopupVisible] = useState(false);
  const [popupMounted, setPopupMounted] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [swipeTransition, setSwipeTransition] = useState(null);
  const swipeTopX = useRef(new Animated.Value(0)).current;
  const swipeBottomX = useRef(new Animated.Value(0)).current;
  const swipeTransitionRef = useRef(null);
  const swipeStartTabRef = useRef(navTab);
  const swipeSettlingRef = useRef(false);
  const navTabRef = useRef(navTab);
  const addPopupVisibleRef = useRef(addPopupVisible);
  navTabRef.current = navTab;
  addPopupVisibleRef.current = addPopupVisible;
  const navigateToTabRef = useRef(null);
  const popupProgress = useRef(new Animated.Value(0)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const activeIndex = tabs.findIndex(([name]) => name === navTab);
    if (activeIndex < 0) return;
    const slot = activeIndex;
    Animated.parallel([
      Animated.spring(liquidX, {
        toValue: slot * slotWidth,
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
  useEffect(() => {
    addIconRotation.stopAnimation();
    Animated.timing(addIconRotation, {
      toValue: addPopupVisible ? 1 : 0,
      duration: 260,
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
  const finishSwipeTransition = (commit, targetName, direction) => {
    if (swipeSettlingRef.current) return;
    swipeSettlingRef.current = true;
    const distance = commit ? direction * stageSize.width : 0;
    Animated.timing(swipeTopX, {
      toValue: distance,
      duration: commit ? 210 : 170,
      useNativeDriver: true
    }).start(({ finished }) => {
      if (finished && commit && targetName) {
        setNavTab(targetName);
        navTabRef.current = targetName;
        if (targetName === "Add") {
          setPopupMounted(true);
          setAddPopupVisible(true);
        } else {
          setAddPopupVisible(false);
          setTab(targetName);
        }
      }
      swipeTopX.setValue(0);
      swipeBottomX.setValue(0);
      swipeTransitionRef.current = null;
      setSwipeTransition(null);
      swipeSettlingRef.current = false;
    });
  };
  const touchStartRef = useRef(null);
  const lastSwipeRef = useRef({ dx: 0, vx: 0, time: 0 });
  const handleTouchStart = (event) => {
    const touch = event.nativeEvent.touches?.[0];
    if (!touch || swipeSettlingRef.current) return;
    touchStartRef.current = { x: touch.pageX, y: touch.pageY, time: Date.now(), tab: navTabRef.current, claimed: false };
    lastSwipeRef.current = { dx: 0, vx: 0, time: Date.now() };
  };
  const handleTouchMove = (event) => {
    const start = touchStartRef.current;
    const touch = event.nativeEvent.touches?.[0];
    if (!start || !touch || swipeSettlingRef.current || stageSize.width <= 0) return;
    const dx = touch.pageX - start.x;
    const dy = touch.pageY - start.y;
    if (!start.claimed) {
      if (Math.abs(dx) < 10 || Math.abs(dx) <= Math.abs(dy) * 1.2) return;
      const currentIndex = tabs.findIndex(([name]) => name === start.tab);
      const nextIndex = currentIndex + (dx < 0 ? 1 : -1);
      if (nextIndex < 0 || nextIndex >= tabs.length) return;
      start.claimed = true;
      swipeStartTabRef.current = start.tab;
      const transition = { from: start.tab, to: tabs[nextIndex][0], direction: dx < 0 ? -1 : 1 };
      swipeTransitionRef.current = transition;
      setSwipeTransition(transition);
      if (addPopupVisibleRef.current) setAddPopupVisible(false);
    }
    const transition = swipeTransitionRef.current;
    if (!transition) return;
    const direction = dx < 0 ? -1 : 1;
    if (transition.direction !== direction) {
      const currentIndex = tabs.findIndex(([name]) => name === start.tab);
      const nextIndex = currentIndex + (direction < 0 ? 1 : -1);
      if (nextIndex < 0 || nextIndex >= tabs.length) return;
      const updated = { from: start.tab, to: tabs[nextIndex][0], direction };
      swipeTransitionRef.current = updated;
      setSwipeTransition(updated);
      swipeTopX.setValue(0);
      swipeBottomX.setValue(0);
    }
    const active = swipeTransitionRef.current;
    const clampedDx = Math.max(-stageSize.width, Math.min(stageSize.width, dx));
    swipeTopX.setValue(clampedDx);
    swipeBottomX.setValue(clampedDx);
    const now = Date.now();
    const elapsed = Math.max(1, now - lastSwipeRef.current.time);
    lastSwipeRef.current = { dx: clampedDx, vx: (clampedDx - lastSwipeRef.current.dx) / elapsed * 1000, time: now };
  };
  const handleTouchEnd = () => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    const transition = swipeTransitionRef.current;
    if (!start?.claimed || !transition || swipeSettlingRef.current) return;
    const { dx, vx } = lastSwipeRef.current;
    const shouldCommit = Math.abs(dx) > Math.max(64, stageSize.width * 0.22) || Math.abs(vx) > 550;
    finishSwipeTransition(shouldCommit, transition.to, transition.direction);
  };
  const [filter, setFilter] = useState("All");
  const [userImages, setUserImages] = useState([]);
  const renderPage = (pageTab, pointerEvents = "auto") => (
    <ScrollView pointerEvents={pointerEvents} showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} style={{ width: stageSize.width || "100%", height: stageSize.height || "100%" }}>
      <View style={s.header}>
        <Text style={s.brand}>Zharph<Text style={{color:C.primary}}>.</Text></Text>
      </View>
      {pageTab === "Home" || pageTab === "Add" ? <>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>
          {["All","Depth","Parallax","Minimal"].map(x=><Pressable key={x} onPress={()=>setFilter(x)} style={[s.filter,filter===x&&s.filterOn]}><Text style={[s.filterText,filter===x&&{color:C.onPrimary}]}>{x}</Text></Pressable>)}
        </ScrollView>
        <View style={s.grid}>
          {userImages.map((uri,index)=><Pressable key={`user-${index}-${uri}`} style={s.card} onPress={()=>setTab("Editor")}><Image source={{uri}} style={s.photo}/></Pressable>)}
          {items.map(([title,uri])=><Pressable key={title} style={s.card} onPress={()=>setTab("Editor")}><Image source={{uri}} style={s.photo}/></Pressable>)}
        </View>
      </> : <View style={s.placeholder}><View style={s.bigIcon}><GoogleSymbol name={pageTab==="Depth"?"layers":pageTab==="Saved"?"bookmark":pageTab==="Settings"?"settings":"image"} size={34} color={C.primary}/></View><Text style={s.title}>{pageTab==="Editor"?"Wallpaper editor":pageTab}</Text><Text style={s.placeholderText}>{pageTab==="Depth"?"Choose a photo to start creating a depth wallpaper.":pageTab==="Saved"?"Your saved wallpapers will appear here.":pageTab==="Settings"?"Customize your Zharph experience.":"Preview your selected wallpaper."}</Text><Pressable style={s.primaryButton} onPress={()=>setTab("Home")}><Text style={s.primaryText}>Back to Home</Text></Pressable></View>}
    </ScrollView>
  );
  const addPhoto = async () => {
    setAddPopupVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: false, quality: 1 });
    if (!result.canceled && result.assets?.[0]?.uri) setUserImages(prev => [result.assets[0].uri, ...prev]);
  };
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={s.root}>
        <View style={{flex:1, overflow:"hidden"}} onLayout={event => setStageSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onTouchCancel={handleTouchEnd}>
          <View pointerEvents={swipeTransition ? "none" : "auto"} style={{flex:1, opacity: swipeTransition ? 0 : 1}}>
            {renderPage(tab)}
          </View>
          {swipeTransition && stageSize.width > 0 && stageSize.height > 0 && (() => {
            const width = stageSize.width;
            const height = stageSize.height;
            const direction = swipeTransition.direction;
            const progress = swipeTopX.interpolate({
              inputRange: direction < 0 ? [-width, 0] : [0, width],
              outputRange: direction < 0 ? [1, 0] : [0, 1],
              extrapolate: "clamp"
            });
            const outgoingScale = progress.interpolate({
              inputRange: [0, 1], outputRange: [1, 0.84]
            });
            const outgoingOpacity = progress.interpolate({
              inputRange: [0, 1], outputRange: [1, 0.24]
            });
            const blurOpacity = progress.interpolate({
              inputRange: [0, 0.2, 0.65, 1],
              outputRange: [0, 0.45, 0.9, 1],
              extrapolate: "clamp"
            });
            const incomingScale = progress.interpolate({
              inputRange: [0, 1], outputRange: [0.94, 1]
            });
            const incomingOpacity = progress.interpolate({
              inputRange: [0, 0.55, 1], outputRange: [0, 0.8, 1],
              extrapolate: "clamp"
            });
            const incomingX = progress.interpolate({
              inputRange: [0, 1],
              outputRange: [direction < 0 ? width * 0.42 : -width * 0.42, 0],
              extrapolate: "clamp"
            });
            return <>
              <Animated.View pointerEvents="none" style={{
                position: "absolute", left: 0, top: 0, width, height,
                zIndex: 1, overflow: "hidden", opacity: incomingOpacity,
                transform: [{ translateX: incomingX }, { scale: incomingScale }]
              }}>
                {renderPage(swipeTransition.to, "none")}
              </Animated.View>
              <Animated.View pointerEvents="none" style={{
                position: "absolute", left: 0, top: 0, width, height,
                zIndex: 2, overflow: "hidden", opacity: outgoingOpacity,
                transform: [{ scale: outgoingScale }]
              }}>
                {renderPage(swipeTransition.from, "none")}
                <Animated.View pointerEvents="none" style={{
                  ...StyleSheet.absoluteFillObject,
                  opacity: blurOpacity,
                  overflow: "hidden"
                }}>
                  <BlurView
                    intensity={100}
                    tint="dark"
                    experimentalBlurMethod="dimezisBlurView"
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(17,18,22,0.22)" }]} />
                </Animated.View>
              </Animated.View>
            </>;
          })()}
        {popupMounted && <>
          <Animated.View pointerEvents={addPopupVisible ? "auto" : "none"} style={[s.popupDismiss, {
            opacity: popupOpacity
          }]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setAddPopupVisible(false)} />
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
        <View style={s.bar} onLayout={event => setBarWidth(event.nativeEvent.layout.width)}>
          <Animated.View pointerEvents="none" style={[s.liquidIndicator, { left: indicatorLeft, transform: [{ translateX: liquidX }, { scaleX: liquidStretch }, { scaleX: liquidTapX }, { scaleY: liquidTapY }] }]} />
          {tabs.map(([name, iconName])=>{const active=navTab===name;return <Pressable key={name} onPress={()=>{if(name===navTab){animateLiquidTap();}if(name==="Add"){setNavTab("Add");if(addPopupVisible){setAddPopupVisible(false);}else{setPopupMounted(true);setAddPopupVisible(true);}}else{setAddPopupVisible(false);setTab(name);setNavTab(name);}}} style={s.tab}><View style={s.pill}><View style={name === "Add" ? { transform: [{ translateX: 1 }, { translateY: -1 }] } : undefined}><Animated.View style={{ width: 25, height: 25, alignItems: "center", justifyContent: "center", transform: [{ scale: iconScales[name] }, { rotate: name === "Add" ? addIconRotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "135deg"] }) : "0deg" }] }}><GoogleSymbol name={iconName} size={25} color={active?C.onPrimary:C.muted} filled={active && name !== "Add"}/></Animated.View></View></View></Pressable>})}
        </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:C.bg},root:{flex:1,backgroundColor:C.bg},scroll:{paddingHorizontal:20,paddingTop:8,paddingBottom:16},
 header:{flexDirection:"row",alignItems:"center",marginBottom:20},brand:{color:C.text,fontSize:30,fontWeight:"800",letterSpacing:-1.2},
 title:{color:C.text,fontSize:21,fontWeight:"700",letterSpacing:-.4},
 filters:{gap:8,paddingBottom:18},filter:{borderRadius:18,paddingHorizontal:17,paddingVertical:9,backgroundColor:C.surface,borderWidth:1,borderColor:C.outline},filterOn:{backgroundColor:C.primary,borderColor:C.primary},filterText:{color:C.muted,fontSize:12,fontWeight:"600"},
 grid:{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",rowGap:14},card:{width:"30.8%",marginBottom:2},photo:{width:"100%",aspectRatio:.64,borderRadius:16,backgroundColor:C.surface2},
popupDismiss:{...StyleSheet.absoluteFillObject,zIndex:3,backgroundColor:"rgba(0,0,0,0.22)"},addPopup:{position:"absolute",alignSelf:"center",bottom:92,zIndex:5,alignItems:"center",justifyContent:"center",backgroundColor:C.primary,borderRadius:22,paddingHorizontal:20,paddingVertical:14,elevation:8,shadowColor:"#000",shadowOpacity:0.25,shadowRadius:12,shadowOffset:{width:0,height:5}},addPopupAction:{justifyContent:"center",alignItems:"center"},addPopupText:{color:C.onPrimary,fontSize:14,fontWeight:"700"},bar:{position:"relative",zIndex:4,flexDirection:"row",alignItems:"center",backgroundColor:C.surface,borderRadius:36,marginHorizontal:16,marginTop:2,marginBottom:14,paddingHorizontal:8,paddingVertical:8,borderWidth:1,borderColor:C.outline},tab:{flex:1,alignItems:"center",justifyContent:"center",alignSelf:"stretch",zIndex:1},pill:{width:54,height:54,borderRadius:27,alignItems:"center",justifyContent:"center"},liquidIndicator:{position:"absolute",top:8,width:54,height:54,borderRadius:27,backgroundColor:C.primary,zIndex:0},
 placeholder:{minHeight:420,alignItems:"center",justifyContent:"center",paddingHorizontal:24},bigIcon:{width:76,height:76,borderRadius:26,backgroundColor:C.surface2,alignItems:"center",justifyContent:"center",marginBottom:20},placeholderText:{color:C.muted,fontSize:14,textAlign:"center",lineHeight:21,marginTop:10},primaryButton:{marginTop:24,backgroundColor:C.primary,paddingHorizontal:22,paddingVertical:12,borderRadius:22},primaryText:{color:C.onPrimary,fontWeight:"700"}
});
