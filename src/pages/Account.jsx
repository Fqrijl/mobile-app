import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  User,
  Package,
  MapPin,
  Heart,
  HelpCircle,
  LogOut,
  ChevronRight,
  Ruler,
  MessageCircle,
  Settings,
  Bell,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Account() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth
      .me()
      .then(setUser)
      .catch(() => {});
  }, []);

  const menuItems = [
    {
      title: "Pesanan Saya",
      icon: Package,
      href: "Orders",
      description: "Lihat status pesanan",
    },
    {
      title: "Alamat Tersimpan",
      icon: MapPin,
      href: "Account",
      description: "Kelola alamat pengiriman",
    },
    {
      title: "Wishlist",
      icon: Heart,
      href: "Account",
      description: "Produk favorit",
    },
    {
      title: "Size Guide",
      icon: Ruler,
      href: "SizeGuide",
      description: "Panduan ukuran",
    },
    {
      title: "Chat Admin",
      icon: MessageCircle,
      href: "Chat",
      description: "Bantuan customer service",
    },
    {
      title: "Pusat Bantuan",
      icon: HelpCircle,
      href: "Account",
      description: "FAQ & Panduan",
    },
  ];

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Selamat Datang</h2>
        <p className="text-gray-500 text-center mb-8">
          Login untuk menikmati pengalaman belanja yang lebih baik
        </p>
        <button
          onClick={() => base44.auth.redirectToLogin()}
          className="w-full bg-black text-white py-4 rounded-full font-medium"
        >
          Login / Daftar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">
              {user.full_name?.[0] || user.email?.[0] || "U"}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold">{user.full_name || "User"}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-xl shadow-lg p-4 grid grid-cols-3 gap-4">
          <Link
            to={createPageUrl("Orders?tab=pending")}
            className="text-center"
          >
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-gray-500">Belum Bayar</p>
          </Link>
          <Link
            to={createPageUrl("Orders?tab=shipped")}
            className="text-center border-x"
          >
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-gray-500">Dikirim</p>
          </Link>
          <Link
            to={createPageUrl("Orders?tab=delivered")}
            className="text-center"
          >
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-gray-500">Selesai</p>
          </Link>
        </div>
      </div>

      {/* Admin Dashboard Link */}
      {user.role === "admin" && (
        <div className="px-4 pt-6">
          <Link
            to={createPageUrl("AdminDashboard")}
            className="flex items-center gap-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-4 shadow-lg"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">Dashboard Admin</h3>
              <p className="text-xs text-purple-100">Kelola toko & pesanan</p>
            </div>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      )}

      {/* Menu Items */}
      <div className="px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={createPageUrl(item.href)}
                className="flex items-center gap-4 bg-white rounded-xl p-4 border"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Settings & Logout */}
        <div className="mt-6 space-y-2">
          <Link
            to={createPageUrl("Account")}
            className="flex items-center gap-4 bg-white rounded-xl p-4 border"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Pengaturan</h3>
              <p className="text-xs text-gray-500">Notifikasi & preferensi</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <button
            onClick={() => base44.auth.logout()}
            className="flex items-center gap-4 w-full bg-white rounded-xl p-4 border text-left"
          >
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-red-500">Logout</h3>
              <p className="text-xs text-gray-500">Keluar dari akun</p>
            </div>
          </button>
        </div>

        {/* App Version */}
        <p className="text-center text-xs text-gray-400 mt-8">Version 1.0.0</p>
      </div>
    </div>
  );
}
