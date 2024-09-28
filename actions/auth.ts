"use server";

import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import { AuthError } from "next-auth";
import { SignInResponse } from "next-auth/react";
import { revalidatePath } from "next/cache";

// Detect if a user with this email exists within the DB or not
const getUserByEmail = async (email: string) => {
    try {
        return await db.user.findUnique({ where: { email } });
    } catch (error) {
        console.error("Database error:", error);
        return null;
    }
};

// Login with any social provider such as Github, Google, etc.
export const login = async (provider: string) => {
    await signIn(provider, { redirectTo: "/dashboard" });
    revalidatePath("/dashboard");
};

// Logout function used anywhere within the app
export const logout = async () => {
    await signOut({ redirectTo: "/" });
    revalidatePath("/");
};

// Login with email and password
export const loginWithCreds = async (formData: FormData) => {
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!email || !password) {
        return { error: "Email and password are required." };
    }

    try {
        const response: SignInResponse = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (response?.error) {
            return { error: response.error };
        }

        revalidatePath("/dashboard");
        return {}; // Return success
    } catch (error: any) {
        console.error("Login error:", error);
        return { error: "Login failed. Please try again later." };
    }
};

// Register a new user
export const registerWithCreds = async (formData: FormData) => {
    const username = formData.get("username") as string | null;
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!username || !email || !password) {
        return { error: "All fields are required." };
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "User already exists" };
    }

    try {
        const response: SignInResponse = await signIn("credentials", {
            username,
            email,
            password,
            redirect: false,
        });

        if (response?.error) {
            return { error: response.error }; // Handle error case
        }

        revalidatePath("/dashboard");
        return {}; // Return success
    } catch (error: any) {
        if (error instanceof AuthError) {
            // Handle specific auth errors
            return { error: error.message || "Registration failed." };
        }
        console.error("Registration error:", error);
        return { error: "Something went wrong!" };
    }
};