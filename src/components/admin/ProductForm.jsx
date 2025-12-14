import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProductForm({ product, onSuccess }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    original_price: product?.original_price || "",
    category: product?.category || "men",
    subcategory: product?.subcategory || "",
    type: product?.type || "",
    description: product?.description || "",
    material: product?.material || "",
    care_instructions: product?.care_instructions || "",
    images: product?.images || [],
    sizes: product?.sizes || ["S", "M", "L", "XL", "XXL"],
    stock: product?.stock || { S: 10, M: 10, L: 10, XL: 10, XXL: 10 },
    is_bestseller: product?.is_bestseller || false,
    is_new_arrival: product?.is_new_arrival || false,
    weight: product?.weight || 250,
  });

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (product) {
        return await base44.entities.Product.update(product.id, data);
      } else {
        return await base44.entities.Product.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(
        product ? "Produk berhasil diupdate" : "Produk berhasil ditambahkan"
      );
      onSuccess();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      price: Number(formData.price),
      original_price: formData.original_price
        ? Number(formData.original_price)
        : undefined,
      weight: Number(formData.weight),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Nama Produk</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Harga</label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Harga Asli</label>
          <Input
            type="number"
            value={formData.original_price}
            onChange={(e) =>
              setFormData({ ...formData, original_price: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Kategori</label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Subkategori</label>
          <Input
            value={formData.subcategory}
            onChange={(e) =>
              setFormData({ ...formData, subcategory: e.target.value })
            }
            placeholder="T-Shirt, Hoodie, dll"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Deskripsi</label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Bahan</label>
        <Input
          value={formData.material}
          onChange={(e) =>
            setFormData({ ...formData, material: e.target.value })
          }
          placeholder="100% Cotton"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          URL Gambar (pisahkan dengan koma)
        </label>
        <Textarea
          value={formData.images.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              images: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          rows={2}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          Stok per Ukuran
        </label>
        <div className="grid grid-cols-5 gap-2">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div key={size}>
              <label className="text-xs text-gray-500">{size}</label>
              <Input
                type="number"
                value={formData.stock[size] || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: {
                      ...formData.stock,
                      [size]: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_bestseller}
            onChange={(e) =>
              setFormData({ ...formData, is_bestseller: e.target.checked })
            }
            className="rounded"
          />
          <span className="text-sm">Best Seller</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_new_arrival}
            onChange={(e) =>
              setFormData({ ...formData, is_new_arrival: e.target.checked })
            }
            className="rounded"
          />
          <span className="text-sm">New Arrival</span>
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          className="flex-1"
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          className="flex-1 bg-black hover:bg-gray-800"
        >
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : product ? (
            "Update"
          ) : (
            "Tambah"
          )}
        </Button>
      </div>
    </form>
  );
}
