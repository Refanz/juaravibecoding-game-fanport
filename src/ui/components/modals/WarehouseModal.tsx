import React, { useEffect, useState } from "react";
import { WarehouseManager } from "../../../infrastructure/storage/WarehouseManager";
import { WarehouseItem } from "../../../domain/entities/WarehouseItem";
import { EventBus } from "../../../infrastructure/events/EventBus";

interface Props {
  onClose: () => void;
}

export default function WarehouseModal({ onClose }: Props) {
  const [stock, setStock] = useState<WarehouseItem[]>(WarehouseManager.getStock());
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const handleUpdate = (newStock: WarehouseItem[]) => {
      setStock([...newStock]);
    };
    EventBus.on("warehouse_updated", handleUpdate);
    return () => {
      EventBus.off("warehouse_updated", handleUpdate);
    };
  }, []);

  const categories = ["All", ...Array.from(new Set(stock.map((item) => item.category)))];

  const filteredStock =
    filter === "All" ? stock : stock.filter((item) => item.category === filter);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-300 animate-fade-in p-2 sm:p-4 pointer-events-auto">
      <div className="bg-dark border-2 border-hospital-blue rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] flex flex-col relative shadow-[0_0_15px_#1565c0]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-hospital-sky hover:text-white text-xl font-bold cursor-pointer bg-transparent border-none z-10"
        >
          ✕
        </button>

        <h2 className="text-hospital-sky text-base sm:text-xl mb-4 text-center border-b border-hospital-blue/30 pb-2 font-[var(--font-pixel)] flex flex-col items-center">
          <span>Gudang IT</span>
          <span className="text-xs text-medical-light mt-1">Persediaan & Perangkat Keras</span>
        </h2>

        {/* Filter */}
        <div className="mb-4 flex flex-wrap gap-2 justify-center shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded text-[0.7rem] font-[var(--font-pixel)] transition-all whitespace-nowrap ${
                filter === cat
                  ? "bg-hospital-sky text-dark border border-hospital-sky"
                  : "bg-surface text-hospital-sky border border-hospital-blue/30 hover:bg-hospital-blue/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar pr-1">
          {filteredStock.map((item) => (
            <div key={item.id} className="flex flex-col items-center justify-center gap-2 bg-surface p-3 rounded border border-hospital-blue/20 hover:border-hospital-sky/50 transition-all group">
              <span className="text-3xl group-hover:scale-110 transition-transform">{getCategoryIcon(item.category)}</span>
              <div className="text-center w-full">
                <p className="text-medical-light text-[0.65rem] font-[var(--font-pixel)] leading-tight truncate" title={item.name}>{item.name}</p>
                <p className={`text-[0.6rem] font-[var(--font-pixel)] mt-1 ${item.qty === 0 ? 'text-red-400' : 'text-hospital-sky'}`}>
                  {item.qty} {item.unit}
                </p>
              </div>
            </div>
          ))}
          {filteredStock.length === 0 && (
            <div className="col-span-full text-center text-medical-light text-[0.7rem] font-[var(--font-pixel)] py-8">
              Tidak ada barang dalam kategori ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "Network": return "🔌";
    case "Peripheral": return "🖱️";
    case "Component": return "💾";
    default: return "📦";
  }
}
