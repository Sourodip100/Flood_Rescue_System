"use client";
import { useRouter } from "next/navigation";
export default function Page(){
    const router = useRouter();
    return (
        <>
            <h1> Hi User, don't be afraid, we are here to help you! </h1>
            <h2> Create a emergency rescue request </h2>
            <button onClick={() => router.push("/citizen/request")}>Create Request</button>
        </>
    )
}