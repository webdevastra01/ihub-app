import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import QRCode from "react-native-qrcode-svg";
import { supabase } from "@/utils/supabase";

const { width, height } = Dimensions.get("window");

export default function RewardsScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const id = Array.isArray(userId) ? userId[0] : userId ?? "";

  const [menuOpen, setMenuOpen] = useState(false);
  const [rewards, setRewards] = useState<any[]>([]);
  const [selectedReward, setSelectedReward] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const slideAnim = useRef(new Animated.Value(-width * 0.7)).current;

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

  // === FETCH REWARDS FROM SUPABASE ===
  const fetchRewards = async (userId: any) => {
    try {
      setLoading(true);

      // 1️⃣ Fetch all rewards
      const { data: rewards, error: rewardsError } = await supabase
        .from("rewards")
        .select(
          "voucherCode, name, description, neededPoints, image, unused, used, perCustomer"
        );

      if (rewardsError) throw rewardsError;

      // 2️⃣ Fetch all voucherCodes the user already redeemed
      const { data: redeemed, error: redeemedError } = await supabase
        .from("transactions")
        .select("voucherCode")
        .eq("userId", userId)
        .not("voucherCode", "is", null);

      if (redeemedError) throw redeemedError;

      // 3️⃣ Build a quick lookup (Set for O(1) checks)
      const redeemedSet = new Set(redeemed.map((t) => t.voucherCode));

      // 4️⃣ Merge: add a flag "alreadyRedeemed" to each reward
      const mergedRewards = rewards.map((reward) => ({
        ...reward,
        alreadyRedeemed: redeemedSet.has(reward.voucherCode),
      }));

      setRewards(mergedRewards);
    } catch (err) {
      console.error("Error fetching rewards:", err);
      Alert.alert("Error", "Failed to load rewards. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards(id);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#f5efe0ff", "#d8cbc4ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* === MENU BUTTON === */}
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

            <TouchableOpacity style={[styles.menuItem, styles.activeItem]}>
              <Ionicons name="gift-outline" size={22} color="#fff" />
              <Text style={styles.activeText}>Rewards</Text>
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
        <Text style={styles.header}>Rewards</Text>

        {/* === LOADING INDICATOR === */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#f5630e"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={rewards}
            keyExtractor={(item) => item.voucherCode}
            numColumns={2}
            contentContainerStyle={styles.rewardsContainer}
            renderItem={({ item }) => {
              const isDisabled = item.perCustomer && item.alreadyRedeemed;

              return (
                <View style={styles.card}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <Text style={styles.points}>{item.neededPoints} pts</Text>

                    <TouchableOpacity
                      disabled={isDisabled}
                      style={[
                        styles.redeemButton,
                        isDisabled && { backgroundColor: "#ccc" },
                      ]}
                      onPress={() => setSelectedReward(item)}
                    >
                      <Text style={styles.redeemText}>
                        {isDisabled ? "Already Redeemed" : "Redeem"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        )}

        {/* === REDEEM MODAL === */}
        <Modal
          visible={!!selectedReward}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedReward(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.voucherCode}>
                {id}
              </Text>
              <Text style={styles.modalTitle}>{selectedReward?.name}</Text>
              <View style={{ alignItems: "center", marginVertical: 20 }}>
                <QRCode value={selectedReward?.voucherCode || ""} size={180} />
              </View>
              <Text style={styles.voucherCode}>
                Code: {selectedReward?.voucherCode}
              </Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedReward(null)}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    marginBottom: 20,
    textAlign: "center",
  },

  rewardsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    margin: 8,
    flex: 1,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    height: 120,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    width: "100%",
  },
  cardContent: {
  padding: 12,
  flex: 1,
  justifyContent: "space-between", // evenly distributes content
},

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f5630e",
    marginBottom: 4,
  },
  cardDesc: { fontSize: 13, color: "#555", marginBottom: 6 },
  points: { fontSize: 13, fontWeight: "600", color: "#333" },
  redeemButton: {
    backgroundColor: "#f5630e",
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 8,
  },
  redeemText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: width * 0.8,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#f5630e" },
  voucherCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#f5630e",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  closeText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
