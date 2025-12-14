import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  MapPin,
  Truck,
  CreditCard,
  Loader2,
  ChevronRight,
  Plus,
  Edit2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import AddressForm from "@/checkout/AddressForm";

const courierOptions = [
  { id: "regular", name: "Regular", price: 15000, eta: "3-5 hari" },
  { id: "express", name: "Express", price: 25000, eta: "1-2 hari" },
  { id: "cargo", name: "Cargo", price: 10000, eta: "5-7 hari" },
];

const paymentMethods = [
  { id: "bank_transfer", name: "Transfer Bank", icon: CreditCard },
  { id: "va", name: "Virtual Account", icon: CreditCard },
  { id: "qris", name: "QRIS", icon: CreditCard },
  { id: "ewallet", name: "E-Wallet", icon: CreditCard },
  { id: "pay_later", name: "Pay Later", icon: CreditCard },
  { id: "cod", name: "COD", icon: Truck },
];

export default function Checkout() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState("regular");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth
      .me()
      .then((userData) => {
        setUser(userData);
        const userAddresses = userData.shipping_addresses || [];
        setAddresses(userAddresses);
        if (userAddresses.length > 0) {
          setSelectedAddress(userAddresses[0]);
        }
      })
      .catch(() => {});
  }, []);

  const { data: cart } = useQuery({
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

  const selectedCartItems = JSON.parse(
    localStorage.getItem("selectedCartItems") || "[]"
  );
  const checkoutItems =
    cart?.items?.filter((_, i) => selectedCartItems.includes(i)) || [];
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingCost =
    courierOptions.find((c) => c.id === selectedCourier)?.price || 0;
  const total = subtotal + shippingCost;

  const saveAddress = async (addressData) => {
    const newAddresses = editingAddress
      ? addresses.map((a) => (a === selectedAddress ? addressData : a))
      : [...addresses, addressData];

    await base44.auth.updateMe({ shipping_addresses: newAddresses });
    setAddresses(newAddresses);
    setSelectedAddress(addressData);
    setAddressFormOpen(false);
    setEditingAddress(null);
    toast.success(editingAddress ? "Alamat diperbarui" : "Alamat ditambahkan");
  };

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const orderNumber = `ORD${Date.now()}`;
      const paymentDeadline = new Date();
      paymentDeadline.setHours(paymentDeadline.getHours() + 24);

      const orderData = {
        order_number: orderNumber,
        user_email: user.email,
        items: checkoutItems,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        total: total,
        shipping_address: selectedAddress,
        courier: selectedCourier,
        payment_method: selectedPayment,
        payment_deadline: paymentDeadline.toISOString(),
      };

      const order = await base44.entities.Order.create(orderData);

      const remainingItems = cart.items.filter(
        (_, i) => !selectedCartItems.includes(i)
      );
      const remainingTotal = remainingItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      await base44.entities.Cart.update(cart.id, {
        items: remainingItems,
        total: remainingTotal,
      });
      localStorage.removeItem("selectedCartItems");

      return order;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      navigate(createPageUrl(`Payment?orderId=${order.id}`));
    },
    onError: () => {
      toast.error("Gagal membuat pesanan");
    },
  });

  const handleCheckout = () => {
    if (!selectedAddress) {
      toast.error("Masukkan alamat pengiriman");
      return;
    }
    if (!selectedPayment) {
      toast.error("Pilih metode pembayaran");
      return;
    }
    if (!confirm("Apakah Anda yakin ingin melanjutkan pembayaran?")) {
      return;
    }
    createOrderMutation.mutate();
  };

  if (!cart || checkoutItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Tidak ada item yang dipilih</p>
        <Link to={createPageUrl("Cart")} className="text-black underline">
          Kembali ke Keranjang
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-40">
      <div className="px-4 py-4 space-y-4">
        <h1 className="text-xl font-bold">Checkout</h1>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl border p-4">
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Alamat Pengiriman
          </h2>

          {selectedAddress ? (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedAddress.name}</p>
                <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedAddress.address}
                </p>
                {selectedAddress.detail && (
                  <p className="text-sm text-gray-600">
                    {selectedAddress.detail}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  {selectedAddress.district}, {selectedAddress.city},{" "}
                  {selectedAddress.province} {selectedAddress.postal_code}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingAddress(selectedAddress);
                    setAddressFormOpen(true);
                  }}
                  className="flex-1 py-2 border rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Ubah
                </button>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressFormOpen(true);
                  }}
                  className="flex-1 py-2 border rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Baru
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditingAddress(null);
                setAddressFormOpen(true);
              }}
              className="w-full py-3 border-2 border-dashed rounded-lg text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Tambah Alamat Pengiriman
            </button>
          )}

          <Sheet open={addressFormOpen} onOpenChange={setAddressFormOpen}>
            <SheetContent
              side="bottom"
              className="h-[90vh] rounded-t-3xl overflow-y-auto"
            >
              <SheetHeader className="mb-4">
                <SheetTitle>
                  {editingAddress ? "Ubah Alamat" : "Tambah Alamat Baru"}
                </SheetTitle>
              </SheetHeader>
              <AddressForm
                initialData={editingAddress}
                onSave={saveAddress}
                onCancel={() => {
                  setAddressFormOpen(false);
                  setEditingAddress(null);
                }}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Courier */}
        <div className="bg-white rounded-xl border p-4">
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Kurir
          </h2>
          <div className="space-y-2">
            {courierOptions.map((courier) => (
              <button
                key={courier.id}
                onClick={() => setSelectedCourier(courier.id)}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  selectedCourier === courier.id
                    ? "border-black bg-gray-50"
                    : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{courier.name}</p>
                    <p className="text-xs text-gray-500">
                      Estimasi {courier.eta}
                    </p>
                  </div>
                  <p className="font-medium">
                    Rp {courier.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl border p-4">
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Metode Pembayaran
          </h2>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  selectedPayment === method.id ? "border-black bg-gray-50" : ""
                }`}
              >
                <p className="font-medium">{method.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl border p-4">
          <h2 className="font-bold mb-3">
            Ringkasan Pesanan ({checkoutItems.length} item)
          </h2>
          <div className="space-y-3">
            {checkoutItems.map((item, index) => (
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.size} • x{item.quantity}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Ongkir</span>
            <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={createOrderMutation.isPending}
          className="w-full bg-black text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {createOrderMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Bayar Sekarang"
          )}
        </button>
      </div>
    </div>
  );
}
