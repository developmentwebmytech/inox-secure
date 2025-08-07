"use client";

import type React from "react";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

interface Category {
  id: number;
  name: string;
  image: string;
  count: number;
  slug: string;
  subcategories: string[];
  color: string;
  gradient: string;
  icon: React.ReactNode;
  trending?: boolean;
}

export default function AnimatedCategories() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const categories: Category[] = [
    {
      id: 1,
      name: "Electronics",
      image: "/cate1.png",
      count: 24,
      slug: "electronics",
      subcategories: [
        "LED TV",
        "Washing Machine",
        "Air Conditioner",
        "Refrigerator",
      ],
      color: "#3B82F6",
      gradient: "from-blue-500 to-purple-600",
      icon: <Sparkles className="h-6 w-6" />,
      trending: true,
    },
    {
      id: 2,
      name: "Appliances",
      image: "/cate3.png",
      count: 18,
      slug: "appliances",
      subcategories: [
        "Mixer Grinder",
        "Iron",
        "Microwave Oven",
        "Vacuum Cleaner",
      ],
      color: "#10B981",
      gradient: "from-green-500 to-blue-600",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      id: 3,
      name: "IT Products",
      image: "/mobile/itproduct.png",
      count: 15,
      slug: "it-products",
      subcategories: ["Mobile Phones", "Laptops", "Tablets", "Accessories"],
      color: "#F59E0B",
      gradient: "from-orange-500 to-red-600",
      icon: <Sparkles className="h-6 w-6" />,
      trending: true,
    },
  ];

  return (
    <section className="w-full py-6 md:py-20 px-6 lg:px-14 bg-[#dbeafe34]">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <h2 className="text-xl md:text-4xl font-medium text-[#efa46edb]">
            Shop by Category
          </h2>
          <p className="max-w-[700px] text-gray-900 md:text-xl font-light">
            Discover amazing products across our carefully curated categories
            with exclusive deals and fast delivery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="group relative"
              onHoverStart={() => setHoveredCategory(category.id)}
              onHoverEnd={() => setHoveredCategory(null)}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <Link href={`/${category.slug}`}>
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500">
                  {category.trending && (
                    <motion.div
                      className="absolute top-4 right-4 z-20 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                    >
                      🔥 Trending
                    </motion.div>
                  )}

                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                  />

                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-3xl">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />

                    <motion.div
                      className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                      style={{ color: category.color }}
                      whileHover={{ scale: 1.2, rotate: 360, backgroundColor: category.color, color: "white" }}
                      transition={{ duration: 0.5 }}
                    >
                      {category.icon}
                    </motion.div>
                  </div>

                  <div className="p-8 relative">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-transparent bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                        {category.name}
                      </h3>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        Explore collection
                      </span>
                      <motion.div
                        className="flex items-center text-blue-600 font-medium"
                        whileHover={{ x: 5 }}
                      >
                        <Link
                          href={`/${category.slug}`}
                          className="block bg-white border border-blue-600 rounded-md py-2 px-4"
                        >
                          Shop Now
                        </Link>
                        <ArrowRight className="h-4 w-4 ml-2 hidden sm:block" />
                      </motion.div>
                    </div>

                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-blue-400 rounded-full"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + (i % 2) * 40}%`,
                          }}
                          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}