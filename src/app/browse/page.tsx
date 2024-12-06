import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getRooms } from "@/data-access/rooms";
import { SearchBar } from "./search-bar";
import { RoomCard } from "./room-cards";
import { unstable_noStore } from "next/cache";
import Image from "next/image";
import { RainbowButton } from "@/components/ui/rainbow-button";

interface Room {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  tags: string;
  githubRepo: string | null;
  password: string | null;
}

export default async function Home({
  searchParams,
}: {
  searchParams: {
    search: string;
  };
}) {
  unstable_noStore();
  const rooms: Room[] = await getRooms(searchParams.search);
  // console.log("Hello", rooms);

  return (
    <main className="min-h-screen p-4 md:p-16">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-xl md:text-2xl font-bold text-center sm:text-left w-full sm:w-auto">
          Find Dev Rooms
        </h1>
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <RainbowButton color="" className="w-full sm:w-auto">
            <Link href="/create-room">Create Room</Link>
          </RainbowButton>
        </div>
      </div>

      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room: Room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="flex flex-col gap-4 justify-center items-center mt-24">
          <Image
            src="/no-data.svg"
            width="200"
            height="200"
            alt="no data image"
          />

          <h2 className="text-xl md:text-2xl font-semibold">No Rooms Yet!</h2>

          <Button asChild>
            <Link href="/create-room">Create Room</Link>
          </Button>
        </div>
      )}
    </main>

  );
}
