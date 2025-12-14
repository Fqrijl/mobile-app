import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronRight, ShoppingBag, Search } from "lucide-react";

const categories = [
  {
    name: "T Shirt Sablon – Men",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100",
    link: "Catalog?type=T Shirt Sablon – Men",
  },
  {
    name: "T Shirt Polos – Men",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100",
    link: "Catalog?type=T Shirt Polos – Men",
  },
  {
    name: "Kemeja – Men",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100",
    link: "Catalog?type=Kemeja – Men",
  },
  {
    name: "Polo Shirt – Men",
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=100",
    link: "Catalog?type=Polo Shirt – Men",
  },
  {
    name: "Chinos & Cargo – Men",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=100",
    link: "Catalog?type=Chinos & Cargo – Men",
  },
  {
    name: "Jeans – Man",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100",
    link: "Catalog?type=Jeans – Man",
  },
  {
    name: "Sepatu – Men",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100",
    link: "Catalog?type=Sepatu – Men",
  },
  {
    name: "T Shirt Sablon – Women",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=100",
    link: "Catalog?type=T Shirt Sablon – Women",
  },
  {
    name: "T Shirt Polos – Women",
    image: "https://images.unsplash.com/photo-1625367421994-5c8644046e1a?w=100",
    link: "Catalog?type=T Shirt Polos – Women",
  },
  {
    name: "Kemeja – Women",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100",
    link: "Catalog?type=Kemeja – Women",
  },
  {
    name: "Polo Shirt – Women",
    image: "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=100",
    link: "Catalog?type=Polo Shirt – Women",
  },
  {
    name: "Short Pants – Women",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=100",
    link: "Catalog?type=Short Pants – Women",
  },
  {
    name: "Jeans – Women",
    image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=100",
    link: "Catalog?type=Jeans – Women",
  },
  {
    name: "Sandal & Patch – Women",
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=100",
    link: "Catalog?type=Sandal & Patch – Women",
  },
  {
    name: "Hoodie Crewneck – Women",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100",
    link: "Catalog?type=Hoodie Crewneck – Women",
  },
  {
    name: "Sepatu – Women",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100",
    link: "Catalog?type=Sepatu – Women",
  },
  {
    name: "Hoodie Crewneck – Unisex",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100",
    link: "Catalog?type=Hoodie Crewneck – Unisex",
  },
  {
    name: "Jogger – Unisex",
    image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=100",
    link: "Catalog?type=Jogger – Unisex",
  },
  {
    name: "Quick Dry",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100",
    link: "Catalog?type=Quick Dry",
  },
  {
    name: "Pique",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100",
    link: "Catalog?type=Pique",
  },
  {
    name: "Heavyweight",
    image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=100",
    link: "Catalog?type=Heavyweight",
  },
  {
    name: "Cotton Cloud",
    image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=100",
    link: "Catalog?type=Cotton Cloud",
  },
  {
    name: "Kaos Kaki",
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=100",
    link: "Catalog?type=Kaos Kaki",
  },
  {
    name: "Parfum",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100",
    link: "Catalog?type=Parfum",
  },
  {
    name: "Sepatu – Unisex",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=100",
    link: "Catalog?type=Sepatu – Unisex",
  },
  {
    name: "Sandal Unisex",
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=100",
    link: "Catalog?type=Sandal Unisex",
  },
  {
    name: "Sandal & Patch",
    image: "https://images.unsplash.com/photo-1603808033587-e1971b566490?w=100",
    link: "Catalog?type=Sandal & Patch",
  },
];

export default function Categories() {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-14 bg-white border-b px-4 py-4 flex items-center justify-between z-20">
        <h1 className="text-xl font-bold">KATEGORI PRODUK</h1>
        <div className="flex gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Search className="w-5 h-5" />
          </button>
          <Link
            to={createPageUrl("Cart")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Categories List */}
      <div className="px-4 py-2">
        <div className="space-y-2">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={createPageUrl(category.link)}
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg group"
            >
              <span className="font-bold text-sm uppercase">
                {category.name}
              </span>
              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
