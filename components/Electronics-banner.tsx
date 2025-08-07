// components/ElectronicsBannerSection.tsx
"use client";

import { useEffect, useState } from "react";               // NEW
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Image from "next/image";
import Link from "next/link";

import { getProductBannerSections } from "@/lib/api";      // NEW

/* ---------- types ---------- */
type Slide = {                                             // NEW
  _id: string;
  image: string;
  alt?: string;
  link?: string;
};

export function ElectronicsBannerSection() {
  /* fetch data */
  const [slides, setSlides] = useState<Slide[]>([]);       // NEW

  useEffect(() => {                                        // NEW
    (async () => {
      const data = await getProductBannerSections();       // NEW
      setSlides(data);                                     // NEW
    })();
  }, []);                                                  // NEW

  if (slides.length === 0) return null;                    // NEW (fallback)

  return (
    <section className="w-full px-6 py-20">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation
      >
        {/* CHANGED: map over fetched slides, not hard‑coded array */}
        {slides.map((s, idx) => (                            // CHANGED
          <SwiperSlide key={s._id}>                         
            <Link
              href={s.link || "/service"}                           // CHANGED
              className="block relative w-full aspect-[16/9]"
            >
              <Image
                src={s.image}                                // CHANGED
                alt={s.alt || "product banner"}              // CHANGED
                fill
                className="object-covers rounded-xl "
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                priority={idx === 0}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
