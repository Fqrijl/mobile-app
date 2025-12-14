import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Package, Truck, CheckCircle, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => base44.entities.Order.list("-created_date"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      await base44.entities.Order.update(orderId, { order_status: status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Status order berhasil diupdate");
    },
  });

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.order_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      processing: {
        label: "Diproses",
        color: "bg-blue-100 text-blue-800",
        icon: Package,
      },
      shipped: {
        label: "Dikirim",
        color: "bg-purple-100 text-purple-800",
        icon: Truck,
      },
      delivered: {
        label: "Terkirim",
        color: "bg-teal-100 text-teal-800",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Dibatalkan",
        color: "bg-red-100 text-red-800",
        icon: Clock,
      },
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}
      >
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Cari order ID atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Diproses</SelectItem>
            <SelectItem value="shipped">Dikirim</SelectItem>
            <SelectItem value="delivered">Terkirim</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold">Order #{order.order_number}</h3>
                  {getStatusBadge(order.order_status)}
                </div>
                <p className="text-sm text-gray-600">{order.user_email}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.created_date).toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select
                  value={order.order_status}
                  onValueChange={(status) =>
                    updateStatusMutation.mutate({ orderId: order.id, status })
                  }
                  disabled={updateStatusMutation.isPending}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Diproses</SelectItem>
                    <SelectItem value="shipped">Dikirim</SelectItem>
                    <SelectItem value="delivered">Terkirim</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Items:</h4>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-sm">
                    <div className="w-12 h-12 bg-gray-100 rounded">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-gray-500">
                        {item.size} • {item.color} • x{item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="font-bold">Total:</span>
                <span className="text-xl font-bold">
                  Rp {order.total?.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {order.shipping_address && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Alamat Pengiriman:</h4>
                <p className="text-sm text-gray-600">
                  {order.shipping_address.address}
                  <br />
                  {order.shipping_address.city},{" "}
                  {order.shipping_address.province}
                  <br />
                  {order.shipping_address.postal_code}
                </p>
              </div>
            )}
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Tidak ada order ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
