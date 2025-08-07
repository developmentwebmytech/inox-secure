// components/HeroSection.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  getBannerSections,
  getMobileBannerSections,
} from "@/lib/api";

type Slide = {
  _id: string;
  image: string;
  mobile?: string;
  alt?: string;
  link?: string;
   title?: string;
};

/* true when the screen is 640 px wide or less */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width:640px)");
    const handle = () => setMobile(mq.matches);
    handle();
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);
  return mobile;
}

export function HeroSection() {
  const isMobile = useIsMobile();

  const [desktopSlides, setDesktopSlides] = useState<Slide[]>([]);
  const [mobileSlides, setMobileSlides] = useState<Slide[]>([]);

  /* fetch banners once */
  useEffect(() => {
    (async () => {
      const [desk, mob] = await Promise.all([
        getBannerSections(),
        getMobileBannerSections(),
      ]);
      setDesktopSlides(desk);
      setMobileSlides(mob);
    })();
  }, []);

  const slides = isMobile ? mobileSlides : desktopSlides;
  if (slides.length === 0) return null;

  return (
    <section className="relative w-full ">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        className="w-full"
      >
        {slides.map((s) => (
          <SwiperSlide key={s._id}>
            <Link href={`/${s.title}`} className="block w-full ">
              <div className="relative w-full">
                {/* mobile (≤ 640 px) */}
                <Image
                  src={s.mobile || s.image}
                  alt={s.alt || "banner"}
                  width={1920}      /* use your banner size */
                  height={800}
                  priority
                  className="w-full h-auto object-cover sm:hidden"
                  sizes="100vw"
                />

                {/* desktop (≥ 640 px) */}
                <Image
                  src={s.image}
                  alt={s.alt || "banner"}
                  width={1920}
                  height={750}
                  className="w-full h-auto object-cover hidden sm:block"
                  sizes="(min-width:640px) 100vw"
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
