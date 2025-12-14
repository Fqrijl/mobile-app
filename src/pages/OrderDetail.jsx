import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ChevronLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Copy,
  MapPin,
  MessageCircle,
  Loader2,
} from "lucide-react";
import moment from "moment";
import { toast } from "sonner";

const statusSteps = [
  { key: "pending", label: "Pesanan Dibuat", icon: Package },
  { key: "processing", label: "Diproses", icon: Package },
  { key: "shipped", label: "Dikirim", icon: Truck },
  { key: "delivered", label: "Selesai", icon: CheckCircle },
];

export default function OrderDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("id");
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const orders = await base44.entities.Order.filter({ id: orderId });
      return orders[0];
    },
    enabled: !!orderId,
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <p className="text-gray-500">Pesanan tidak ditemukan</p>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(
    (s) => s.key === order.order_status
  );

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-14 bg-white border-b z-10">
        <div className="flex items-center px-4 py-3">
          <Link to={createPageUrl("Orders")} className="mr-3">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold">Detail Pesanan</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Order Info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-gray-500">No. Pesanan</p>
              <button
                onClick={() => copyToClipboard(order.order_number)}
                className="flex items-center gap-1 font-medium"
              >
                {order.order_number}
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500">
              {moment(order.created_date).format("DD MMM YYYY, HH:mm")}
            </p>
          </div>
        </div>

        {/* Status Progress */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-medium mb-4">Status Pengiriman</h3>

          <div className="relative">
            {statusSteps.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.key} className="flex gap-4 pb-6 last:pb-0">
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive ? "bg-black" : "bg-gray-200"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-6 ${
                          index < currentStepIndex ? "bg-black" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        isActive ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && order.tracking_history?.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        {
                          order.tracking_history[
                            order.tracking_history.length - 1
                          ].description
                        }
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {order.tracking_number && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500 mb-1">No. Resi</p>
              <button
                onClick={() => copyToClipboard(order.tracking_number)}
                className="flex items-center gap-2 font-medium"
              >
                {order.tracking_number}
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Alamat Pengiriman</h3>
              <p className="text-sm font-medium">
                {order.shipping_address?.name}
              </p>
              <p className="text-sm text-gray-500">
                {order.shipping_address?.phone}
              </p>
              <p className="text-sm text-gray-500">
                {order.shipping_address?.address},{" "}
                {order.shipping_address?.city},{" "}
                {order.shipping_address?.province}{" "}
                {order.shipping_address?.postal_code}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-medium mb-3">Produk</h3>
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <Link
                key={index}
                to={createPageUrl(`ProductDetail?id=${item.product_id}`)}
                className="flex gap-3"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={
                      item.product_image ||
                      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150"
                    }
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-2">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.size} {item.color && `• ${item.color}`} • x
                    {item.quantity}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-medium mb-3">Ringkasan Pembayaran</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>Rp {order.subtotal?.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ongkir ({order.courier})</span>
              <span>Rp {order.shipping_cost?.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-bold">
              <span>Total</span>
              <span>Rp {order.total?.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {order.order_status === "pending" &&
          order.payment_status !== "paid" && (
            <Link
              to={createPageUrl(`Payment?orderId=${order.id}`)}
              className="block w-full bg-black text-white py-4 rounded-full font-medium text-center"
            >
              Bayar Sekarang
            </Link>
          )}

        <Link
          to={createPageUrl("Chat")}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-full border font-medium"
        >
          <MessageCircle className="w-5 h-5" />
          Chat Admin
        </Link>
      </div>
    </div>
  );
}
