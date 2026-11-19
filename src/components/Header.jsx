"use client"
import { useEffect } from 'react';
import Navbar from './Navbar';
import {useRouter} from "next/navigation";

export default function Header({ children }) {
    const router = useRouter();
    useEffect(() => {
        const slideBar = document.querySelector('.slide-bar');

        if (slideBar && slideBar.children.length === 0) {
            const hdbutton = document.querySelector('.hdbutton');

            if (hdbutton) {
                hdbutton.style.display = 'none';
            }
        }
    }, [children]);
    function handleSlide() {
        const slideBar = document.querySelector('.slide-bar');
        if (slideBar) {
            slideBar.classList.toggle('hidden');
        }
        else {
            console.error('SlideBar element not found');
        }
    }
    return (
        <div className='w-full flex flex-col sm:flex-row bg-gray-400 text-white p-4 items-center justify-between'>
            <h1 className='text-2xl sm:text-3xl font-bold ml-[1vw] cursor-pointer'>
                <button className='hdbutton hover:bg-blue-700 text-white font-bold px-4 py-2 rounded' onClick={handleSlide}><i className="fa-solid fa-bars text-2xl cursor-pointer hover:text-blue-400"></i></button>
                FRS
            </h1>
            <Navbar />
            {children}
        </div>
    );
}