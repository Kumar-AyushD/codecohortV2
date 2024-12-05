"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/db/schema";
import { editUserAction } from "./action";
import bcrypt from "bcryptjs";

const formSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  email: z.string().email().min(1).max(100),
  emailVerified: z.date().optional(),
  image: z.string().url().optional(),
  password: z.string().min(6).max(50).optional(), // Optional password field
});

export function EditUserForm({ user }: { user: User }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email,
      emailVerified: user.emailVerified ? new Date(user.emailVerified) : undefined,
      image: user.image ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedValues = { 
      id: user.id,
      ...values,
    };

    if (values.password) {
      const hashedPassword = await bcrypt.hash(values.password, 10);
      updatedValues.password = hashedPassword;
    }

    await editUserAction(updatedValues);
    
    toast({
      title: "Profile Updated",
      description: "Your profile was successfully updated",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col mx-auto w-[50%] p-5 rounded-xl border-2 border-gray-600">
        <h1 className="text-4xl font-bold">Edit Profile</h1>
        
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="John Doe" />
            </FormControl>
            <FormDescription>This is your display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="johndoe@example.com" />
            </FormControl>
            <FormDescription>This is your contact email.</FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="image" render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Image URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://example.com/image.jpg" />
            </FormControl>
            <FormDescription>URL to your profile picture.</FormDescription>
            <FormMessage />
          </FormItem>
        )} />

          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="********" />
              </FormControl>
              <FormDescription>Enter a new password if you&apos;d like to change it.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />


        <Button type="submit" className="w-[30%] flex justify-center items-center mx-auto">Save Changes</Button>
      </form>
    </Form>
  );
}
