import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { saltAndHashPassword } from "./utils/helper";

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    providers: [
        Github({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                email: { label: "Email", type: "email", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error("Email and password are required.");
                }

                const username = credentials.username as string;
                const email = credentials.email as string;
                const password = credentials.password as string; // Use directly
                //const hash = saltAndHashPassword(password);

                try {
                    const user: any = await db.user.findUnique({
                        where: { email },
                    });

                    if (!user) {
                        const hash = await bcrypt.hash(password, 10);
                        // Create user if not found
                        const newUser = await db.user.create({
                            data: {
                                name: username,
                                email,
                                password: hash,
                            },
                        });

                        return newUser;
                    }

                    const isMatch = bcrypt.compare(password, user.password);
                    if (!isMatch) {
                        throw new Error("Incorrect password.");
                    }

                    return user;
                } catch (error) {
                    console.error("Authorization error:", error);
                    throw new Error("Authorization failed.");
                }
            }
        }),
    ],
    callbacks: {
        session: ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub
            },
        }),
    },
});