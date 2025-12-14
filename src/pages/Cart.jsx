import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Cart() {
  const [user, setUser] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth
      .me()
      .then(setUser)
      .catch(() => {});
  }, []);

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const carts = await base44.entities.Cart.filter({
        user_email: user.email,
      });
      return carts[0] || null;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (cart?.items) {
      setSelectedItems(cart.items.map((_, i) => i));
    }
  }, [cart?.items]);

  const updateCartMutation = useMutation({
    mutationFn: async ({ items, total }) => {
      await base44.entities.Cart.update(cart.id, { items, total });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const toggleSelectItem = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((i) => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart?.items?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart?.items?.map((_, i) => i) || []);
    }
  };

  const selectedTotal =
    cart?.items
      ?.filter((_, i) => selectedItems.includes(i))
      .reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  const updateQuantity = (index, delta) => {
    const newItems = [...cart.items];
    newItems[index].quantity = Math.max(1, newItems[index].quantity + delta);
    const total = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    updateCartMutation.mutate({ items: newItems, total });
  };

  const removeItem = (index) => {
    const newItems = cart.items.filter((_, i) => i !== index);
    const total = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSelectedItems(
      selectedItems
        .filter((i) => i < index || i > index)
        .map((i) => (i > index ? i - 1 : i))
    );
    updateCartMutation.mutate({ items: newItems, total });
    toast.success("Produk dihapus dari keranjang");
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-lg font-bold mb-2">Keranjang Kosong</h2>
        <p className="text-gray-500 text-center mb-6">
          Silakan login untuk melihat keranjang belanja Anda
        </p>
        <button
          onClick={() => base44.auth.redirectToLogin()}
          className="bg-black text-white px-8 py-3 rounded-full font-medium"
        >
          Login
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-lg font-bold mb-2">Keranjang Kosong</h2>
        <p className="text-gray-500 text-center mb-6">
          Yuk, mulai belanja dan temukan produk favoritmu!
        </p>
        <Link
          to={createPageUrl("Catalog")}
          className="bg-black text-white px-8 py-3 rounded-full font-medium"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-40">
      <div className="px-4 py-4">
        <h1 className="text-xl font-bold mb-4">Keranjang</h1>

        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            checked={selectedItems.length === cart.items.length}
            onChange={toggleSelectAll}
            className="w-5 h-5"
          />
          <span className="text-sm font-medium">Pilih Semua</span>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {cart.items.map((item, index) => (
              <motion.div
                key={`${item.product_id}-${item.size}-${item.color}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-xl border p-4"
              >
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(index)}
                    onChange={() => toggleSelectItem(index)}
                    className="w-5 h-5 mt-1"
                  />
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={
                        item.product_image ||
                        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100"
                      }
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">
                      {item.product_name}
                    </h3>
                    <div className="flex gap-2 text-xs text-gray-500 mb-2">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>• {item.color}</span>}
                    </div>
                    <p className="font-bold text-sm">
                      Rp {item.price?.toLocaleString("id-ID")}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(index, -1)}
                          className="w-8 h-8 rounded-full border flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(index, 1)}
                          className="w-8 h-8 rounded-full border flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Summary */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            {selectedItems.length} item dipilih
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-2xl font-bold">
            Rp {selectedTotal.toLocaleString("id-ID")}
          </span>
        </div>
        <Link
          to={selectedItems.length > 0 ? createPageUrl("Checkout") : "#"}
          onClick={(e) => {
            if (selectedItems.length === 0) {
              e.preventDefault();
              toast.error("Pilih minimal 1 produk");
            } else {
              localStorage.setItem(
                "selectedCartItems",
                JSON.stringify(selectedItems)
              );
            }
          }}
          className={`block w-full text-center py-4 rounded-full font-medium flex items-center justify-center gap-2 ${
            selectedItems.length > 0
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          Checkout ({selectedItems.length})
        </Link>
      </div>
    </div>
  );
}
