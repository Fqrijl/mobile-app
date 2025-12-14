import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, User, Ruler, Scale, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

export default function FindYourSize() {
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  const calculateSize = () => {
    const h = parseInt(height);
    const w = parseInt(weight);

    if (!h || !w || !gender) return;

    let size = "";
    let bmi = w / (h / 100) ** 2;

    // Size recommendation logic
    if (gender === "male") {
      if (h <= 165) {
        if (bmi < 20) size = "S";
        else if (bmi < 23) size = "M";
        else if (bmi < 26) size = "L";
        else if (bmi < 30) size = "XL";
        else size = "XXL";
      } else if (h <= 175) {
        if (bmi < 19) size = "S";
        else if (bmi < 22) size = "M";
        else if (bmi < 25) size = "L";
        else if (bmi < 28) size = "XL";
        else size = "XXL";
      } else {
        if (bmi < 18) size = "M";
        else if (bmi < 22) size = "L";
        else if (bmi < 26) size = "XL";
        else size = "XXL";
      }
    } else {
      if (h <= 158) {
        if (bmi < 19) size = "S";
        else if (bmi < 22) size = "M";
        else if (bmi < 25) size = "L";
        else if (bmi < 28) size = "XL";
        else size = "XXL";
      } else if (h <= 168) {
        if (bmi < 18) size = "S";
        else if (bmi < 21) size = "M";
        else if (bmi < 24) size = "L";
        else if (bmi < 27) size = "XL";
        else size = "XXL";
      } else {
        if (bmi < 17) size = "S";
        else if (bmi < 20) size = "M";
        else if (bmi < 23) size = "L";
        else if (bmi < 26) size = "XL";
        else size = "XXL";
      }
    }

    const recommendations = {
      S: "Cocok untuk tubuh ramping dengan bahu sempit",
      M: "Ukuran paling umum, cocok untuk tubuh proporsional",
      L: "Memberikan ruang gerak lebih, cocok untuk tubuh sedang",
      XL: "Cocok untuk tubuh besar dengan bahu lebar",
      XXL: "Ukuran terbesar, memberikan kenyamanan maksimal",
    };

    setResult({
      size,
      description: recommendations[size],
      bmi: bmi.toFixed(1),
    });
  };

  const isFormComplete = gender && height && weight;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-14 bg-white border-b z-10">
        <div className="flex items-center px-4 py-3">
          <Link to={createPageUrl("SizeGuide")} className="mr-3">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold">Find Your Size</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Temukan Ukuran Sempurna</h2>
          <p className="text-gray-500 text-sm">
            Masukkan data tubuh Anda untuk mendapatkan rekomendasi ukuran yang
            tepat
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-3">
              <User className="w-4 h-4 inline mr-2" />
              Gender
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["male", "female"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-4 rounded-xl border text-center font-medium transition-all ${
                    gender === g
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {g === "male" ? "Pria" : "Wanita"}
                </button>
              ))}
            </div>
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium mb-3">
              <Ruler className="w-4 h-4 inline mr-2" />
              Tinggi Badan (cm)
            </label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Contoh: 170"
              className="h-14 text-lg"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium mb-3">
              <Scale className="w-4 h-4 inline mr-2" />
              Berat Badan (kg)
            </label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Contoh: 65"
              className="h-14 text-lg"
            />
          </div>

          <button
            onClick={calculateSize}
            disabled={!isFormComplete}
            className={`w-full py-4 rounded-full font-medium text-center transition-all ${
              isFormComplete
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Cek Ukuran
          </button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 text-center">
                <p className="text-sm text-gray-400 mb-2">
                  Ukuran yang direkomendasikan
                </p>
                <div className="text-6xl font-bold mb-4">{result.size}</div>
                <p className="text-gray-300 text-sm mb-4">
                  {result.description}
                </p>

                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>BMI Anda: {result.bmi}</span>
                  </div>
                </div>

                <Link
                  to={createPageUrl(`Catalog?size=${result.size}`)}
                  className="block w-full bg-white text-black py-3 rounded-full font-medium"
                >
                  Lihat Produk Size {result.size}
                </Link>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 rounded-xl">
                <p className="text-sm text-yellow-800">
                  <strong>Tips:</strong> Jika Anda berada di antara dua ukuran,
                  pilih ukuran yang lebih besar untuk kenyamanan atau ukuran
                  yang lebih kecil untuk tampilan lebih fitted.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
