import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const handleFlip = () => {
    if (flipped) {
      Animated.spring(flipAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 10,
      }).start();
      setFlipped(false);
    } else {
      Animated.spring(flipAnim, {
        toValue: 180,
        useNativeDriver: true,
        friction: 8,
        tension: 10,
      }).start();
      setFlipped(true);
    }
  };

  const handleClaimPoints = () => {
    Alert.alert(
      "Points Claimed!",
      "You’ve successfully claimed your iHub points 🎉"
    );
  };

  return (
    <LinearGradient
      colors={["#f5efe0ff", "#d8cbc4ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <Text style={styles.welcomeText}>Welcome, Sarah!</Text>

      {/* Card Section */}
      <TouchableOpacity onPress={handleFlip} activeOpacity={0.9}>
        <View style={styles.container}>
          {/* FRONT SIDE */}
          <Animated.View
            style={[
              styles.card,
              { transform: [{ rotateY: frontInterpolate }] },
            ]}
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

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.pointsText}>Total iAccess Points</Text>
        <Text style={styles.pointsValue}>200</Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/customerDetails")}>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  cardBack: {
    transform: [{ rotateY: "180deg" }],
  },
  cardBackground: {
    flex: 1,
    borderRadius: 16,
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
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  button: {
    backgroundColor: "#f5630e",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  cardContent: {
  flex: 1,
  justifyContent: "flex-end",
  alignItems: "flex-start",
  padding: 20,
  borderRadius: 16,
  width: "100%",
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
