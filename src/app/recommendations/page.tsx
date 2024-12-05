import { unstable_noStore } from "next/cache";
import { fetchTopRooms } from "./action";
import { RoomCard } from "@/app/browse/room-cards";
import Image from "next/image";
import img from "@/public/no-data.png"

interface Room {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  tags: string;
  githubRepo: string | null;
  password: string | null;
}

export default async function Home() {
  unstable_noStore();
  const rooms = await fetchTopRooms();

  return (
    <main className="min-h-screen p-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl">Recommended Rooms for You</h1>
      </div>
      <div className="grid grid-cols-3 gap-4">
          {rooms.map((room: Room) => {
            return <RoomCard key={room.id} room={room} />
          }
        )}
      </div>

      {rooms.length == 0 && 
      <div className="flex flex-col gap-4 justify-center items-center mt-24 ml-auto">
            <Image
              src={img}
              width="200"
              height="200"
              alt="No data image"
            />
            <h2 className="text-2xl">No Rooms Yet!</h2>
          </div>}
    </main>
  );
}
