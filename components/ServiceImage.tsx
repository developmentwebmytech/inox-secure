// components/PromoSection.tsx
"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Image from "next/image";
import Link from "next/link";

import {
  getServicesSections,
  getMobileServicesSections,
} from "@/lib/api";

type Banner = {
  _id: string;
  image: string;
  alt?: string;
};

export default function PromoSection() {
  // banners from the API
  const [desktopBanners, setDesktopBanners] = useState<Banner[]>([]);
  const [mobileSlides, setMobileSlides] = useState<Banner[]>([]);

  // fetch once on mount
  useEffect(() => {
    (async () => {
      const [desk, mob] = await Promise.all([
        getServicesSections(),       // type=services
        getMobileServicesSections(), // type=mobile-services
      ]);
      setDesktopBanners(desk);
      setMobileSlides(mob);
    })();
  }, []);

  // show nothing until data arrives
  if (desktopBanners.length === 0 && mobileSlides.length === 0) return null;

  return (
    <section className="w-full px-2">

      <div className="hidden sm:block">
        {/* ——— Desktop & tablet swiper ——— */}
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          navigation
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 2 },
          }}
          className="  rounded-lg"   /* no global aspect */
        >
          {desktopBanners.map((b) => (
            <SwiperSlide key={b._id}>
              {/* local aspect box gives height */}
              <Link
                href="/service"
                className="block relative w-full aspect-[16/9] overflow-hidden rounded-lg "
              >
                <Image
                  src={b.image}
                  alt={b.alt || "service"}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(min-width:1024px) 33vw, 50vw"
                  priority
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>



      {/* ——— Mobile swiper ——— */}
      <div className="md:hidden lg:hidden relative w-full">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          navigation
          className="rounded-lg aspect-[16/9]"
        >
          {mobileSlides.map((s) => (
            <SwiperSlide key={s._id} className="relative w-full h-full">
              <Link href="/service" className="block w-full h-full">
                <Image
                  src={s.image}
                  alt={s.alt || "service"}
                  fill
                  className="object-contain rounded-lg"
                  sizes="100vw"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
    </section>
  );
}
