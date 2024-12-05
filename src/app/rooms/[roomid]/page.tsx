import { TagsList } from "@/components/tags-list";
import { getRoom } from "@/data-access/rooms";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { DevFinderVideo } from "./video-player";
import { splitTags } from "@/lib/utils";
import { unstable_noStore } from "next/cache";

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  unstable_noStore();

  const room = await getRoom(params.roomId);

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="text-lg font-semibold">No room of this ID found</p>
        <Link href="/browse" className="text-blue-600 underline">
          Go back to all rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 min-h-screen">
      <div className="col-span-3 p-4 pr-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 min-h-screen">
          <DevFinderVideo room={room} />
        </div>
      </div>

      <div className="col-span-1 p-4 pl-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-4">
          <h1 className="text-lg font-bold">{room?.name || "Untitled Room"}</h1>

          {room.githubRepo && (
            <Link
              href={room.githubRepo}
              className="flex items-center gap-2 text-sm text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon />
              <span>Github Project</span>
            </Link>
          )}

          <p className="text-sm text-gray-600">
            {room?.description || "No description provided."}
          </p>

          <TagsList tags={splitTags(room.tags || "")} />
        </div>
      </div>
    </div>
  );
}