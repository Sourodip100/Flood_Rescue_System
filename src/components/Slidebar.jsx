// import React from "react";
// import Link from "next/link";
// export default function SlideBar({array = []}){ // i am passing the arry of key-value pair to accept array of url-text
//     return (
//         <>
//           <div className='slide-bar hidden flex flex-col w-[25%] h-168 gap-8 pl-10 p-4 bg-gray-800 text-white rounded-lg '>
//             {array.map((item)=>(
//                 <Link href={item.url} state={item.state} key={item.url} className="hover:text-blue-400 transition-colors text-xl">{item.text}</Link>
//             ))}
//           </div>  
//         </>
//     );
// }








"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SlideBar({ array = [], isOpen = false }) {
    const pathname = usePathname();

    if (array.length === 0) return null;

    return (
        <aside
            className={`slide-bar ${
                isOpen ? "block" : "hidden"
            } w-full md:w-64 shrink-0 bg-gray-800 text-white rounded-lg p-4 shadow-md`}
        >
            <nav className="flex flex-col gap-3">
                {array.map((item) => {
                    const active = pathname === item.url;

                    return (
                        <Link
                            href={item.url}
                            key={item.url}
                            className={`px-4 py-3 rounded-lg text-base transition-colors ${
                                active
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700 hover:text-blue-400"
                            }`}
                        >
                            {item.text}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
