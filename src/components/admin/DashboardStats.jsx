import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  DollarSign,
  Users,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardStats() {
  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => base44.entities.Order.list("-created_date", 100),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => base44.entities.Product.list(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => base44.entities.Review.list(),
  });

  // Calculate stats
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.created_date).toDateString() === today
  );

  // Best selling products
  const productSales = {};
  orders.forEach((order) => {
    order.items?.forEach((item) => {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = {
          name: item.product_name,
          quantity: 0,
          revenue: 0,
        };
      }
      productSales[item.product_id].quantity += item.quantity;
      productSales[item.product_id].revenue += item.price * item.quantity;
    });
  });

  const bestSellers = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Daily orders for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  });

  const dailyOrdersData = last7Days.map((day, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - idx));
    const dateStr = date.toDateString();
    const dayOrders = orders.filter(
      (o) => new Date(o.created_date).toDateString() === dateStr
    );
    return {
      day,
      orders: dayOrders.length,
      revenue: dayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
    };
  });

  const statCards = [
    {
      title: "Total Penjualan",
      value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Total Order",
      value: orders.length,
      subtitle: `${todayOrders.length} hari ini`,
      icon: ShoppingBag,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Total Produk",
      value: products.length,
      icon: Package,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Total User",
      value: users.length,
      icon: Users,
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} text-white rounded-xl p-6 shadow-lg`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium mb-1 opacity-90">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-xs mt-2 opacity-80">{stat.subtitle}</p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Orders Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">
            Order Harian (7 Hari Terakhir)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyOrdersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#000"
                strokeWidth={2}
                dot={{ fill: "#000", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Revenue Harian</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyOrdersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#000" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Produk Terlaris
        </h3>
        <div className="space-y-3">
          {bestSellers.map((product, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-300">
                  #{idx + 1}
                </span>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.quantity} terjual
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">
                  Rp {product.revenue.toLocaleString("id-ID")}
                </p>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Review Terbaru</h3>
        <div className="space-y-3">
          {reviews.slice(0, 5).map((review) => (
            <div
              key={review.id}
              className="flex gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">
                    {review.user_name}
                  </span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {review.product_name}
                </p>
                {review.comment && (
                  <p className="text-sm text-gray-700">{review.comment}</p>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {new Date(review.created_date).toLocaleDateString("id-ID")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
