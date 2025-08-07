"use client";

import { useState, useEffect } from "react";
import { Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ProductCard } from "./ProductCard";

interface ProductsClientProps {
  initialProducts: any[];
  categories: any[];
  brands: any[];
  currentCategory?: string;
}

export function ProductsClient({
  initialProducts,
  categories,
  brands,
  currentCategory,
}: ProductsClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    categories: currentCategory ? [currentCategory] : ([] as string[]),
    brands: [] as string[],
    priceRange: [0, 100000] as number[],
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: initialProducts.length,
    pages: Math.ceil(initialProducts.length / 12),
  });

  // Update the applyFilters function to include pagination
  const applyFilters = async (page = 1) => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", pagination.limit.toString());

    if (filters.categories.length > 0) {
      params.append("category", filters.categories.join(","));
    }

    if (filters.brands.length > 0) {
      params.append("brand", filters.brands.join(","));
    }

    if (filters.priceRange[0] > 0) {
      params.append("minPrice", filters.priceRange[0].toString());
    }

    if (filters.priceRange[1] < 100000) {
      params.append("maxPrice", filters.priceRange[1].toString());
    }

    try {
      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch filtered products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categorySlug]
        : prev.categories.filter((slug) => slug !== categorySlug),
    }));
  };

  const handleBrandChange = (brandId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      brands: checked
        ? [...prev.brands, brandId]
        : prev.brands.filter((id) => id !== brandId),
    }));
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {filters.categories.length === 1
                ? categories.find((c) => c.slug === filters.categories[0])?.name || "All Products"
                : "All Products"}
            </h1>

            <p className="text-gray-600">{products.length} products found</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.slug}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={category.slug}
                          checked={filters.categories.includes(category.slug)}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(
                              category.slug,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={category.slug} className="text-sm">
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Brands</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div
                        key={brand._id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={brand._id}
                          checked={filters.brands.includes(brand._id)}
                          onCheckedChange={(checked) =>
                            handleBrandChange(brand._id, checked as boolean)
                          }
                        />
                        <Label htmlFor={brand._id} className="text-sm">
                          {brand.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, priceRange: value }))
                      }
                      max={100000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{filters.priceRange[0].toLocaleString()}</span>
                      <span>₹{filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#0042adef] hover:bg-[#0042ad]"
                  onClick={applyFilters}
                  disabled={loading}
                >
                  {loading ? "Applying..." : "Apply Filters"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No products found matching your criteria
                </p>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${viewMode === "grid"
                    ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3"
                    : "grid-cols-1"
                  }`}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              onClick={() => applyFilters(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>

            {[...Array(pagination.pages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={pagination.page === i + 1 ? "default" : "outline"}
                onClick={() => applyFilters(i + 1)}
                className="w-10"
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() => applyFilters(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
