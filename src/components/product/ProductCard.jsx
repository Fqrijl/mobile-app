import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function ProductCard({ product, index = 0 }) {
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={createPageUrl(`ProductDetail?id=${product.id}`)}
        className="block group"
      >
        <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative">
          <img
            src={
              product.images?.[0] ||
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
            }
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.is_new_arrival && (
            <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 rounded-full font-medium">
              NEW
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-medium">
              -{discount}%
            </span>
          )}
        </div>

        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-medium line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">
              Rp {product.price?.toLocaleString("id-ID")}
            </span>
            {product.original_price && (
              <span className="text-xs text-gray-400 line-through">
                Rp {product.original_price?.toLocaleString("id-ID")}
              </span>
            )}
          </div>
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 pt-1">
              {product.colors.slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-gray-400">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
