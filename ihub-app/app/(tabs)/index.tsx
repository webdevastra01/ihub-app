import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [flipped, setFlipped] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-width * 0.6)).current; // sidebar starts hidden

  // === CARD FLIP ===
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
      friction: 8,
      tension: 10,
    }).start();
    setFlipped(!flipped);
  };

  // === SIDEBAR SLIDE ===
  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? -width * 0.6 : 0,
      duration: 300,
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

          {/* Home */}
          <TouchableOpacity style={[styles.menuItem, styles.activeItem]}>
            <Ionicons name="home" size={22} color="#fff" />
            <Text style={styles.activeText}>Home</Text>
          </TouchableOpacity>

          {/* QR Page */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              router.push("/(tabs)/customerDetails");
            }}
          >
            <Ionicons name="qr-code" size={22} color="#333" />
            <Text style={styles.menuText}>My QR</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#f5630e" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* === MAIN CONTENT === */}
      <Text style={styles.welcomeText}>Welcome, Sarah!</Text>

      <TouchableOpacity onPress={handleFlip} activeOpacity={0.9}>
        <View style={styles.container}>
          {/* FRONT SIDE */}
          <Animated.View
            style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}
          >
            <ImageBackground
              source={require("@/assets/images/card_front.png")}
              style={styles.cardBackground}
              imageStyle={{ borderRadius: 16 }}
            />
          </Animated.View>

          {/* BACK SIDE */}
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
                {/* Name + ID */}
                <View style={styles.row}>
                  <View>
                    <Text style={styles.cardTitle}>SARAH MAY BANGAHON</Text>
                    <Text style={styles.cardSubtitle}>784256</Text>
                  </View>
                </View>

                {/* Member Since + Valid Thru */}
                <View style={[styles.row, { marginTop: 10 }]}>
                  <View style={styles.infoBlock}>
                    <Text style={styles.cardSmallLabel}>MEMBER SINCE</Text>
                    <Text style={styles.cardSubtitle}>11/25</Text>
                  </View>
                  <View style={styles.infoBlock}>
                    <Text style={styles.cardSmallLabel}>VALID THRU</Text>
                    <Text style={styles.cardSubtitle}>11/26</Text>
                  </View>
                </View>

                {/* Terms and Info */}
                <View style={[styles.termsContainer, { marginTop: 16 }]}>
                  <Text style={styles.cardSmallText}>
                    By using this virtual card, you agree to the iHub Access
                    Pass terms of use and privacy policy.
                  </Text>
                  <Text style={styles.cardSmallText}>
                    You may call iHub +639855713768 for more details.
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

      {/* Points Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.pointsText}>Total iAccess Points</Text>
        <Text style={styles.pointsValue}>200</Text>
      </View>

      {/* Claim Points */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/customerDetails")}
      >
        <Text style={styles.buttonText}>Claim Points</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
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
    zIndex: 5,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.6,
    backgroundColor: "#fff",
    paddingVertical: 60,
    paddingHorizontal: 20,
    zIndex: 6,
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
  menuText: {
    fontSize: 18,
    color: "#333",
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
  welcomeText: {
    fontSize: 26,
    fontWeight: "500",
    color: "#313131",
    marginBottom: 30,
  },
  container: {
    width: 380,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  card: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backfaceVisibility: "hidden",
    elevation: 6,
  },
  cardBack: {
    transform: [{ rotateY: "180deg" }],
  },
  cardBackground: {
    flex: 1,
    borderRadius: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    padding: 20,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  pointsText: {
    fontSize: 18,
    color: "#313131",
    opacity: 0.9,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#313131",
  },
  button: {
    backgroundColor: "#f5630e",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  infoBlock: {
    flex: 1,
    marginRight: 20,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#f5f5f5",
  },

  cardSmallLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#ddd",
    marginBottom: 2,
  },

  cardSmallText: {
    fontSize: 6,
    color: "#eaeaea",
    marginBottom: 4,
    lineHeight: 8,
    width: "95%",
  },

  termsContainer: {
    marginTop: 10,
    width: "100%",
  },
});
