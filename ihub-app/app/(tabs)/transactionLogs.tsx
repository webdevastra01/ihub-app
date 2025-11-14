import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchTransactions } from "@/utils/supabaseQueries";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");

type TransactionType = "earn" | "redeem";

type Transaction = {
  id: string;
  description: string;
  created_at: string;
  points: string;
  transactionType: TransactionType;
};

export default function TransactionHistoryScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const id = Array.isArray(userId) ? userId[0] : userId ?? "";

  const [menuOpen, setMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Delete stored user data
            await SecureStore.deleteItemAsync("user");
            console.log("User data cleared from SecureStore");

            // Then redirect to login
            router.replace("/authenticate");
          } catch (error) {
            console.error("Error clearing SecureStore:", error);
          }
        },
      },
    ]);
  };

  const loadTransactions = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      if (!id) throw new Error("User not logged in");

      const result = await fetchTransactions(id);
      if (!result.success) throw new Error(result.error);
      setTransactions(result.data ?? []);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to load transactions.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadTransactions(false);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.cardLeft}>
        <Ionicons
          name={item.transactionType === "earn" ? "add-circle" : "gift-outline"}
          size={28}
          color={item.transactionType === "earn" ? "#4CAF50" : "#f5630e"}
        />
      </View>

      <View style={styles.cardMiddle}>
        <Text style={styles.transactionTitle}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.created_at}</Text>
      </View>

      <View style={styles.cardRight}>
        <Text
          style={[
            styles.transactionPoints,
            { color: item.transactionType === "earn" ? "#4CAF50" : "#f5630e" },
          ]}
        >
          {Number(item.points).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  // === LOADING STATE ===
  if (loading) {
    return (
      <LinearGradient
        colors={["#f5efe0ff", "#d8cbc4ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fullScreenCenter}
      >
        <ActivityIndicator size="large" color="#f5630e" />
        <Text style={{ color: "#333", fontSize: 18, marginTop: 10 }}>
          Loading...
        </Text>
      </LinearGradient>
    );
  }

  // === MAIN CONTENT ===
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

            <TouchableOpacity style={[styles.menuItem, styles.activeItem]}>
              <Ionicons name="receipt-outline" size={22} color="#fff" />
              <Text style={styles.activeText}>Transactions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                router.push({
                  pathname: "/(tabs)/perks",
                  params: { userId },
                });
              }}
            >
              <Ionicons name="sparkles-sharp" size={22} color="#333" />
              <Text style={styles.menuText}>Perks</Text>
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
        <Text style={styles.header}>Transaction History</Text>

        {/* === TRANSACTIONS === */}
        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>No transactions found.</Text>
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#f5630e"]}
                tintColor="#f5630e"
              />
            }
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5efe0ff" },
  gradientBackground: { flex: 1, width, height },
  fullScreenCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height,
    width,
  },
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
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
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
  cardLeft: { marginRight: 16 },
  cardMiddle: { flex: 1 },
  cardRight: { alignItems: "flex-end" },
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
  emptyText: {
    textAlign: "center",
    color: "#555",
    marginTop: 40,
    fontSize: 16,
  },
});
