import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  TrendingUp,
  Menu,
  X,
  Loader2,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import DashboardStats from "@/components/admin/DashboardStats";
import ProductManagement from "@/components/admin/ProductManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import UserManagement from "@/components/admin/UserManagement";
import MessageManagement from "@/components/admin/MessageManagement";
import FlashSaleManagement from "@/components/admin/FlashSaleManagement";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    base44.auth
      .me()
      .then(setUser)
      .catch(() => {
        base44.auth.redirectToLogin();
      });
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
        <p className="text-gray-600">
          Anda tidak memiliki akses ke halaman admin
        </p>
      </div>
    );
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Produk", icon: Package },
    { id: "flashsale", label: "Flash Sale", icon: Zap },
    { id: "orders", label: "Pesanan", icon: ShoppingBag },
    { id: "users", label: "Users", icon: Users },
    { id: "messages", label: "Pesan", icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed lg:sticky top-0 left-0 h-screen w-64 bg-black text-white z-40 overflow-y-auto"
          >
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-1">AEROSTREET</h1>
              <p className="text-sm text-gray-400">Admin Dashboard</p>
            </div>

            <nav className="px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                      activeTab === item.id
                        ? "bg-white text-black"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-6 mt-auto">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm font-medium mb-1">{user.full_name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-8">
          <div className="mb-6 lg:mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold">
              {menuItems.find((m) => m.id === activeTab)?.label}
            </h2>
          </div>

          {activeTab === "dashboard" && <DashboardStats />}
          {activeTab === "products" && <ProductManagement />}
          {activeTab === "flashsale" && <FlashSaleManagement />}
          {activeTab === "orders" && <OrderManagement />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "messages" && <MessageManagement />}
        </div>
      </main>
    </div>
  );
}
