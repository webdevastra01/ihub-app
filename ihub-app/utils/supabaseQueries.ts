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

    // 🧩 Format date properly
    const formattedBirthday = new Date(birthday).toISOString().split("T")[0];

    // 🧩 Hash the password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(secret)
      .digest("hex");

    // 🧩 Generate unique ID
    const userId = await generateUniqueUserId();

    // 🧩 Insert user
    const { data, error } = await supabase.from("users").insert([
      {
        userId: userId,
        firstname,
        surname,
        birthday: formattedBirthday,
        contactNumber: contactNumber,
        email,
        secret: hashedPassword,
        referralCode: referralCode || null,
      },
    ]);

    if (error) throw error;

    return { success: true, userId };
  } catch (err: any) {
    console.error("Error signing up:", err.message);
    return { success: false, error: err.message };
  }
}
