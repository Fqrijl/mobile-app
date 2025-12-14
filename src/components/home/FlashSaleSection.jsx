import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Zap, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FlashSaleSection() {
  const { data: flashSales = [] } = useQuery({
    queryKey: ["flash-sales"],
    queryFn: async () => {
      const sales = await base44.entities.FlashSale.filter({ is_active: true });
      const now = new Date().toISOString();
      return sales.filter(
        (sale) =>
          sale.start_date <= now &&
          sale.end_date >= now &&
          sale.stock_available > sale.stock_sold
      );
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ["flash-sale-products", flashSales],
    queryFn: async () => {
      if (flashSales.length === 0) return [];
      const productIds = flashSales.map((s) => s.product_id);
      const allProducts = await base44.entities.Product.list();
      return allProducts.filter((p) => productIds.includes(p.id));
    },
    enabled: flashSales.length > 0,
  });

  if (flashSales.length === 0 || products.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-red-500 via-red-600 to-pink-600 text-white py-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Zap className="w-5 h-5 fill-yellow-300 text-yellow-300" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Flash Sale</h2>
            <p className="text-xs text-white/80">Diskon hingga 70%</p>
          </div>
        </div>
        <CountdownTimer endDate={flashSales[0]?.end_date} />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {products.map((product, idx) => {
          const flashSale = flashSales.find((s) => s.product_id === product.id);
          if (!flashSale) return null;

          const discount =
            flashSale.discount_percentage ||
            Math.round((1 - flashSale.flash_price / product.price) * 100);
          const soldPercentage =
            (flashSale.stock_sold / flashSale.stock_available) * 100;

          return (
            <Link
              key={product.id}
              to={createPageUrl("ProductDetail") + "?id=" + product.id}
              className="flex-shrink-0 w-36"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl overflow-hidden"
              >
                <div className="relative aspect-square">
                  <img
                    src={
                      product.images?.[0] ||
                      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    -{discount}%
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-600 truncate mb-1">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm font-bold text-red-500">
                      Rp {flashSale.flash_price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Terjual {flashSale.stock_sold}</span>
                      <span>{Math.round(soldPercentage)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-red-500"
                        style={{ width: `${soldPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function CountdownTimer({ endDate }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4" />
      <div className="flex items-center gap-1 font-mono font-bold">
        <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span>:</span>
        <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span>:</span>
        <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
