import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, Ruler, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const sizeCharts = {
  tops: {
    label: "Atasan (T-Shirt, Kemeja, Hoodie)",
    sizes: [
      {
        size: "S",
        chest: "48-50",
        length: "68-70",
        shoulder: "42-44",
        weight: "50-60 kg",
      },
      {
        size: "M",
        chest: "50-52",
        length: "70-72",
        shoulder: "44-46",
        weight: "60-70 kg",
      },
      {
        size: "L",
        chest: "52-54",
        length: "72-74",
        shoulder: "46-48",
        weight: "70-80 kg",
      },
      {
        size: "XL",
        chest: "54-56",
        length: "74-76",
        shoulder: "48-50",
        weight: "80-90 kg",
      },
      {
        size: "XXL",
        chest: "56-58",
        length: "76-78",
        shoulder: "50-52",
        weight: "90-100 kg",
      },
    ],
  },
  pants: {
    label: "Celana",
    sizes: [
      { size: "28", waist: "71-74", hip: "90-93", length: "100-102" },
      { size: "30", waist: "76-79", hip: "94-97", length: "102-104" },
      { size: "32", waist: "81-84", hip: "98-101", length: "104-106" },
      { size: "34", waist: "86-89", hip: "102-105", length: "106-108" },
      { size: "36", waist: "91-94", hip: "106-109", length: "108-110" },
    ],
  },
  footwear: {
    label: "Sepatu",
    sizes: [
      { size: "38", eu: "38", us: "5.5", cm: "24" },
      { size: "39", eu: "39", us: "6.5", cm: "24.5" },
      { size: "40", eu: "40", us: "7", cm: "25" },
      { size: "41", eu: "41", us: "8", cm: "26" },
      { size: "42", eu: "42", us: "8.5", cm: "26.5" },
      { size: "43", eu: "43", us: "9.5", cm: "27" },
      { size: "44", eu: "44", us: "10", cm: "28" },
      { size: "45", eu: "45", us: "11", cm: "29" },
    ],
  },
};

export default function SizeGuide() {
  const [activeTab, setActiveTab] = useState("tops");

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-14 bg-white border-b z-10">
        <div className="flex items-center px-4 py-3">
          <Link to={createPageUrl("Catalog")} className="mr-3">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold">Panduan Ukuran</h1>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {Object.entries(sizeCharts).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === key
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>

        {/* Size Table */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Ukuran</th>
                  {activeTab === "tops" && (
                    <>
                      <th className="py-3 px-4 text-left font-medium">
                        Dada (cm)
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Panjang (cm)
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Bahu (cm)
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Berat Badan
                      </th>
                    </>
                  )}
                  {activeTab === "pants" && (
                    <>
                      <th className="py-3 px-4 text-left font-medium">
                        Pinggang (cm)
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Pinggul (cm)
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Panjang (cm)
                      </th>
                    </>
                  )}
                  {activeTab === "footwear" && (
                    <>
                      <th className="py-3 px-4 text-left font-medium">EU</th>
                      <th className="py-3 px-4 text-left font-medium">US</th>
                      <th className="py-3 px-4 text-left font-medium">CM</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {sizeCharts[activeTab].sizes.map((row) => (
                  <tr key={row.size}>
                    <td className="py-3 px-4 font-medium">{row.size}</td>
                    {activeTab === "tops" && (
                      <>
                        <td className="py-3 px-4">{row.chest}</td>
                        <td className="py-3 px-4">{row.length}</td>
                        <td className="py-3 px-4">{row.shoulder}</td>
                        <td className="py-3 px-4">{row.weight}</td>
                      </>
                    )}
                    {activeTab === "pants" && (
                      <>
                        <td className="py-3 px-4">{row.waist}</td>
                        <td className="py-3 px-4">{row.hip}</td>
                        <td className="py-3 px-4">{row.length}</td>
                      </>
                    )}
                    {activeTab === "footwear" && (
                      <>
                        <td className="py-3 px-4">{row.eu}</td>
                        <td className="py-3 px-4">{row.us}</td>
                        <td className="py-3 px-4">{row.cm}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* How to Measure */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <Ruler className="w-5 h-5" />
            Cara Mengukur
          </h3>

          {activeTab === "tops" && (
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                  1
                </span>
                <span>
                  <strong>Dada:</strong> Ukur keliling bagian dada terlebar
                  dengan posisi tangan rileks di samping badan
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                  2
                </span>
                <span>
                  <strong>Panjang:</strong> Ukur dari titik tertinggi bahu
                  hingga ujung bawah baju
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                  3
                </span>
                <span>
                  <strong>Bahu:</strong> Ukur dari ujung bahu kiri ke ujung bahu
                  kanan
                </span>
              </li>
            </ul>
          )}

          {activeTab === "pants" && (
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                  1
                </span>
                <span>
                  <strong>Pinggang:</strong> Ukur keliling pinggang pada bagian
                  tersempit
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                  2
                </span>
                <span>
                  <strong>Pinggul:</strong> Ukur keliling bagian pinggul
                  terlebar
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                  3
                </span>
                <span>
                  <strong>Panjang:</strong> Ukur dari pinggang hingga mata kaki
                </span>
              </li>
            </ul>
          )}

          {activeTab === "footwear" && (
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                  1
                </span>
                <span>Letakkan kaki di atas kertas dan buat outline</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                  2
                </span>
                <span>
                  Ukur panjang dari tumit hingga ujung jari terpanjang
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                  3
                </span>
                <span>Ukur pada sore hari karena kaki cenderung membesar</span>
              </li>
            </ul>
          )}
        </div>

        {/* Find Your Size CTA */}
        <Link
          to={createPageUrl("FindYourSize")}
          className="mt-6 flex items-center justify-between bg-black text-white p-4 rounded-xl"
        >
          <div>
            <h4 className="font-bold">Tidak yakin ukuran Anda?</h4>
            <p className="text-sm text-gray-300">
              Gunakan fitur Find Your Size
            </p>
          </div>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
