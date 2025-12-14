import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Search, ShoppingBag, User, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNav({ cartCount = 0 }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: Home, label: "Home", page: "Home" },
    { icon: Search, label: "Katalog", page: "Catalog" },
    { icon: ShoppingBag, label: "Keranjang", page: "Cart", badge: cartCount },
    { icon: MessageCircle, label: "Chat", page: "Chat" },
    { icon: User, label: "Akun", page: "Account" },
  ];

  const isActive = (page) => {
    return currentPath.toLowerCase().includes(page.toLowerCase());
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.page);
          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              <div className="relative">
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    active ? "text-black" : "text-gray-400"
                  }`}
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 transition-colors ${
                  active ? "text-black font-medium" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-black rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
