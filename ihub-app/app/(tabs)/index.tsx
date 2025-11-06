import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
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
      <Text style={styles.welcomeText}>Welcome, Sara!</Text>

      <View style={styles.container}>
        <ImageBackground
          source={require("@/assets/images/card_front.png")}
          style={styles.cardBackground}
          imageStyle={{ borderRadius: 16 }}
          resizeMode="cover"
        >
        </ImageBackground>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.pointsText}>Total iHub Points</Text>
        <Text style={styles.pointsValue}>200</Text>
      </View>

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
    color: "#313131ff",
    marginBottom: 30,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  cardBackground: {
    height: 220,
    width: 380,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  cardOverlay: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontStyle: "italic",
    color: "#fff",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#f2f2f2",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  pointsText: {
    fontSize: 18,
    color: "#313131ff",
    opacity: 0.9,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#313131ff",
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
