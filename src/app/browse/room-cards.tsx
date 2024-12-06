"use client";

import { useState } from "react";
import bcrypt from "bcryptjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Room } from "@/db/schema";
import { GithubIcon, LockKeyhole, LockOpen } from "lucide-react";
import { TagsList } from "@/components/tags-list";
import { splitTags } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { trackRoomVisit } from "./action";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Tooltip } from "@/components/ui/Tooltip";

export function RoomCard({ room }: { room: Room }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleJoinRoom = async () => {
    if (!session) {
      alert("Please log in to join the room");
      return;
    }

    const { user } = session;
    const userId = user.id;
    const roomId = room.id;
    const visitedTags = splitTags(room.tags).join(",");

    if (!room.password || room.userId == session.user.id) {
      try {
        const result = await trackRoomVisit({ userId, roomId, visitedTags });
        console.log(result.message);
      } catch (error) {
        console.error("Error tracking room interaction:", error);
      }
      router.push(`/rooms/${room.id}`);
    } else {
      setOpen(true); 
    }
  };

  const handlePasswordSubmit = async () => {
    console.log(room);
    if (room.password) {
      const isPasswordCorrect = await bcrypt.compare(password, room.password);
      if (!isPasswordCorrect) {
        setError("Incorrect password. Please try again.");
        setOpen(true)
        return;
      }
    }
    setError("");
    setOpen(false);
    handleJoinRoom();
    router.push(`/rooms/${room.id}`);
  };

  return (
    <Card className="relative w-full md:w-[300px] lg:w-[400px] max-w-full mx-auto">

      <CardHeader>
        <div className="absolute top-2 right-2">
          <Tooltip text={room.password ? "Room is password-protected" : "Room has no password"}>
            {room.password && <LockKeyhole color="#f56161" />}{ !room.password && <LockOpen color="#3e77ea" />}
          </Tooltip>
        </div>
        <CardTitle className="text-lg md:text-xl font-bold">
          {room.name}
        </CardTitle>
        <CardDescription className="text-sm md:text-base">
          {room.description}
        </CardDescription>

      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:gap-6">
        <TagsList tags={splitTags(room.tags)} />
        {room.githubRepo && (
          <Link
            href={room.githubRepo}
            className="flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon />
            Github Project
          </Link>
        )}
      </CardContent>
      <CardFooter>
        <Button  className="w-full sm:w-auto" onClick={handleJoinRoom}>Join Room</Button>
      </CardFooter>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enter Room Password</AlertDialogTitle>
            <AlertDialogDescription>
              This room is password-protected. Please enter the password to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-4"
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordSubmit}>
              Join Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
