import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserRooms } from "@/data-access/rooms";
import { UserRoomCard } from "./user-room-card";
import { unstable_noStore } from "next/cache";
import Image from "next/image";
import img from "@/public/no-data.png"
import { RainbowButton } from "@/components/ui/rainbow-button";

interface Room {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  tags: string;
  githubRepo: string | null;
  password?: string | null;
}

export default async function YourRoomsPage() {
  unstable_noStore();
  const rooms: Room[] = await getUserRooms();

  return (
    <main className="min-h-screen p-4 sm:p-8 md:p-12 lg:p-16">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl">Your Rooms</h1>
        <Button asChild className="w-full sm:w-auto">
          <RainbowButton color="">
            <Link href="/create-room">Create Room</Link>
          </RainbowButton>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room: Room) => {
          return <UserRoomCard key={room.id} room={room} />;
        })}
      </div>

      {rooms.length === 0 && (
        <div className="flex flex-col gap-4 justify-center items-center mt-12 sm:mt-24">
          <Image
            src={img}
            width="200"
            height="200"
            alt="no data image"
            className="w-40 sm:w-52 md:w-64"
          />
          <h2 className="text-xl sm:text-2xl">You have no rooms</h2>
        </div>
      )}
    </main>
  );
}