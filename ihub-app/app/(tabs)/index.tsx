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

export default function HomeScreen() {
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
    Alert.alert("Points Claimed!", "You’ve successfully claimed your iHub points 🎉");
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
            />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.pointsText}>Total iHub Points</Text>
        <Text style={styles.pointsValue}>200</Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleClaimPoints}>
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
});
