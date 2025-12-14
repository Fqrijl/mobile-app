import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categories = [
  {
    name: "BAGS",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200",
    link: "Catalog?subcategory=bags",
  },
  {
    name: "FOOTWEAR",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
    link: "Catalog?subcategory=footwear",
  },
  {
    name: "HEADWEAR",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200",
    link: "Catalog?subcategory=headwear",
  },
  {
    name: "APPAREL",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
    link: "Catalog",
  },
  {
    name: "EQUIPMENT",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200",
    link: "Catalog?subcategory=equipment",
  },
  {
    name: "AKSESORIS",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=200",
    link: "Catalog?subcategory=aksesoris",
  },
];

export default function CategoryGrid() {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">KATEGORI PRODUK</h2>
        <Link
          to={createPageUrl("Categories")}
          className="text-sm text-red-500 font-medium"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((category, index) => (
          <Link
            key={index}
            to={createPageUrl(category.link)}
            className="bg-gray-100 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-200 transition-colors relative overflow-hidden min-h-[100px]"
          >
            <h3 className="font-bold text-xs sm:text-sm z-10 max-w-[60%]">
              {category.name}
            </h3>
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-contain"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
