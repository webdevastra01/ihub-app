import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");

export default function PerksScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const id = Array.isArray(userId) ? userId[0] : userId ?? "";

  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.7)).current;

  // === SIDEBAR TOGGLE ===
  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? -width * 0.7 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setMenuOpen(!menuOpen);
  };

  // === LOGOUT HANDLER ===
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync("user");
            router.replace("/authenticate");
          } catch (error) {
            console.error("Error clearing SecureStore:", error);
          }
        },
      },
    ]);
  };

  // === PERKS DATA ===
  const perksData = [
    {
      title: "General Benefits",
      perks: [
        "Earn 20 iAccess points per visit.",
        "5% birthday discount.",
        "Redeem points starting at 300 iAccess points.",
        "50 iAccess points per referral.",
      ],
    },
    {
      title: "iEAT Zone Benefits",
      perks: [
        "Earn 20 iAccess points per ₱500 spent",
        "5% birthday discount",
      ],
    },
    {
      title: "iDRINK Zone Benefits",
      perks: [
        "Buy 7 drinks, get 1 free (Milk Tea or Coffee)",
        "Free water refill access",
      ],
    },
    {
      title: "iPLAY Zone Benefits",
      perks: ["10% off darts & billiards"],
    },
    {
      title: "iLOUNGE Zone Benefits",
      perks: ["Free lounge access with any order", "Member Wi-Fi zone"],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#f5efe0ff", "#d8cbc4ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* === HAMBURGER === */}
        {!menuOpen && (
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Ionicons name="menu" size={30} color="#333" />
          </TouchableOpacity>
        )}

        {/* === OVERLAY === */}
        {menuOpen && (
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={toggleMenu}
          />
        )}

        {/* === SIDEBAR === */}
        <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
          <View style={styles.sidebarContent}>
            <Text style={styles.sidebarTitle}>Menu</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                router.push({ pathname: "/(tabs)", params: { userId } });
              }}
            >
              <Ionicons name="home" size={22} color="#333" />
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                router.push({
                  pathname: "/(tabs)/transactionLogs",
                  params: { userId },
                });
              }}
            >
              <Ionicons name="receipt-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Transactions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.activeItem]}>
              <Ionicons name="sparkles-sharp" size={22} color="#fff" />
              <Text style={styles.activeText}>Perks</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                router.push({
                  pathname: "/(tabs)/rewards",
                  params: { userId },
                });
              }}
            >
              <Ionicons name="gift-outline" size={22} color="#333" />
              <Text style={styles.menuText}>Rewards</Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={22} color="#f5630e" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* === HEADER === */}
        <Text style={styles.header}>List of Perks</Text>

        {/* === PERKS LIST === */}
        <FlatList
          data={perksData}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.perksContainer}
          renderItem={({ item }) => (
            <View style={styles.perkCard}>
              <Text style={styles.perkTitle}>{item.title}</Text>
              {item.perks.map((perk, i) => (
                <View key={i} style={styles.perkItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#f5630e" />
                  <Text style={styles.perkText}>{perk}</Text>
                </View>
              ))}
            </View>
          )}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5efe0ff" },
  gradientBackground: { flex: 1, width, height },
  menuButton: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 5,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.7,
    backgroundColor: "#fff",
    paddingVertical: 60,
    paddingHorizontal: 20,
    zIndex: 6,
    elevation: 10,
  },
  sidebarContent: { flex: 1 },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 30,
    color: "#f5630e",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  activeItem: {
    backgroundColor: "#f5630e",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  activeText: { fontSize: 18, color: "#fff" },
  menuText: { fontSize: 18, color: "#333" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 30,
  },
  logoutText: { fontSize: 16, color: "#f5630e", fontWeight: "600" },
  header: {
    fontSize: 26,
    fontWeight: "600",
    color: "#313131",
    marginTop: 15,
    marginBottom: 30,
    textAlign: "center",
  },
  perksContainer: { paddingHorizontal: 20, paddingBottom: 60 },
  perkCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  perkTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f5630e",
    marginBottom: 10,
  },
  perkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  perkText: { fontSize: 15, color: "#333", flexShrink: 1 },
});
