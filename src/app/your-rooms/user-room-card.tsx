"use client";
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
import { GithubIcon, PencilIcon, TrashIcon } from "lucide-react";
import { TagsList } from "@/components/tags-list";
import { splitTags } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteRoomAction } from "./actions";

interface Room {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  tags: string;
  githubRepo: string | null;
  password?: string | null;
}

export function UserRoomCard({ room }: { room: Room }) {
  return (
    <Card>
      <CardHeader className="relative">
        <Button 
          className="absolute top-2 right-2 size-8 sm:size-9" 
          size="icon"
        >
          <Link href={`/edit-room/${room.id}`}>
            <PencilIcon className="size-4 sm:size-5" />
          </Link>
        </Button>
        <CardTitle className="text-xl sm:text-2xl">{room.name}</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {room.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:gap-4">
        <TagsList tags={splitTags(room.tags)} />
        {room.githubRepo && (
          <Link
            href={room.githubRepo}
            className="flex items-center gap-2 text-sm sm:text-base"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="size-4 sm:size-5" />
            Github Project
          </Link>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          asChild 
          className="w-full sm:w-auto mb-2 sm:mb-0"
        >
          <Link href={`/rooms/${room.id}`}>Join Room</Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant={"destructive"} 
              className="w-full sm:w-auto"
            >
              <TrashIcon className="size-4 mr-2" /> Delete Room
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove the
                room and any data associated with it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  deleteRoomAction(room.id);
                }}
              >
                Yes, delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}