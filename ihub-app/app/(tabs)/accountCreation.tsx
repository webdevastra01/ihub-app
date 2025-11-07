import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { signUpUser } from "@/utils/supabaseQueries";

export default function SignUpScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstname: "",
    surname: "",
    birthday: "",
    contact: "",
    email: "",
    password: "",
    referral: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSignUp = async () => {
    // Basic input validation
    if (
      !form.firstname ||
      !form.surname ||
      !form.birthday ||
      !form.contact ||
      !form.email ||
      !form.password
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log("Signing up with:", form);

    try {
      // Call Supabase signup query
      const { success, error, userId } = await signUpUser({
        firstname: form.firstname,
        surname: form.surname,
        birthday: form.birthday,
        contactNumber: form.contact,
        email: form.email,
        secret: form.password,
        referralCode: form.referral,
      });

      if (success) {
        router.replace("/(tabs)/authenticate");
      } else {
        alert(`Signup failed: ${error}`);
      }
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleDateChange = (_: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      handleChange("birthday", date.toISOString());
    }
  };

  return (
    <LinearGradient
      colors={["#f5b70e", "#f5630e"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/ihub_logo2.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Create an Account</Text>

            <TextInput
              placeholder="First Name"
              placeholderTextColor="#777"
              style={styles.input}
              value={form.firstname}
              onChangeText={(t) => handleChange("firstname", t)}
            />

            <TextInput
              placeholder="Surname"
              placeholderTextColor="#777"
              style={styles.input}
              value={form.surname}
              onChangeText={(t) => handleChange("surname", t)}
            />

            {/* 🎂 Birthday Picker */}
            <Pressable onPress={() => setShowDatePicker(true)}>
              <View pointerEvents="none">
                <TextInput
                  placeholder="Birthday"
                  placeholderTextColor="#777"
                  style={styles.input}
                  value={
                    selectedDate
                      ? selectedDate.toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : ""
                  }
                  editable={false}
                />
              </View>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate || new Date(2000, 0, 1)}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    setSelectedDate(date);
                    handleChange("birthday", date.toISOString()); // store ISO string for DB
                  }
                }}
              />
            )}

            <TextInput
              placeholder="Contact Number"
              placeholderTextColor="#777"
              style={styles.input}
              value={form.contact}
              onChangeText={(t) => handleChange("contact", t)}
              keyboardType="phone-pad"
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor="#777"
              style={styles.input}
              value={form.email}
              onChangeText={(t) => handleChange("email", t)}
              keyboardType="email-address"
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#777"
              style={styles.input}
              value={form.password}
              onChangeText={(t) => handleChange("password", t)}
              secureTextEntry
            />
            <TextInput
              placeholder="Referral Code (optional)"
              placeholderTextColor="#777"
              style={styles.input}
              value={form.referral}
              onChangeText={(t) => handleChange("referral", t)}
              autoCapitalize="characters"
              maxLength={10}
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.signupLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 180,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#cc5200",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
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
    color: "#555",
  },
  signupLink: {
    color: "#f5630e",
    fontWeight: "bold",
  },
});
