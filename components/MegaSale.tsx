// components/MegaSaleBanner.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
    getMegaSaleSections,
    getMobileMegaSaleSections,
} from "@/lib/api";        // adjust path if needed
import Link from "next/link";

type Banner = {
    _id: string;
    image: string;   // URL saved in MongoDB
    alt?: string;
};

/* simple hook – detects ≤640 px */
function useIsMobile() {
    const [m, setM] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 640px)");
        const f = () => setM(mq.matches);
        f();
        mq.addEventListener("change", f);
        return () => mq.removeEventListener("change", f);
    }, []);
    return m;
}

export default function MegaSaleBanner() {
    const isMobile = useIsMobile();   // still useful for “no data” check
    const [desktopBanner, setDesktopBanner] = useState<Banner | null>(null);
    const [mobileBanner, setMobileBanner] = useState<Banner | null>(null);

    /* ...inside the component, after state is set up */
    useEffect(() => {
        (async () => {
            const [desk, mob] = await Promise.all([
                getMegaSaleSections(),
                getMobileMegaSaleSections(),
            ]);

            setDesktopBanner(desk[0] ?? null);
            setMobileBanner(mob[0] ?? null);

            /* 👉 log the mobile image URL */
            if (mob[0]?.image) {
                console.log("Mobile banner image →", mob[0].image);
            }
        })();
    }, []);


    /* nothing ready yet */
    if (!desktopBanner && !mobileBanner) return null;

    return (
        <section className="w-full px-2">

            {/* MOBILE banner (≤ 640 px) */}
            {mobileBanner && (
                <div className="relative h-60 w-full overflow-hidden rounded-lg sm:hidden">
                    {/* if you later add the plugin, you can switch back to aspect-[1900/204] */}
                    <Image
                        src={mobileBanner.image}
                        alt={mobileBanner.alt || "Mega sale mobile"}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                    />
                </div>
            )}

            {/* DESKTOP / TABLET banner (≥ 641 px) */}
            {desktopBanner && (
                <div className="relative aspect-[1900/204] w-full overflow-hidden rounded-lg hidden sm:block">
                    <a href="/products">
                        <Image
                            src={desktopBanner.image}
                            alt={desktopBanner.alt || "Mega sale"}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority
                        />
                    </a>

                </div>
            )}

        </section>
    );
}

