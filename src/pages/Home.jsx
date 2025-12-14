import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryNavbar from "@/components/home/CategoryNavbar";
import ProductSection from "@/components/home/ProductSection";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("-created_date", 50),
  });

  const newArrivals = products.filter((p) => p.is_new_arrival);
  const bestSellers = products.filter((p) => p.is_bestseller);
  const recommended = products.slice(0, 8);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <HeroBanner />
      <CategoryNavbar />
      <CategoryGrid />
      <FlashSaleSection />

      <ProductSection
        title="Produk Terbaru"
        products={newArrivals.length > 0 ? newArrivals : products.slice(0, 4)}
        viewAllHref="Catalog?type=New Arrival"
      />

      <div className="h-px bg-gray-100 mx-4" />

      <ProductSection
        title="Best Seller"
        products={bestSellers.length > 0 ? bestSellers : products.slice(4, 8)}
        viewAllHref="Catalog?bestseller=true"
      />

      <div className="h-px bg-gray-100 mx-4" />

      <ProductSection
        title="Rekomendasi"
        products={recommended}
        viewAllHref="Catalog"
      />
    </div>
  );
}
