import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, Pressable, Image, StyleSheet, StatusBar, Animated, Easing } from "react-native";

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
  const [navTab, setNavTab] = useState("Home");
  const [barWidth, setBarWidth] = useState(0);
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
  const [previousNavTab, setPreviousNavTab] = useState("Home");
  const [popupMounted, setPopupMounted] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const popupProgress = useRef(new Animated.Value(0)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;

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
  const renderPage = (pageTab, pointerEvents = "auto") => (
    <ScrollView pointerEvents={pointerEvents} showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} style={{ width: stageSize.width || "100%", height: stageSize.height || "100%" }}>
      <View style={s.header}>
        <Text style={s.brand}>Zharph<Text style={{color:C.primary}}>.</Text></Text>
        {(pageTab === "Home" || pageTab === "Add") && <Pressable accessibilityRole="button" accessibilityLabel={gridColumns === 2 ? "Switch to three-column grid" : "Switch to two-column grid"} onPress={() => setGridColumns(columns => columns === 2 ? 3 : 2)} style={s.layoutButton}>
          <GoogleSymbol name={gridColumns === 2 ? "grid_view" : "view_module"} size={23} color={C.text} />
        </Pressable>}
      </View>
      {pageTab === "Home" || pageTab === "Add" ? <>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>
          {["All","Depth","Parallax","Minimal"].map(x=><Pressable key={x} onPress={()=>setFilter(x)} style={[s.filter,filter===x&&s.filterOn]}><Text style={[s.filterText,filter===x&&{color:C.onPrimary}]}>{x}</Text></Pressable>)}
        </ScrollView>
        <View style={[s.grid, gridColumns === 2 && s.gridTwoColumns]}>
          {userImages.map((uri,index)=><Pressable key={`user-${index}-${uri}`} style={[s.card, gridColumns === 2 && s.cardTwoColumns]} onPress={()=>setTab("Editor")}><Image source={{uri}} style={s.photo}/></Pressable>)}
          {items.map(([title,uri])=><Pressable key={title} style={s.card} onPress={()=>setTab("Editor")}><Image source={{uri}} style={s.photo}/></Pressable>)}
        </View>
      </> : <View style={s.placeholder}><View style={s.bigIcon}><GoogleSymbol name={pageTab==="Depth"?"layers":pageTab==="Saved"?"bookmark":pageTab==="Settings"?"settings":"image"} size={34} color={C.primary}/></View><Text style={s.title}>{pageTab==="Editor"?"Wallpaper editor":pageTab}</Text><Text style={s.placeholderText}>{pageTab==="Depth"?"Choose a photo to start creating a depth wallpaper.":pageTab==="Saved"?"Your saved wallpapers will appear here.":pageTab==="Settings"?"Customize your Zharph experience.":"Preview your selected wallpaper."}</Text><Pressable style={s.primaryButton} onPress={()=>setTab("Home")}><Text style={s.primaryText}>Back to Home</Text></Pressable></View>}
    </ScrollView>
  );
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
      <View style={s.root}>
        <View style={{ flex: 1, backgroundColor: C.bg }}>
          <View style={{flex:1, overflow:"hidden", backgroundColor:C.bg}}>
            {renderPage(tab)}
          </View>
        </View>
        <View style={s.bar} onLayout={event => setBarWidth(event.nativeEvent.layout.width)}>
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
        </View>
        {popupMounted && <>
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
 header:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:20},brand:{color:C.text,fontSize:30,fontWeight:"800",letterSpacing:-1.2},layoutButton:{width:42,height:42,borderRadius:21,alignItems:"center",justifyContent:"center",backgroundColor:C.surface,borderWidth:1,borderColor:C.outline},
 title:{color:C.text,fontSize:21,fontWeight:"700",letterSpacing:-.4},
 filters:{gap:8,paddingBottom:18},filter:{borderRadius:18,paddingHorizontal:17,paddingVertical:9,backgroundColor:C.surface,borderWidth:1,borderColor:C.outline},filterOn:{backgroundColor:C.primary,borderColor:C.primary},filterText:{color:C.muted,fontSize:12,fontWeight:"600"},
 grid:{flexDirection:"row",flexWrap:"wrap",justifyContent:"flex-start",columnGap:"3.8%",rowGap:14},gridTwoColumns:{columnGap:"4%"},card:{width:"30.8%",marginBottom:2},cardTwoColumns:{width:"48%"},photo:{width:"100%",aspectRatio:0.5,borderRadius:16,backgroundColor:C.surface2},
popupDismiss:{...StyleSheet.absoluteFillObject,zIndex:3,overflow:"hidden"},addPopup:{position:"absolute",alignSelf:"center",bottom:92,zIndex:5,alignItems:"center",justifyContent:"center",backgroundColor:C.primary,borderRadius:22,paddingHorizontal:20,paddingVertical:14,elevation:8,shadowColor:"#000",shadowOpacity:0.25,shadowRadius:12,shadowOffset:{width:0,height:5}},addPopupAction:{justifyContent:"center",alignItems:"center"},addPopupText:{color:C.onPrimary,fontSize:14,fontWeight:"700"},bar:{position:"absolute",left:16,right:16,bottom:8,zIndex:4,flexDirection:"row",alignItems:"center",backgroundColor:C.surface,borderRadius:36,paddingHorizontal:8,paddingVertical:8,borderWidth:1,borderColor:C.outline},tab:{flex:1,alignItems:"center",justifyContent:"center",alignSelf:"stretch",zIndex:1},pill:{width:54,height:54,borderRadius:27,alignItems:"center",justifyContent:"center"},liquidIndicator:{position:"absolute",top:8,width:54,height:54,borderRadius:27,backgroundColor:C.primary,zIndex:0},
 placeholder:{minHeight:420,alignItems:"center",justifyContent:"center",paddingHorizontal:24},bigIcon:{width:76,height:76,borderRadius:26,backgroundColor:C.surface2,alignItems:"center",justifyContent:"center",marginBottom:20},placeholderText:{color:C.muted,fontSize:14,textAlign:"center",lineHeight:21,marginTop:10},primaryButton:{marginTop:24,backgroundColor:C.primary,paddingHorizontal:22,paddingVertical:12,borderRadius:22},primaryText:{color:C.onPrimary,fontWeight:"700"}
});
