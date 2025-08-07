"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServiceCategory {
  _id: string;
  name: string;
  description?: string;
}

export default function CategoryNavigation() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
    const category = searchParams.get("category") || "all";
    setActiveCategory(category);
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/service-category");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching service categories:", error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    const params = new URLSearchParams(searchParams.toString());

    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }

    router.push(`/service?${params.toString()}`);
  };

  return (
    <nav className="py-4">
      {/* <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === "all" ? "default" : "ghost"}
          onClick={() => handleCategoryChange("all")}
          className={cn(
            "rounded-full px-6 py-2 text-sm font-medium transition-colors",
            activeCategory === "all"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-300",
          )}
        >
          Top and Upcoming
        </Button>

        {categories.map((category) => (
          <Button
            key={category._id}
            variant={activeCategory === category._id ? "default" : "ghost"}
            onClick={() => handleCategoryChange(category.slug)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-medium transition-colors",
              activeCategory === category._id
               ? "bg-blue-600 text-white hover:bg-blue-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-300",
            )}
          >
            {category.name}
          </Button>
        ))}
      </div> */}

      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === "all" ? "default" : "ghost"}
          onClick={() => handleCategoryChange("all")}
          className={cn(
            "rounded-full px-6 py-2 text-sm font-medium transition-colors",
            activeCategory === "all"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-300"
          )}
        >
          Top and Upcoming
        </Button>

        {categories.map((category) => (
          <Button
            key={category._id}
            variant={activeCategory === category.slug ? "default" : "ghost"}
            onClick={() => handleCategoryChange(category.slug)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-medium transition-colors",
              activeCategory === category.slug
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-300"
            )}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </nav>
  );
}
