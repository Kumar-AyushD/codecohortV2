"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import img1 from "@/public/default-image.png"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteAccountAction } from "../actions";
import Image from "next/image";

// Define the User interface
interface User {
  id: string;
  name?: string | null;
  email?: string;
  image?: string | null;
}

// Define the Room interface, including optional fields
interface Room {
  id: string;
  name: string;
  githubRepo: string | null;
  tags: string;
  description?: string | null;
  userId?: string;
  password?: string | null;
}

// Profile component that takes user and roomHistory as props
export default function Profile({
  user,
  roomHistory,
}: {
  user: User;
  roomHistory: (Room | undefined)[];
}) {
  const [open, setOpen] = useState(false);

  // Filter out undefined values from roomHistory
  const validRoomHistory = roomHistory.filter(
    (room): room is Room => room !== undefined
  );

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove your
              account and any data you have.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteAccountAction();
                signOut({ callbackUrl: "/" });
              }}
            >
              Yes, delete my account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div>
        <div className="flex justify-center pt-8">
          <div className="px-4 space-y-6 md:px-6">
            <header className="space-y-4 text-center">
              <div className="flex flex-col items-center space-y-4">
                <Image
                  src={user.image ?? img1}
                  alt="Avatar"
                  width="150"
                  height="150"
                  className="border rounded-full"
                  style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                />
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-bold">
                    {user.name || "User Name"}
                  </h1>
                </div>
              </div>
            </header>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <Button asChild>
            <Link href={`/edit-profile/${user.id}`}>Edit Profile</Link>
          </Button>
          <Button asChild>
            <Link href={`mailto:${user.email}`}>Contact</Link>
          </Button>
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            variant="outline"
          >
            Sign Out
          </Button>
          <Button variant="destructive" onClick={() => setOpen(true)}>
            Delete Account
          </Button>
        </div>

        <section className="pt-8 px-4 md:px-6 max-w-3xl mx-auto space-y-6 mb-8 pb-8">
          <h2 className="text-xl font-semibold text-center">Room History</h2>
          <div className="border border-gray-200 rounded-lg p-4">
            {validRoomHistory && validRoomHistory.length > 0 ? (
              <ul className="space-y-2">
                {validRoomHistory.map((room, index) => (
                  <li
                    key={index}
                    className="p-3 rounded-lg border-b last:border-none flex items-center justify-between"
                  >
                    <div>
                      <div className="flex">
                        <p className="text-lg font-medium">{room.name}</p>
                        <p className="font-medium ml-4">
                          <Link href={room.githubRepo ?? "#"}>
                            <svg
                              className="h-6 w-6 text-gray-500"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                            </svg>
                          </Link>
                        </p>
                      </div>
                      <p className="text-gray-500">Tech Stack: {room.tags}</p>
                    </div>
                    <Button asChild>
                      <Link href={`/rooms/${room.id}`}>View Room</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">
                No room history available.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
