import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Save } from "lucide-react";

export default function AddressForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      phone: "",
      address: "",
      detail: "",
      city: "",
      province: "",
      district: "",
      postal_code: "",
      lat: null,
      lng: null,
    }
  );

  const [showMap, setShowMap] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      formData.address || "Jakarta"
    )}`;
    window.open(url, "_blank");
    setShowMap(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Nama Lengkap *</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Masukkan nama lengkap"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Nomor Telepon *
        </label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="08xxxxxxxxxx"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-2">Provinsi *</label>
          <Input
            value={formData.province}
            onChange={(e) =>
              setFormData({ ...formData, province: e.target.value })
            }
            placeholder="Provinsi"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Kota *</label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Kota"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-2">Kecamatan *</label>
          <Input
            value={formData.district}
            onChange={(e) =>
              setFormData({ ...formData, district: e.target.value })
            }
            placeholder="Kecamatan"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Kode Pos *</label>
          <Input
            value={formData.postal_code}
            onChange={(e) =>
              setFormData({ ...formData, postal_code: e.target.value })
            }
            placeholder="12345"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Alamat Lengkap *
        </label>
        <Textarea
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          placeholder="Nama Jalan, Gedung, No. Rumah"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Detail Lainnya</label>
        <Textarea
          value={formData.detail}
          onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
          placeholder="Blok / Unit No., Patokan"
          rows={2}
        />
      </div>

      <div>
        <button
          type="button"
          onClick={openGoogleMaps}
          className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <MapPin className="w-4 h-4" />
          Pin Lokasi di Google Maps
        </button>
        {showMap && (
          <p className="text-xs text-gray-500 mt-2">
            Silakan pilih lokasi di Google Maps yang terbuka, lalu kembali ke
            sini
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Batal
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-black text-white hover:bg-gray-800"
        >
          <Save className="w-4 h-4 mr-2" />
          Simpan Alamat
        </Button>
      </div>
    </form>
  );
}
