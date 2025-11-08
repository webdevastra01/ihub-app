import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  useRouter,
  useLocalSearchParams,
  useRootNavigationState,
} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchCustomerDetails,
  fetchCustomerPoints,
} from "@/utils/supabaseQueries";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");

type CustomerDetails = {
  success: boolean;
  user?: any;
  error?: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { userId } = useLocalSearchParams();

  const [flipped, setFlipped] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<CustomerDetails | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-width * 0.7)).current;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const handleFlip = () => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 180,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? -width * 0.7 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setMenuOpen(!menuOpen);
  };

  const loadUserData = async () => {
    // If no userId, we must stop loading and redirect
    if (!userId) {
      setLoading(false);
      return;
    }

    const id = Array.isArray(userId) ? userId[0] : userId;
    try {
      setRefreshing(true);
      const result = await fetchCustomerDetails({ userId: id });
      setUserInfo(result);

      const pointsResult = await fetchCustomerPoints({ userId: id });
      if (pointsResult.success) {
        setTotalPoints(pointsResult.points ?? 0);
      } else {
        console.error("Error loading points:", pointsResult.error);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // Running loadUserData once when navigation is ready or userId changes
  useEffect(() => {
    if (!rootNavigationState?.key) return; // wait until layout is ready
    loadUserData();
  }, [userId, rootNavigationState?.key]);

  // Redirect effect
  useEffect(() => {
    if (!loading && !userId) {
      router.replace("/authenticate");
    }
  }, [loading, userId]);

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

  if (!userId) {
    // navigation will happen via effect
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#f5efe0ff", "#d8cbc4ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadUserData}
              colors={["#f5630e"]}
              tintColor="#f5630e"
            />
          }
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

              <TouchableOpacity style={[styles.menuItem, styles.activeItem]}>
                <Ionicons name="home" size={22} color="#fff" />
                <Text style={styles.activeText}>Home</Text>
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

          {/* === CONTENT === */}
          <Text style={styles.welcomeText}>
            Welcome, {userInfo?.user?.firstname || "User"}!
          </Text>

          {/* === FLIPPABLE CARD === */}
          <TouchableOpacity onPress={handleFlip} activeOpacity={0.9}>
            <View style={styles.cardContainer}>
              <Animated.View
                style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}
              >
                <ImageBackground
                  source={require("@/assets/images/card_front.png")}
                  style={styles.cardBackground}
                  imageStyle={{ borderRadius: 16 }}
                />
              </Animated.View>

              <Animated.View
                style={[
                  styles.card,
                  styles.cardBack,
                  { transform: [{ rotateY: backInterpolate }] },
                ]}
              >
                <ImageBackground
                  source={require("@/assets/images/card_back.png")}
                  style={styles.cardBackground}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>
                      {`${userInfo?.user?.firstname?.toUpperCase() || ""} ${
                        userInfo?.user?.surname?.toUpperCase() || ""
                      }`}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                      {userInfo?.user?.userId}
                    </Text>
                    <View style={[styles.row, { marginTop: 10 }]}>
                      <View style={styles.infoBlock}>
                        <Text style={styles.cardSmallLabel}>MEMBER SINCE</Text>
                        <Text style={styles.cardSubtitle}>
                          {userInfo?.user?.memberSince}
                        </Text>
                      </View>
                      <View style={styles.infoBlock}>
                        <Text style={styles.cardSmallLabel}>VALID THRU</Text>
                        <Text style={styles.cardSubtitle}>
                          {userInfo?.user?.memberUntil}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.termsContainer}>
                      <Text style={styles.cardSmallText}>
                        By using this virtual card, you agree to the iHub Access
                        Pass terms of use and privacy policy.
                      </Text>
                      <Text style={styles.cardSmallText}>
                        Call iHub +639855713768 for more details.
                      </Text>
                      <Text style={styles.cardSmallText}>
                        This card is non-transferable.
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </Animated.View>
            </View>
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Text style={styles.pointsText}>Total iAccess Points</Text>
            <Text style={styles.pointsValue}>{totalPoints}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/customerDetails",
                params: { userId },
              })
            }
          >
            <Text style={styles.buttonText}>Claim Points</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5efe0ff" },
  gradientBackground: { flex: 1, width, height },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 60,
    paddingTop: 100,
    width: "100%",
  },
  fullScreenCenter: {
    flex: 1,
    height,
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton: { position: "absolute", top: 10, left: 20, zIndex: 10, padding: 8 },
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
  welcomeText: {
    fontSize: 26,
    fontWeight: "600",
    color: "#313131",
    marginBottom: 30,
    marginTop: 90,
  },
  cardContainer: {
    width: width * 0.9,
    height: height * 0.25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  card: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backfaceVisibility: "hidden",
  },
  cardBack: { transform: [{ rotateY: "180deg" }] },
  cardBackground: { flex: 1 },
  cardContent: { flex: 1, justifyContent: "flex-end", padding: 20 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  cardSubtitle: { fontSize: 14, color: "#f5f5f5" },
  infoContainer: { alignItems: "center", marginBottom: 20 },
  pointsText: { fontSize: 18, color: "#313131", opacity: 0.9 },
  pointsValue: { fontSize: 38, fontWeight: "bold", color: "#313131" },
  button: {
    backgroundColor: "#f5630e",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  infoBlock: { flex: 1, marginRight: 20 },
  cardSmallLabel: { fontSize: 10, fontWeight: "600", color: "#ddd" },
  cardSmallText: {
    fontSize: 7,
    color: "#eaeaea",
    marginBottom: 3,
    lineHeight: 10,
  },
  termsContainer: { marginTop: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
});
