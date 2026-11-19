import React from "react";
import Link from "next/link";
export default function SlideBar({array = []}){ // i am passing the arry of key-value pair to accept array of url-text
    return (
        <>
          <div className='slide-bar hidden flex flex-col w-[25%] h-168 gap-8 pl-10 p-4 bg-gray-800 text-white rounded-lg'>
            {array.map((item)=>(
                <Link href={item.url} state={item.state} key={item.url} className="hover:text-blue-400 transition-colors text-xl">{item.text}</Link>
            ))}
          </div>  
        </>
    );
}