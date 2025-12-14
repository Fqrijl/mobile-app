import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Zap, Plus, Edit2, Trash2, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function FlashSaleManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [formData, setFormData] = useState({
    product_id: "",
    flash_price: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
    stock_available: "",
    is_active: true,
  });
  const queryClient = useQueryClient();

  const { data: flashSales = [] } = useQuery({
    queryKey: ["admin-flash-sales"],
    queryFn: () => base44.entities.FlashSale.list("-created_date"),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => base44.entities.Product.list(),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingSale) {
        return await base44.entities.FlashSale.update(editingSale.id, data);
      } else {
        return await base44.entities.FlashSale.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-flash-sales"] });
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      handleCloseDialog();
      toast.success(
        editingSale ? "Flash sale diupdate" : "Flash sale ditambahkan"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (saleId) => {
      await base44.entities.FlashSale.delete(saleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-flash-sales"] });
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      toast.success("Flash sale dihapus");
    },
  });

  const handleOpenDialog = (sale = null) => {
    if (sale) {
      setEditingSale(sale);
      setFormData({
        product_id: sale.product_id,
        flash_price: sale.flash_price,
        discount_percentage: sale.discount_percentage || "",
        start_date: sale.start_date?.slice(0, 16) || "",
        end_date: sale.end_date?.slice(0, 16) || "",
        stock_available: sale.stock_available,
        is_active: sale.is_active,
      });
    } else {
      setEditingSale(null);
      setFormData({
        product_id: "",
        flash_price: "",
        discount_percentage: "",
        start_date: "",
        end_date: "",
        stock_available: "",
        is_active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSale(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedProduct = products.find((p) => p.id === formData.product_id);
    const discount =
      formData.discount_percentage ||
      Math.round((1 - formData.flash_price / selectedProduct?.price) * 100);

    saveMutation.mutate({
      ...formData,
      flash_price: Number(formData.flash_price),
      discount_percentage: discount,
      stock_available: Number(formData.stock_available),
      stock_sold: editingSale?.stock_sold || 0,
    });
  };

  const handleDelete = (saleId) => {
    if (confirm("Yakin ingin menghapus flash sale ini?")) {
      deleteMutation.mutate(saleId);
    }
  };

  const getProductName = (productId) => {
    return products.find((p) => p.id === productId)?.name || "Unknown Product";
  };

  const isActive = (sale) => {
    if (!sale.is_active) return false;
    const now = new Date();
    const start = new Date(sale.start_date);
    const end = new Date(sale.end_date);
    return now >= start && now <= end;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Flash Sale
          </h2>
          <p className="text-sm text-gray-500">Kelola promo flash sale</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-black hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Flash Sale
        </Button>
      </div>

      <div className="grid gap-4">
        {flashSales.map((sale) => {
          const product = products.find((p) => p.id === sale.product_id);
          const active = isActive(sale);
          const soldPercentage = (sale.stock_sold / sale.stock_available) * 100;

          return (
            <div
              key={sale.id}
              className="bg-white rounded-xl p-6 shadow-sm border"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={
                      product?.images?.[0] ||
                      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200"
                    }
                    alt={product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold">
                        {getProductName(sale.product_id)}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-red-500">
                          Rp {sale.flash_price.toLocaleString("id-ID")}
                        </span>
                        {product && (
                          <span className="text-sm text-gray-400 line-through">
                            Rp {product.price.toLocaleString("id-ID")}
                          </span>
                        )}
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">
                          -{sale.discount_percentage || 0}%
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {active ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(sale.start_date).toLocaleDateString("id-ID")}{" "}
                        - {new Date(sale.end_date).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        Terjual: {sale.stock_sold} / {sale.stock_available}
                      </span>
                      <span>{Math.round(soldPercentage)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-red-500"
                        style={{ width: `${soldPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(sale)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(sale.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {flashSales.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada flash sale</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSale ? "Edit Flash Sale" : "Tambah Flash Sale"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Produk</label>
              <Select
                value={formData.product_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, product_id: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih produk" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - Rp{" "}
                      {product.price.toLocaleString("id-ID")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Harga Flash Sale
              </label>
              <Input
                type="number"
                value={formData.flash_price}
                onChange={(e) =>
                  setFormData({ ...formData, flash_price: e.target.value })
                }
                required
                placeholder="99000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mulai</label>
                <Input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Berakhir
                </label>
                <Input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Stok Flash Sale
              </label>
              <Input
                type="number"
                value={formData.stock_available}
                onChange={(e) =>
                  setFormData({ ...formData, stock_available: e.target.value })
                }
                required
                placeholder="50"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">Aktifkan Flash Sale</span>
            </label>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex-1 bg-black hover:bg-gray-800"
              >
                {saveMutation.isPending
                  ? "Menyimpan..."
                  : editingSale
                  ? "Update"
                  : "Tambah"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
