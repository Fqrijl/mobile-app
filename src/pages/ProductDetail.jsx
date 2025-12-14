import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ChevronLeft,
  Heart,
  Share2,
  Minus,
  Plus,
  Ruler,
  Check,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import ProductCard from "@/components/product/ProductCard";
import ReviewSection from "@/components/product/ReviewSection";

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [user, setUser] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth
      .me()
      .then(setUser)
      .catch(() => {});
  }, []);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const products = await base44.entities.Product.filter({ id: productId });
      return products[0];
    },
    enabled: !!productId,
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["related-products", product?.category],
    queryFn: async () => {
      if (!product?.category) return [];
      const products = await base44.entities.Product.filter({
        category: product.category,
      });
      return products.filter((p) => p.id !== productId).slice(0, 4);
    },
    enabled: !!product?.category,
  });

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

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!user?.email) {
        base44.auth.redirectToLogin();
        return;
      }

      const newItem = {
        product_id: product.id,
        product_name: product.name,
        product_image: product.images?.[0] || "",
        size: selectedSize,
        color: selectedColor?.name || "",
        quantity: quantity,
        price: product.price,
      };

      if (cart) {
        const existingIndex = cart.items?.findIndex(
          (item) =>
            item.product_id === product.id &&
            item.size === selectedSize &&
            item.color === selectedColor?.name
        );

        let newItems;
        if (existingIndex > -1) {
          newItems = [...cart.items];
          newItems[existingIndex].quantity += quantity;
        } else {
          newItems = [...(cart.items || []), newItem];
        }

        const total = newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        await base44.entities.Cart.update(cart.id, { items: newItems, total });
      } else {
        await base44.entities.Cart.create({
          user_email: user.email,
          items: [newItem],
          total: product.price * quantity,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Produk ditambahkan ke keranjang");
    },
  });

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Pilih ukuran terlebih dahulu");
      return;
    }
    addToCartMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Produk tidak ditemukan</p>
        <Link to={createPageUrl("Catalog")} className="text-black underline">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images
      : ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"];

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  return (
    <div className="pb-24">
      {/* Image Gallery */}
      <div className="relative">
        <div className="aspect-square bg-gray-100">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentImage ? "bg-black" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* Top Actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Link
            to={createPageUrl("Catalog")}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-4 left-16 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            -{discount}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 py-5">
        <h1 className="text-xl font-bold mb-2">{product.name}</h1>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold">
            Rp {product.price?.toLocaleString("id-ID")}
          </span>
          {product.original_price && (
            <span className="text-gray-400 line-through">
              Rp {product.original_price?.toLocaleString("id-ID")}
            </span>
          )}
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-5">
            <h3 className="text-sm font-medium mb-3">
              Warna: {selectedColor?.name || "Pilih warna"}
            </h3>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor?.name === color.name
                      ? "border-black scale-110"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">
              Ukuran: {selectedSize || "Pilih ukuran"}
            </h3>
            <div className="flex gap-3">
              <Link
                to={createPageUrl("FindYourSize")}
                className="text-sm text-gray-500 flex items-center gap-1 underline"
              >
                <Ruler className="w-4 h-4" />
                Find Your Size
              </Link>
              <Sheet open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
                <SheetTrigger asChild>
                  <button className="text-sm text-gray-500 flex items-center gap-1 underline">
                    <Ruler className="w-4 h-4" />
                    Size Guide
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
                  <SheetHeader className="pb-4">
                    <SheetTitle>Panduan Ukuran</SheetTitle>
                  </SheetHeader>

                  <div className="space-y-6 overflow-y-auto">
                    {product.size_chart && product.size_chart.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="py-3 px-4 text-left font-medium">
                                Ukuran
                              </th>
                              <th className="py-3 px-4 text-left font-medium">
                                Dada (cm)
                              </th>
                              <th className="py-3 px-4 text-left font-medium">
                                Panjang (cm)
                              </th>
                              <th className="py-3 px-4 text-left font-medium">
                                Bahu (cm)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.size_chart.map((row) => (
                              <tr key={row.size} className="border-b">
                                <td className="py-3 px-4 font-medium">
                                  {row.size}
                                </td>
                                <td className="py-3 px-4">{row.chest}</td>
                                <td className="py-3 px-4">{row.length}</td>
                                <td className="py-3 px-4">{row.shoulder}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="py-3 px-4 text-left font-medium">
                              Ukuran
                            </th>
                            <th className="py-3 px-4 text-left font-medium">
                              Dada (cm)
                            </th>
                            <th className="py-3 px-4 text-left font-medium">
                              Panjang (cm)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">S</td>
                            <td className="py-3 px-4">48</td>
                            <td className="py-3 px-4">68</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">M</td>
                            <td className="py-3 px-4">50</td>
                            <td className="py-3 px-4">70</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">L</td>
                            <td className="py-3 px-4">52</td>
                            <td className="py-3 px-4">72</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">XL</td>
                            <td className="py-3 px-4">54</td>
                            <td className="py-3 px-4">74</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">XXL</td>
                            <td className="py-3 px-4">56</td>
                            <td className="py-3 px-4">76</td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-medium mb-2">Cara Mengukur</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>
                          • <strong>Dada:</strong> Ukur keliling dada terlebar
                        </li>
                        <li>
                          • <strong>Panjang:</strong> Ukur dari bahu hingga
                          bawah
                        </li>
                        <li>
                          • <strong>Bahu:</strong> Ukur dari ujung bahu ke ujung
                          bahu
                        </li>
                      </ul>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {(product.sizes || ["S", "M", "L", "XL", "XXL"]).map((size) => {
              const stock = product.stock?.[size] ?? 10;
              const inStock = stock > 0;

              return (
                <button
                  key={size}
                  onClick={() => inStock && setSelectedSize(size)}
                  disabled={!inStock}
                  className={`min-w-[48px] h-12 px-4 rounded-lg text-sm font-medium transition-all relative ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : inStock
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {size}
                  {selectedSize === size && (
                    <Check className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Jumlah</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full border flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-medium w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full border flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Deskripsi</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description ||
                "Produk berkualitas tinggi dengan bahan premium yang nyaman dipakai sehari-hari."}
            </p>
          </div>

          {product.material && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Bahan</h3>
              <p className="text-sm text-gray-600">{product.material}</p>
            </div>
          )}

          {product.care_instructions && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Perawatan</h3>
              <p className="text-sm text-gray-600">
                {product.care_instructions}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection productId={product.id} productName={product.name} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="px-4 py-6 border-t">
          <h3 className="font-bold mb-4">Produk Serupa</h3>
          <div className="grid grid-cols-2 gap-4">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4 flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending}
          className="flex-1 bg-black text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {addToCartMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Tambah ke Keranjang"
          )}
        </button>
      </div>
    </div>
  );
}
