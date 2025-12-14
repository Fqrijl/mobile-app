import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileHeader({ cartCount = 0, onSearchClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const categories = [
    { name: "Kategori Produk", href: "Categories" },
    { name: "Pria", href: "Catalog?category=men" },
    { name: "Wanita", href: "Catalog?category=women" },
    { name: "Unisex", href: "Catalog?category=unisex" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => setMenuOpen(true)} className="p-2 -ml-2">
            <Menu className="w-5 h-5" />
          </button>

          <Link to={createPageUrl("Home")} className="flex items-center">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693bb578fd5dcc2453d52f7f/242f0b179_image.png"
              alt="Aerosteet"
              className="h-8"
            />
          </Link>

          <div className="flex items-center gap-1">
            <button onClick={onSearchClick} className="p-2">
              <Search className="w-5 h-5" />
            </button>
            <Link to={createPageUrl("Cart")} className="p-2 relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 overflow-y-auto"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <span className="font-bold text-lg tracking-wider">MENU</span>
                <button onClick={() => setMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-4 space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={createPageUrl(cat.href)}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 px-2 text-sm font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}

                <div className="border-t my-4" />

                <Link
                  to={createPageUrl("SizeGuide")}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 px-2 text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  Size Guide
                </Link>
                <Link
                  to={createPageUrl("FindYourSize")}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 px-2 text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  Find Your Size
                </Link>

                <div className="border-t my-4" />

                <Link
                  to={createPageUrl("Account")}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-2 text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  Akun Saya
                </Link>
                <Link
                  to={createPageUrl("Orders")}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 px-2 text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  Pesanan Saya
                </Link>
                <Link
                  to={createPageUrl("Chat")}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 px-2 text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  Chat Admin
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
