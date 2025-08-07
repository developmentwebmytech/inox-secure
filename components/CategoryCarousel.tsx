"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";

interface CategoryCarouselProps {
  category: string;
  showAll?: boolean;
}

export function CategoryCarousel({ category, showAll = false }: CategoryCarouselProps) {
  /* ——— state ——— */
  const [products, setProducts] = useState<any[]>([]);
  const [currentIndex, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(4);   // default desktop

  /* ——— responsive count ——— */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");   // ≤ 640 px
    const handle = () => setItemsToShow(mq.matches ? 2 : 4);
    handle();                   // run once on mount
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  /* ——— data fetch ——— */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/products?category=${category}&limit=${showAll ? 20 : 8}`
        );
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [category, showAll]);

  /* ——— skeleton / empty states ——— */
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(itemsToShow)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found in this category</p>
      </div>
    );
  }

  /* ——— helpers ——— */
  const maxIndex = Math.max(0, products.length - itemsToShow);
  const canLeft  = currentIndex > 0;
  const canRight = currentIndex < maxIndex;

  const left  = () => canLeft  && setCurrent((i) => i - 1);
  const right = () => canRight && setCurrent((i) => i + 1);

  /* ——— grid view when showAll ——— */
  if (showAll) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    );
  }

  /* ——— carousel ——— */
  return (
    <div className="relative">
      {/* controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={left}
            disabled={!canLeft}
            className="h-8 w-8 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={right}
            disabled={!canRight}
            className="h-8 w-8 bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="link" className="text-[#0042adef] p-0">
          View All Products →
        </Button>
      </div>

      {/* slider */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-6"
          style={{
            transform: `translateX(-${(currentIndex * 100) / itemsToShow}%)`,
            width: `${(products.length / itemsToShow) * 100}%`,
          }}
        >
          {products.map((p) => (
            <div
              key={p._id}
              style={{ flexBasis: `${100 / itemsToShow}%` }}
              className="flex-none"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
