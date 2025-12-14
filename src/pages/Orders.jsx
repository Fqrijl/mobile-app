import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import moment from "moment";

const statusConfig = {
  pending: {
    label: "Menunggu Pembayaran",
    color: "bg-yellow-100 text-yellow-700",
  },
  processing: { label: "Diproses", color: "bg-blue-100 text-blue-700" },
  shipped: { label: "Dikirim", color: "bg-purple-100 text-purple-700" },
  delivered: { label: "Selesai", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-700" },
};

export default function Orders() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    base44.auth
      .me()
      .then(setUser)
      .catch(() => {});
  }, []);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return base44.entities.Order.filter(
        { user_email: user.email },
        "-created_date"
      );
    },
    enabled: !!user?.email,
  });

  const tabs = [
    { id: "all", label: "Semua" },
    { id: "pending", label: "Belum Bayar" },
    { id: "processing", label: "Diproses" },
    { id: "shipped", label: "Dikirim" },
    { id: "delivered", label: "Selesai" },
  ];

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((o) => o.order_status === activeTab);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-lg font-bold mb-2">Login untuk melihat pesanan</h2>
        <button
          onClick={() => base44.auth.redirectToLogin()}
          className="bg-black text-white px-8 py-3 rounded-full font-medium mt-4"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="px-4 py-4">
        <h1 className="text-xl font-bold mb-4">Pesanan Saya</h1>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada pesanan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link
                key={order.id}
                to={createPageUrl(`OrderDetail?id=${order.id}`)}
                className="block bg-white rounded-xl border p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500">
                      {moment(order.created_date).format("DD MMM YYYY")}
                    </p>
                    <p className="text-sm font-medium">{order.order_number}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusConfig[order.order_status]?.color || "bg-gray-100"
                    }`}
                  >
                    {statusConfig[order.order_status]?.label ||
                      order.order_status}
                  </span>
                </div>

                <div className="flex gap-3 mb-3">
                  {order.items?.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={
                          item.product_image ||
                          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100"
                        }
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-bold">
                      Rp {order.total?.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
