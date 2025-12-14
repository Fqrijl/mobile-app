import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Copy,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Home,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import moment from "moment";

export default function Payment() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedEwallet, setSelectedEwallet] = useState("");
  const [selectedPayLater, setSelectedPayLater] = useState("");

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
    toast.success("Disalin ke clipboard");
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

  const deadline = order.payment_deadline
    ? new Date(order.payment_deadline)
    : null;
  const isExpired = deadline && new Date() > deadline;
  const isPaid = order.payment_status === "paid";

  const paymentInfo = {
    bank_transfer: {
      title: "Transfer Bank",
      instructions: [
        "Transfer ke rekening berikut:",
        "Bank: BCA",
        "No. Rekening: 1234567890",
        "Atas Nama: PT Brand Fashion",
        `Jumlah: Rp ${order.total?.toLocaleString("id-ID")}`,
      ],
    },
    va: {
      title: "Virtual Account",
      instructions: [
        "Nomor Virtual Account:",
        "8806 1234 5678 9012",
        "Bank: BCA Virtual Account",
        `Jumlah: Rp ${order.total?.toLocaleString("id-ID")}`,
      ],
    },
    qris: {
      title: "QRIS",
      instructions: [
        "Scan QR Code di bawah ini menggunakan aplikasi e-wallet atau mobile banking Anda",
      ],
    },
    ewallet: {
      title: "E-Wallet",
      instructions: [
        "Buka aplikasi e-wallet Anda",
        "Pilih menu pembayaran",
        "Scan QR Code atau masukkan nomor: 081234567890",
        `Jumlah: Rp ${order.total?.toLocaleString("id-ID")}`,
      ],
    },
    cod: {
      title: "Cash on Delivery",
      instructions: [
        "Siapkan uang pas saat barang tiba",
        `Total yang harus dibayar: Rp ${order.total?.toLocaleString("id-ID")}`,
        "Pembayaran dilakukan kepada kurir",
      ],
    },
  };

  const currentPayment =
    paymentInfo[order.payment_method] || paymentInfo.bank_transfer;

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 py-6 space-y-6">
        {/* Status */}
        <div className="text-center">
          {isPaid ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-xl font-bold text-green-600 mb-2">
                Pembayaran Berhasil
              </h1>
              <p className="text-gray-500">Pesanan Anda sedang diproses</p>
            </>
          ) : isExpired ? (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-xl font-bold text-red-600 mb-2">
                Pembayaran Kedaluwarsa
              </h1>
              <p className="text-gray-500">Silakan buat pesanan baru</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-yellow-500" />
              </div>
              <h1 className="text-xl font-bold mb-2">Menunggu Pembayaran</h1>
              {deadline && (
                <p className="text-gray-500">
                  Batas waktu: {moment(deadline).format("DD MMM YYYY, HH:mm")}
                </p>
              )}
            </>
          )}
        </div>

        {/* Order Info */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">No. Pesanan</span>
            <button
              onClick={() => copyToClipboard(order.order_number)}
              className="flex items-center gap-1 font-medium"
            >
              {order.order_number}
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Metode</span>
            <span className="font-medium">{currentPayment.title}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-lg">
              Rp {order.total?.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Payment Instructions */}
        {!isPaid && !isExpired && (
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-medium mb-4">Instruksi Pembayaran</h3>
            <ul className="space-y-3">
              {currentPayment.instructions.map((instruction, index) => (
                <li key={index} className="text-sm text-gray-600 flex gap-2">
                  <span className="font-medium text-black">{index + 1}.</span>
                  {instruction}
                </li>
              ))}
            </ul>

            {order.payment_method === "qris" && (
              <div className="mt-4 flex justify-center">
                <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400 text-sm">QR Code</span>
                </div>
              </div>
            )}

            {(order.payment_method === "va" ||
              order.payment_method === "bank_transfer") && (
              <button
                onClick={() => copyToClipboard("8806123456789012")}
                className="mt-4 w-full bg-gray-100 p-4 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-gray-500">
                    {order.payment_method === "va"
                      ? "Virtual Account"
                      : "No. Rekening"}
                  </p>
                  <p className="font-mono font-bold text-lg">
                    {order.payment_method === "va"
                      ? "8806 1234 5678 9012"
                      : "1234567890"}
                  </p>
                </div>
                <Copy className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-medium mb-3">Detail Pesanan</h3>
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={
                      item.product_image ||
                      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100"
                    }
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-1">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.size} • x{item.quantity}
                  </p>
                  <p className="text-sm font-medium">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to={createPageUrl("Home")}
            className="flex-1 py-4 rounded-full border text-center font-medium flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            to={createPageUrl(`OrderDetail?id=${order.id}`)}
            className="flex-1 py-4 rounded-full bg-black text-white text-center font-medium flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Lihat Pesanan
          </Link>
        </div>
      </div>
    </div>
  );
}
