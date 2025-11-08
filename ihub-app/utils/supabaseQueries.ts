import { supabase } from "./supabase";
import crypto from "react-native-quick-crypto";

// Generate a unique 6-digit ID
async function generateUniqueUserId(): Promise<string> {
  let unique = false;
  let userId = "";

  while (!unique) {
    userId = Math.floor(100000 + Math.random() * 900000).toString();

    const { data } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (!data) unique = true;
  }

  return userId;
}

export async function signUpUser({
  firstname,
  surname,
  birthday,
  contactNumber,
  email,
  secret,
  referralCode,
}: {
  firstname: string;
  surname: string;
  birthday: string;
  contactNumber: string;
  email: string;
  secret: string;
  referralCode?: string;
}) {
  try {
    // 🧩 Ensure password is valid
    if (typeof secret !== "string" || !secret.trim()) {
      throw new Error("Invalid password format");
    }

    // 🧩 Hash the password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(secret)
      .digest("hex");

    // 🧩 Generate unique ID
    const userId = await generateUniqueUserId();

    // 🧩 Set membership dates
    const memberSince = new Date();
    const memberUntil = new Date();
    memberUntil.setFullYear(memberUntil.getFullYear() + 1);

    // 🧩 Insert user
    const { error } = await supabase.from("users").insert([
      {
        userId: userId,
        firstname,
        surname,
        birthday,
        contactNumber: contactNumber,
        email,
        secret: hashedPassword,
        referralCode: referralCode || null,
        memberSince,
        memberUntil: memberUntil,
      },
    ]);

    if (error) throw error;

    return { success: true, userId };
  } catch (err: any) {
    console.error("Error signing up:", err.message);
    return { success: false, error: err.message };
  }
}

export async function signInUser({
  email,
  secret,
}: {
  email: string;
  secret: string;
}) {
  try {
    // 🧩 Validate inputs
    if (!email || !secret) {
      throw new Error("Email and password are required");
    }

    // 🧩 Hash the entered password to compare with stored hash
    const hashedPassword = crypto
      .createHash("sha256")
      .update(secret)
      .digest("hex");

    // 🧩 Look up the user by email
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    if (!user) throw new Error("No account found for this email");

    // 🧩 Compare passwords
    if (user.secret !== hashedPassword) {
      throw new Error("Incorrect password");
    }

    // 🧩 Return success with user info
    return {
      success: true,
      user: {
        userId: user.id,
        firstname: user.firstname,
        surname: user.surname,
        email: user.email,
        memberSince: user.memberSince,
        memberUntil: user.memberUntil,
      },
    };
  } catch (err: any) {
    console.error("Error signing in:", err.message);
    return { success: false, error: err.message };
  }
}
