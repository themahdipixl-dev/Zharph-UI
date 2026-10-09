import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, Pressable, Image, StyleSheet, StatusBar, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  ["Home", "view-dashboard-variant-outline"], ["Depth", "layers-triple-outline"],
  ["Add", "plus"], ["Saved", "bookmark-outline"], ["Settings", "cog-outline"]
];

export default function App() {
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
  const iconScales = useRef(tabs.reduce((acc, [name]) => { acc[name] = new Animated.Value(name === "Home" ? 1.12 : 1); return acc; }, {})).current;
  const [addPopupVisible, setAddPopupVisible] = useState(false);
  const [popupMounted, setPopupMounted] = useState(false);
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
  const [userImages, setUserImages] = useState([]);
  const addPhoto = async () => {
    setAddPopupVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: false, quality: 1 });
    if (!result.canceled && result.assets?.[0]?.uri) setUserImages(prev => [result.assets[0].uri, ...prev]);
  };
  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={s.root}>
        <View style={{flex:1}}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          <View style={s.header}>
            <Text style={s.brand}>Zharph<Text style={{color:C.primary}}>.</Text></Text>
          </View>
          {tab === "Home" || tab === "Add" ? <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>
              {["All","Depth","Parallax","Minimal"].map(x=><Pressable key={x} onPress={()=>setFilter(x)} style={[s.filter,filter===x&&s.filterOn]}><Text style={[s.filterText,filter===x&&{color:C.onPrimary}]}>{x}</Text></Pressable>)}
            </ScrollView>
            <View style={s.grid}>
              {userImages.map((uri,index)=><Pressable key={`user-${index}-${uri}`} style={s.card} onPress={()=>setTab("Editor")}><Image source={{uri}} style={s.photo}/></Pressable>)}
              {items.map(([title,uri])=><Pressable key={title} style={s.card} onPress={()=>setTab("Editor")}><Image source={{uri}} style={s.photo}/></Pressable>)}
            </View>
            </> : <View style={s.placeholder}><View style={s.bigIcon}><MaterialCommunityIcons name={tab==="Depth"?"layers-triple-outline":tab==="Saved"?"bookmark-outline":tab==="Settings"?"cog-outline":"image-outline"} size={34} color={C.primary}/></View><Text style={s.title}>{tab==="Editor"?"Wallpaper editor":tab}</Text><Text style={s.placeholderText}>{tab==="Depth"?"Choose a photo to start creating a depth wallpaper.":tab==="Saved"?"Your saved wallpapers will appear here.":tab==="Settings"?"Customize your Zharph experience.":"Preview your selected wallpaper."}</Text><Pressable style={s.primaryButton} onPress={()=>setTab("Home")}><Text style={s.primaryText}>Back to Home</Text></Pressable></View>}
        </ScrollView>
        </View>
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
          <Animated.View pointerEvents="none" style={[s.liquidIndicator, { left: indicatorLeft, transform: [{ translateX: liquidX }, { scaleX: liquidStretch }] }]} />
          {tabs.map(([name,icon])=>{const active=navTab===name;return <Pressable key={name} onPress={()=>{if(name==="Add"){setNavTab("Add");if(addPopupVisible){setAddPopupVisible(false);}else{setPopupMounted(true);setAddPopupVisible(true);}}else{setAddPopupVisible(false);setTab(name);setNavTab(name);}}} style={s.tab}><Animated.View style={[s.pill, { transform: [{ scale: iconScales[name] }] }]}><MaterialCommunityIcons name={active?({Home:"view-dashboard-variant",Depth:"layers-triple",Saved:"bookmark",Settings:"cog"}[name]||"plus") : icon} size={25} color={active?C.onPrimary:C.muted}/></Animated.View></Pressable>})}
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
