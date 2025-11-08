import * as SecureStore from "expo-secure-store";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { signInUser } from "@/utils/supabaseQueries";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const loadRememberedUser = async () => {
      const savedUser = await SecureStore.getItemAsync("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log("Auto-login as:", parsedUser.userId);
        router.replace({
          pathname: "/(tabs)",
          params: { userId: parsedUser.userId },
        });
      }
    };
    loadRememberedUser();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const { success, user, error } = await signInUser({
        email,
        secret: password,
      });

      if (success && user) {
        if (remember) {
          await SecureStore.setItemAsync("user", JSON.stringify(user));
        }

        router.replace({
          pathname: "/(tabs)",
          params: { userId: user.userId },
        });
      } else {
        alert(error || "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <LinearGradient
      colors={["#f5b70e", "#f5630e"]} // yellow → orange gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>HI! WELCOME TO</Text>
        <Image
          source={require("@/assets/images/ihub_logo.png")} // replace with your logo
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          style={styles.input}
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        <View style={styles.rememberContainer}>
          <Checkbox
            value={remember}
            onValueChange={setRemember}
            color={remember ? "#cc5200" : undefined}
          />
          <Text style={styles.rememberText}>Remember me</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don’t have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/accountCreation")}
          >
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 8,
  },
  formContainer: {
    width: "100%",
    padding: 20,
  },
  input: {
    backgroundColor: "#f7f7f7ff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#111",
    marginBottom: 16,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  rememberText: {
    marginLeft: 8,
    color: "#333",
  },
  button: {
    backgroundColor: "#cc5200",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#333",
  },
  signupLink: {
    color: "#6e3b00ff",
    fontWeight: "bold",
  },
});
