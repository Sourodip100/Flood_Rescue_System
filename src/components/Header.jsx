// "use client"
// import { useEffect } from 'react';
// import Navbar from './Navbar';
// import {useRouter} from "next/navigation";

// export default function Header({ children }) {
//     const router = useRouter();
//     useEffect(() => {
//         const slideBar = document.querySelector('.slide-bar');

//         if (slideBar && slideBar.children.length === 0) {
//             const hdbutton = document.querySelector('.hdbutton');

//             if (hdbutton) {
//                 hdbutton.style.display = 'none';
//             }
//         }
//     }, [children]);
//     function handleSlide() {
//         const slideBar = document.querySelector('.slide-bar');
//         if (slideBar) {
//             slideBar.classList.toggle('hidden');
//         }
//         else {
//             console.error('SlideBar element not found');
//         }
//     }
//     return (
//         <div className='w-full flex flex-col sm:flex-row bg-gray-400 text-white p-4 items-center justify-between'>
//             <h1 className='text-2xl sm:text-3xl font-bold ml-[1vw] cursor-pointer'>
//                 <button className='hdbutton hover:bg-blue-700 text-white font-bold px-4 py-2 rounded' onClick={handleSlide}><i className="fa-solid fa-bars text-2xl cursor-pointer hover:text-blue-400"></i></button>
//                 FRS
//             </h1>
//             <Navbar />
//             {children}
//         </div>
//     );
// }



"use client";

import { useState } from "react";
import Navbar from "./Navbar";

export default function Header({ children, onMenuClick, showMenu = false }) {
    const [menuOpen, setMenuOpen] = useState(false);

    function handleMenuClick() {
        setMenuOpen((previous) => !previous);
        onMenuClick?.();
    }

    return (
        <header className="w-full flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white px-5 py-4 shadow-lg">
            <div className="flex items-center gap-3">
                {showMenu && (
                    <button
                        type="button"
                        onClick={handleMenuClick}
                        aria-label="Toggle sidebar"
                        aria-expanded={menuOpen}
                        className="p-2 rounded-lg hover:bg-slate-700"
                    >
                        <i className="fa-solid fa-bars text-2xl"></i>
                    </button>
                )}

                <a href="/" className="text-3xl font-extrabold tracking-wide">
                    FRS<span className="text-cyan-400">.</span>
                </a>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Navbar />
                {children}
            </div>
        </header>
    );
}
