import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronRight } from "lucide-react";
import ProductCard from "../product/ProductCard";

export default function ProductSection({ title, products, viewAllHref }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        {viewAllHref && (
          <Link
            to={createPageUrl(viewAllHref)}
            className="text-sm text-gray-500 flex items-center hover:text-black transition-colors"
          >
            Lihat Semua
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {products.slice(0, 8).map((product, index) => (
          <div key={product.id} className="flex-shrink-0 w-40">
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
