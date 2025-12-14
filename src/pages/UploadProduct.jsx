import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Loader2, Plus, Check } from "lucide-react";
import { toast } from "sonner";

const categoryOptions = {
  men: "Pria",
  women: "Wanita",
  unisex: "Unisex",
};

const subcategoryOptions = {
  tshirt: "T-Shirt",
  hoodie: "Hoodie",
  shirt_polo: "Kemeja/Polo",
  pants: "Celana",
  footwear: "Sepatu/Sandal",
  parfume: "Parfum",
  general: "Umum",
};

const typeOptions = [
  "T-Shirt Sablon - Men",
  "T-Shirt Polos - Men",
  "T-Shirt Sablon - Women",
  "T-Shirt Polos - Women",
  "Heavyweight",
  "Quick Dry",
  "Hoodie Crewneck - Men",
  "Hoodie Crewneck - Women",
  "Hoodie Crewneck - Unisex",
  "Kemeja - Men",
  "Kemeja - Women",
  "Polo Shirt - Men",
  "Polo Shirt - Women",
  "Chinos & Cargo - Men",
  "Jeans - Man",
  "Jeans - Women",
  "Short Pants - Women",
  "Jogger - Unisex",
  "Sepatu - Men",
  "Sepatu - Women",
  "Sepatu - Unisex",
  "Sepatu Vulcanized",
  "Sandal - Unisex",
  "Sandal & Patch",
  "Sandal & Patch - Women",
  "Shoes Parfume",
  "Parfum",
  "Kaos Kaki",
  "Pique",
  "Cotton Cloud",
  "Promo Bundling",
  "New Arrival",
];

export default function UploadProduct() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    original_price: "",
    category: "",
    subcategory: "",
    type: "",
    description: "",
    material: "",
    care_instructions: "",
    weight: "",
    is_bestseller: false,
    is_new_arrival: false,
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [colors, setColors] = useState([{ name: "", hex: "#000000" }]);
  const [sizes, setSizes] = useState(["S", "M", "L", "XL", "XXL"]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error("Maksimal 5 gambar");
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map((file) =>
        base44.integrations.Core.UploadFile({ file })
      );
      const results = await Promise.all(uploadPromises);
      const newImages = results.map((r) => r.file_url);
      setImages([...images, ...newImages]);
      toast.success("Gambar berhasil diupload");
    } catch (error) {
      toast.error("Gagal upload gambar");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addColor = () => {
    setColors([...colors, { name: "", hex: "#000000" }]);
  };

  const updateColor = (index, field, value) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const createProductMutation = useMutation({
    mutationFn: async () => {
      const stock = {};
      sizes.forEach((size) => {
        stock[size] = 10; // Default stock
      });

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price
          ? parseFloat(formData.original_price)
          : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        images,
        colors: colors.filter((c) => c.name && c.hex),
        sizes,
        stock,
      };

      return base44.entities.Product.create(productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil ditambahkan");
      // Reset form
      setFormData({
        name: "",
        price: "",
        original_price: "",
        category: "",
        subcategory: "",
        type: "",
        description: "",
        material: "",
        care_instructions: "",
        weight: "",
        is_bestseller: false,
        is_new_arrival: false,
      });
      setImages([]);
      setColors([{ name: "", hex: "#000000" }]);
    },
    onError: () => {
      toast.error("Gagal menambahkan produk");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      images.length === 0
    ) {
      toast.error("Lengkapi data produk dan upload minimal 1 gambar");
      return;
    }
    createProductMutation.mutate();
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 py-4">
        <h1 className="text-xl font-bold mb-6">Upload Produk Baru</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images Upload */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Gambar Produk (Max 5)
            </label>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Upload</span>
                    </>
                  )}
                </label>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nama Produk *
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Contoh: T-Shirt Polos Premium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Harga *
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="149000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Harga Coret
                </label>
                <Input
                  type="number"
                  value={formData.original_price}
                  onChange={(e) =>
                    setFormData({ ...formData, original_price: e.target.value })
                  }
                  placeholder="199000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kategori *
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryOptions).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subkategori
                </label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(v) =>
                    setFormData({ ...formData, subcategory: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih subkategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(subcategoryOptions).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tipe Produk
              </label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Deskripsi
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Deskripsi produk..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bahan</label>
              <Input
                value={formData.material}
                onChange={(e) =>
                  setFormData({ ...formData, material: e.target.value })
                }
                placeholder="Contoh: 100% Cotton Combed 30s"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cara Perawatan
              </label>
              <Textarea
                value={formData.care_instructions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    care_instructions: e.target.value,
                  })
                }
                placeholder="Cuci dengan air dingin, jangan gunakan pemutih..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Berat (gram)
              </label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                placeholder="200"
              />
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium mb-3">Warna</label>
            <div className="space-y-3">
              {colors.map((color, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    value={color.name}
                    onChange={(e) => updateColor(index, "name", e.target.value)}
                    placeholder="Nama warna"
                    className="flex-1"
                  />
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(index, "hex", e.target.value)}
                    className="w-16 h-10 rounded border cursor-pointer"
                  />
                  {colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="w-10 h-10 bg-red-100 text-red-500 rounded flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addColor}
              className="mt-3 text-sm text-blue-600 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Tambah Warna
            </button>
          </div>

          {/* Tags */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_bestseller}
                onChange={(e) =>
                  setFormData({ ...formData, is_bestseller: e.target.checked })
                }
                className="w-4 h-4"
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
                className="w-4 h-4"
              />
              <span className="text-sm">New Arrival</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={createProductMutation.isPending}
            className="w-full bg-black text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {createProductMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Simpan Produk
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
