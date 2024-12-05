'use server'

import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  try {
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return { success: false, message: "Email is already registered." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      id: crypto.randomUUID(),
      email,
      name,
      passwordHash,
      emailVerified: null,
      image: null, 
    });
    
    return { success: true, message: "Account created successfully." };
  } catch (error) {
    console.error("Error during sign-up:", error);
    return { success: false, message: "An error occurred during sign-up." };
  }
}