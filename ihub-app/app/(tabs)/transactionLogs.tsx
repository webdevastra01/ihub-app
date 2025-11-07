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
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// === TYPES ===
type TransactionType = "earn" | "redeem";

type Transaction = {
  id: string;
  title: string;
  date: string;
  points: string;
  type: TransactionType;
};

// === SAMPLE DATA ===
const transactions: Transaction[] = [
  { id: "1", title: "Purchased Latte", date: "Nov 3, 2025", points: "-50", type: "redeem" },
  { id: "2", title: "Referral Bonus", date: "Nov 1, 2025", points: "+200", type: "earn" },
  { id: "3", title: "Promo Reward", date: "Oct 28, 2025", points: "+100", type: "earn" },
  { id: "4", title: "Event Raffle", date: "Oct 21, 2025", points: "+300", type: "earn" },
];

export default function TransactionHistoryScreen() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.6)).current;

  // === SIDEBAR ANIMATION ===
  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? -width * 0.6 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/authenticate"),
      },
    ]);
  };

  // === RENDER TRANSACTION ITEM ===
  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.cardLeft}>
        <Ionicons
          name={item.type === "earn" ? "add-circle" : "gift-outline"}
          size={28}
          color={item.type === "earn" ? "#4CAF50" : "#f5630e"}
        />
      </View>

      <View style={styles.cardMiddle}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>

      <View style={styles.cardRight}>
        <Text
          style={[
            styles.transactionPoints,
            { color: item.type === "earn" ? "#4CAF50" : "#f5630e" },
          ]}
        >
          {item.points}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#f5efe0ff", "#d8cbc4ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      {/* === HAMBURGER BUTTON === */}
      {!menuOpen && (
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
      )}

      {/* === OVERLAY + SIDEBAR === */}
      {menuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
            <View style={styles.sidebarContent}>
              <Text style={styles.sidebarTitle}>Menu</Text>

              {/* Home */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  toggleMenu();
                  router.push("/(tabs)");
                }}
              >
                <Ionicons name="home" size={22} color="#333" />
                <Text style={styles.menuText}>Home</Text>
              </TouchableOpacity>

              {/* Active Page */}
              <TouchableOpacity style={[styles.menuItem, styles.activeItem]}>
                <Ionicons name="receipt-outline" size={22} color="#fff" />
                <Text style={styles.activeText}>Transactions</Text>
              </TouchableOpacity>

              <View style={{ flex: 1 }} />

              {/* Logout */}
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={22} color="#f5630e" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      )}

      {/* === MAIN CONTENT === */}
      <Text style={styles.header}>Transaction History</Text>

      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  menuButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 9,
    flexDirection: "row",
  },
  sidebar: {
    width: width * 0.6,
    backgroundColor: "#fff",
    paddingVertical: 60,
    paddingHorizontal: 20,
    elevation: 10,
  },
  sidebarContent: {
    flex: 1,
    marginTop: 40,
  },
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
  activeText: {
    fontSize: 18,
    color: "#fff",
  },
  menuText: {
    fontSize: 18,
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 30,
  },
  logoutText: {
    fontSize: 16,
    color: "#f5630e",
    fontWeight: "600",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLeft: {
    marginRight: 16,
  },
  cardMiddle: {
    flex: 1,
  },
  cardRight: {
    alignItems: "flex-end",
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  transactionDate: {
    fontSize: 12,
    color: "#888",
  },
  transactionPoints: {
    fontSize: 18,
    fontWeight: "700",
  },
});
