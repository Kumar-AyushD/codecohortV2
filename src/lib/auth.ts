import { db } from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { AuthOptions, DefaultSession, getServerSession } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  adapter: DrizzleAdapter(db) as Adapter,
  debug: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        console.log("Authorizing with credentials:", credentials);
      
        const { email, password } = credentials ?? {};
        if (!email || !password) {
          throw new Error("Email and password are required");
        }
      
        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, email),
        });
      
        if (!user) {
          throw new Error("No user found with this email.");
        }
      
        if (!user.passwordHash) {
          throw new Error(
            "This account does not have a password set. Please sign in using Google or set a password."
          );
        }
      
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }
      
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }      
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token }) {
      const dbUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, token.email!),
      });

      if (!dbUser) {
        throw new Error("no user with email found");
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return baseUrl + url;
      }
      return baseUrl+"/";
    },
    async session({ token, session }) {
      console.log(process.env.GOOGLE_CLIENT_ID);
      console.log("Session token:", token);
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name,
          email: token.email,
          image: token.picture,
        };
      }

      return session;
    },
  },
} satisfies AuthOptions;

export function getSession() {
  return getServerSession(authConfig);
}