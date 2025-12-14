import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ProductCard from "@/components/product/ProductCard";
import { Loader2, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const categoryData = {
  men: {
    label: "Pria",
    subcategories: {
      tshirt: [
        "T-Shirt Sablon - Men",
        "T-Shirt Polos - Men",
        "Heavyweight",
        "Quick Dry",
        "Kaos Kaki",
        "Pique",
        "Cotton Cloud",
        "Promo Bundling",
        "New Arrival",
      ],
      hoodie: ["Hoodie Crewneck - Unisex"],
      shirt_polo: ["Kemeja - Men", "Polo Shirt - Men"],
      pants: ["Chinos & Cargo - Men", "Jeans - Man", "Jogger - Unisex"],
      footwear: [
        "Sandal - Unisex",
        "Sepatu - Unisex",
        "Sepatu Vulcanized",
        "Sandal & Patch",
      ],
      parfume: ["Shoes Parfume", "Parfum"],
    },
  },
  women: {
    label: "Wanita",
    subcategories: {
      tshirt: [
        "T-Shirt Sablon - Women",
        "T-Shirt Polos - Women",
        "Kaos Kaki",
        "Pique",
        "Cotton Cloud",
        "Promo Bundling",
        "New Arrival",
      ],
      hoodie: ["Hoodie Crewneck - Women", "Hoodie Crewneck - Unisex"],
      shirt_polo: ["Kemeja - Women", "Polo Shirt - Women"],
      pants: ["Short Pants - Women", "Jeans - Women", "Jogger - Unisex"],
      footwear: [
        "Sepatu - Women",
        "Sandal & Patch - Women",
        "Sandal - Unisex",
        "Sepatu - Unisex",
        "Sepatu Vulcanized",
        "Sandal & Patch",
      ],
      parfume: ["Shoes Parfume", "Parfum"],
    },
  },
  unisex: {
    label: "Unisex",
    subcategories: {
      general: [
        "Kaos Kaki",
        "Pique",
        "Cotton Cloud",
        "Promo Bundling",
        "New Arrival",
      ],
      hoodie: ["Hoodie Crewneck - Unisex"],
      pants: ["Jogger - Unisex"],
      footwear: [
        "Sandal - Unisex",
        "Sepatu - Unisex",
        "Sepatu Vulcanized",
        "Sandal & Patch",
      ],
      parfume: ["Shoes Parfume", "Parfum"],
    },
  },
};

export default function Catalog() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get("category") || "";
  const initialSearch = urlParams.get("search") || "";
  const initialType = urlParams.get("type") || "";
  const initialBestseller = urlParams.get("bestseller") === "true";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedSize, setSelectedSize] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("-created_date", 100),
  });

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const sortOptions = [
    { value: "newest", label: "Terbaru" },
    { value: "price_low", label: "Harga Terendah" },
    { value: "price_high", label: "Harga Tertinggi" },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (initialSearch) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(initialSearch.toLowerCase())
      );
    }

    if (initialBestseller) {
      result = result.filter((p) => p.is_bestseller);
    }

    if (initialType) {
      result = result.filter((p) => p.type === initialType);
    }

    if (selectedType) {
      result = result.filter((p) => p.type === selectedType);
    }

    if (selectedSize) {
      result = result.filter((p) => p.sizes?.includes(selectedSize));
    }

    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price_high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }

    return result;
  }, [
    products,
    selectedType,
    selectedSize,
    sortBy,
    initialSearch,
    initialBestseller,
    initialType,
  ]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedType("");
    setSelectedSize("");
  };

  const hasActiveFilters = selectedCategory || selectedType || selectedSize;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-14 bg-white z-30 border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {Object.entries(categoryData).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === key ? "" : key);
                    setSelectedType("");
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === key
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t">
          <span className="text-sm text-gray-500">
            {filteredProducts.length} produk
          </span>

          <div className="flex items-center gap-2">
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm relative">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filter
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full" />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
                <SheetHeader className="pb-4">
                  <SheetTitle>Filter</SheetTitle>
                </SheetHeader>

                <div className="space-y-6 overflow-y-auto">
                  {selectedCategory && categoryData[selectedCategory] && (
                    <div>
                      <h4 className="font-medium mb-3">Tipe Produk</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(
                          categoryData[selectedCategory].subcategories
                        )
                          .flat()
                          .map((type) => (
                            <button
                              key={type}
                              onClick={() =>
                                setSelectedType(
                                  selectedType === type ? "" : type
                                )
                              }
                              className={`px-3 py-2 rounded-full text-sm transition-colors ${
                                selectedType === type
                                  ? "bg-black text-white"
                                  : "bg-gray-100 hover:bg-gray-200"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-3">Ukuran</h4>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() =>
                            setSelectedSize(selectedSize === size ? "" : size)
                          }
                          className={`w-12 h-12 rounded-lg text-sm font-medium transition-colors ${
                            selectedSize === size
                              ? "bg-black text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Urutkan</h4>
                    <div className="space-y-2">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                            sortBy === option.value
                              ? "bg-black text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-3">
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-3 rounded-full border text-sm font-medium"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="flex-1 py-3 rounded-full bg-black text-white text-sm font-medium"
                  >
                    Terapkan
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="px-4 py-3 flex items-center gap-2 overflow-x-auto">
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
              {categoryData[selectedCategory].label}
              <button onClick={() => setSelectedCategory("")}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedType && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
              {selectedType}
              <button onClick={() => setSelectedType("")}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedSize && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
              Size {selectedSize}
              <button onClick={() => setSelectedSize("")}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="px-4 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Tidak ada produk ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
