import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const banners = [
  {
    id: 1,
    title: "NEW COLLECTION",
    subtitle: "Spring/Summer 2024",
    cta: "Lihat Koleksi",
    href: "Catalog?type=New Arrival",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
    overlay: "from-black/60",
  },
  {
    id: 2,
    title: "BEST SELLER",
    subtitle: "Produk Terlaris Minggu Ini",
    cta: "Belanja Sekarang",
    href: "Catalog?bestseller=true",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800",
    overlay: "from-black/50",
  },
  {
    id: 3,
    title: "PROMO BUNDLING",
    subtitle: "Hemat hingga 40%",
    cta: "Lihat Promo",
    href: "Catalog?type=Promo Bundling",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
    overlay: "from-black/60",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative h-[70vh] min-h-[400px] max-h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={banners[current].image}
            alt={banners[current].title}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${banners[current].overlay} to-transparent`}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-end pb-16 px-6">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-white"
        >
          <h2 className="text-3xl font-bold tracking-wider mb-2">
            {banners[current].title}
          </h2>
          <p className="text-sm text-white/80 mb-4">
            {banners[current].subtitle}
          </p>
          <Link
            to={createPageUrl(banners[current].href)}
            className="inline-block bg-white text-black px-6 py-3 text-sm font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
            {banners[current].cta}
          </Link>
        </motion.div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all ${
              i === current ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
