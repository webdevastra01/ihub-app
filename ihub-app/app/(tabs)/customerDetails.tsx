import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg"; // 👈 make sure you install this: npm install react-native-qrcode-svg

export default function QrScreen() {
  const userId = "784256"; // You can replace this dynamically later

  return (
    <LinearGradient
      colors={["#f5b70e", "#f5630e"]} // Yellow → Orange gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <View style={styles.card}>
        <Text style={styles.title}>iHub Access</Text>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <QRCode
            value={userId} // The data encoded in QR
            size={180}
            color="#333"
            backgroundColor="white"
          />
        </View>

        {/* ID Number */}
        <Text style={styles.idText}>{userId}</Text>

        {/* Optional Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Refresh QR</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 16,
    elevation: 3,
  },
  idText: {
    fontSize: 18,
    color: "#444",
    fontWeight: "600",
    marginTop: 20,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#f5630e",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
