import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function CategoryNavbar() {
  const categories = [
    { key: "men", label: "MEN", href: "Catalog?category=men" },
    { key: "women", label: "WOMEN", href: "Catalog?category=women" },
    { key: "unisex", label: "UNISEX", href: "Catalog?category=unisex" },
  ];

  return (
    <div className="bg-white border-b sticky top-14 z-30">
      <div className="flex justify-around">
        {categories.map((category) => (
          <Link
            key={category.key}
            to={createPageUrl(category.href)}
            className="flex-1 py-4 px-4 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            {category.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
