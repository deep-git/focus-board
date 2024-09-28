"use server";

import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

// Detect if a user with this email exists within the DB or not
const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                email,
            },
        });

        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Login with any social provider such as Github, Google, etc.
export const login = async (provider: string) => {
    await signIn(provider, { redirectTo: "/dashboard" });
    revalidatePath("/dashboard");
}

// Logout function used anywhere within the app
export const logout = async () => {
    await signOut({ redirectTo: "/" });
    revalidatePath("/");
}

export const loginWithCreds = async (formData: FormData) => {
    const rawFormData = {
        email: formData.get("email"),
        password: formData.get("password"),
        //role: "ADMIN",
        redirectTo: "/dashboard",
    };

    const existingUser = await getUserByEmail(formData.get("email") as string);

    console.log(existingUser);

    if (existingUser) {
        try {
            await signIn("credentials", rawFormData);

            revalidatePath("/dashboard");
        } catch (error: any) {
            if (error instanceof AuthError) {

                // Specify error
                switch (error.type) {
                    case "CredentialsSignin":
                        return { error: "Invalid credentials!" };
                    default:
                        return { error: "Something went wrong!" };
                }
            }

            throw error;
        }
    } else {
        return { error: "User does not exist" };
    }
}

export const registerWithCreds = async (formData: FormData) => {
    const rawFormData = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/dashboard",
    }

    const existingUser = await getUserByEmail(formData.get("email") as string);

    console.log(existingUser);

    if (existingUser) {
        return { error: "User already exists" };
    }

    try {
        await signIn("credentials", rawFormData);
    } catch (error: any) {
        if (error instanceof AuthError) {

            // Specify error
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" };
                default:
                    return { error: "Something went wrong!" };
            }
        }

        throw error;
    }

    revalidatePath("/dashboard");
}