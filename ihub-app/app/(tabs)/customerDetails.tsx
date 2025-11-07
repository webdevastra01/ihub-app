import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function QrScreen() {
  const router = useRouter();
  const userId = "784256";

  return (
    <LinearGradient
      colors={["#f5b70e", "#f5630e"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <View style={styles.card}>
        {/* ❌ X Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={26} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>iAccess</Text>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <QRCode value={userId} size={180} color="#333" backgroundColor="white" />
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
    position: "relative", // ✅ Needed for absolute positioning of the close button
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#eee",
    borderRadius: 20,
    padding: 4,
    zIndex: 10,
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
