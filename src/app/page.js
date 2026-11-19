"use client"

import Header from "@/components/Header";
import SlideBar from "@/components/Slidebar";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <>
      <Header>
        <div className='flex gap-2 mx-10'>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded' onClick={() => router.push("auth/login")}>Login</button>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded' onClick={() => router.push("auth/register")}>Sign Up</button>
        </div>
      </Header>
      <main className="p-4 flex flex-col sm:flex-row gap-4">
        <SlideBar array={[
          { url: "/dashboard", text: "Dashboard", state: {} },
          { url: "/", text: "Rescuer Availavle", state: {} },
          // { url: "/", text: "My Bookings", state: {} },
        ]} />
      </main>
    </>
  );
}
