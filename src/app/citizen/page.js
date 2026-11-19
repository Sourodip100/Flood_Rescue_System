"use client";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import SlideBar from "@/components/Slidebar";
export default function Page(){
    const router = useRouter();
    function logOut(){
        fetch("/api/auth/logout", {
            method: "GET"
        }).then((res) => {
            if (res.ok) {
                alert("Logout successful");                                     
                router.push("auth/login");
            }
            else {
                alert("Logout failed");
            }
        });
    }
    
    return (
        <>
            <Header>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded' onClick={() => logOut()}>Log Out</button>
            </Header>
            <main className="p-4 flex flex-col h-full sm:flex-row gap-4 ">
                <SlideBar array={[
                    { url: "/citizen", text: "Dashboard", state: {} },
                    { url: "/citizen/request", text: "Create Request", state: {} },
                    { url: "/citizen/myRequests", text: "My Requests", state: {} },
                ]} />
                <div>
                    <h1> Hi User, don't be afraid, we are here to help you! </h1>
                    <h2> Create a emergency rescue request </h2>
                    <button onClick={() => router.push("/citizen/request")} className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded'>Create Request</button>
                    <button onClick={() => router.push("/citizen/myRequests")} className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded'> My Requests </button>
                </div>
            </main>
        </>
    )
}