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
      .select("userId, secret")
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
        userId: user.userId,
      },
    };
  } catch (err: any) {
    console.error("Error signing in:", err.message);
    return { success: false, error: err.message };
  }
}

export async function fetchCustomerDetails({ userId }: { userId: string }) {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("userId", userId)
      .maybeSingle();

    if (error) throw new Error(`Supabase error: ${error.message}`);
    if (!user) throw new Error("No account found for this user ID");

    return { success: true, user };
  } catch (err: any) {
    console.error("Error fetching customer details:", err.message);
    return { success: false, error: err.message };
  }
}

export async function fetchCustomerPoints({ userId }: { userId: string }) {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("points, transactionType")
      .eq("userId", userId);

    if (error) throw new Error(`Supabase error: ${error.message}`);
    if (!data || data.length === 0) throw new Error("No transactions found for this user ID");

    // 🧮 Calculate net points (convert to number safely)
    const totalPoints = data.reduce((sum, item) => {
      const pointsValue = Number(item.points) || 0; // ✅ convert string → number safely

      if (item.transactionType === "earn") {
        return sum + pointsValue;
      } else if (item.transactionType === "redeem") {
        return sum - pointsValue;
      }
      return sum;
    }, 0);

    return { success: true, points: totalPoints };
  } catch (err: any) {
    console.error("Error fetching customer points:", err.message);
    return { success: false, error: err.message };
  }
}


