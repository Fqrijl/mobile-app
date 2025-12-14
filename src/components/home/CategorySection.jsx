import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const categories = [
  {
    name: "MEN",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    href: "Categories",
  },
  {
    name: "WOMEN",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    href: "Categories",
  },
  {
    name: "UNISEX",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    href: "Categories",
  },
];

export default function CategorySection() {
  return (
    <section className="px-4 py-8">
      <h2 className="text-lg font-bold mb-4">Kategori</h2>
      <div className="grid grid-cols-3 gap-3">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={createPageUrl(cat.href)} className="block group">
              <div className="aspect-square rounded-xl overflow-hidden relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white font-semibold text-sm">
                  {cat.name}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
