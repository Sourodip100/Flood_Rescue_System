
"use client";

import { useEffect, useState } from "react";

const slides = [
    {
        image: "https://media.assettype.com/tnm/import/sites/default/files/bihar-floods.jpg?auto=format%2Ccompress&enlarge=true&fit=max&h=675&w=1200",
        title: "Together, We Can Overcome Floods",
        subtitle: "Coordinated rescue operations can help bring families to safety.",
    },
    {
        image: "https://im.rediff.com/news/2025/jun/29flood-rescue.jpg",
        title: "Every Life Matters",
        subtitle: "Connecting people in danger with rescue teams when they need help.",
    },
    {
        image: "https://static.euronews.com/articles/stories/08/03/00/80/1920x1080_cmsv2_e0418212-380d-5931-80e9-de25f161c6d0-8030080.jpg",
        title: "Hope Is Stronger Than Fear",
        subtitle: "Preparedness, teamwork and timely assistance make a difference.",
    },
];

export default function HomeCarousel() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActive((previous) => (previous + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const previous = () => {
        setActive((active - 1 + slides.length) % slides.length);
    };

    const next = () => {
        setActive((active + 1) % slides.length);
    };

    return (
        <section className="relative h-[450px] md:h-[570px] overflow-hidden bg-slate-900">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        active === index ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <img
                        src={slide.image}
                        alt="Flood rescue operation"
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent"></div>

                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-7xl mx-auto px-6 w-full">
                            <div className="max-w-2xl text-white">
                                <span className="inline-block bg-cyan-500/20 border border-cyan-400 text-cyan-300 px-4 py-2 rounded-full text-sm mb-5">
                                    Flood Rescue System
                                </span>

                                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                                    {slide.title}
                                </h1>

                                <p className="mt-5 text-lg md:text-xl text-gray-200">
                                    {slide.subtitle}
                                </p>

                                <div className="flex flex-wrap gap-4 mt-8">
                                    <a
                                        href="/auth/register"
                                        className="bg-red-600 hover:bg-red-700 px-7 py-3 rounded-lg font-bold"
                                    >
                                        <i className="fa-solid fa-life-ring mr-2"></i>
                                        Get Emergency Help
                                    </a>

                                    <a
                                        href="/services"
                                        className="border border-white hover:bg-white hover:text-slate-900 px-7 py-3 rounded-lg font-bold"
                                    >
                                        Explore Services
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={previous}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-11 h-11"
            >
                <i className="fa-solid fa-chevron-left"></i>
            </button>

            <button
                onClick={next}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-11 h-11"
            >
                <i className="fa-solid fa-chevron-right"></i>
            </button>

            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActive(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-3 rounded-full transition-all ${
                            active === index ? "bg-cyan-400 w-9" : "bg-white/70 w-3"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
