// app/components/ShowFooter.tsx
"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";

export function ShowFooter() {
  const pathname = usePathname();
  const show = pathname.startsWith("/dashboard" ) || pathname.startsWith("/agent") || pathname.startsWith("/merchant");
  return !show ? <Footer /> : null;
}
