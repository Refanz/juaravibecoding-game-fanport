import { SaveManager } from "./SaveManager";
import { EventBus } from "../events/EventBus";
import { WarehouseItem } from "../../domain/entities/WarehouseItem";

const DEFAULT_STOCK: WarehouseItem[] = [
  { id: "LAN", name: "Kabel LAN", category: "Network", qty: 100, unit: "meter" },
  { id: "MOUSE", name: "Mouse", category: "Peripheral", qty: 2, unit: "buah" },
  { id: "KB", name: "Keyboard", category: "Peripheral", qty: 2, unit: "buah" },
  { id: "RAM", name: "RAM", category: "Component", qty: 2, unit: "buah" },
];

export class WarehouseManager {
  private static stock: WarehouseItem[] = [];

  static initialize() {
    const saveData = SaveManager.load();
    if (saveData && saveData.warehouseStock) {
      try {
        this.stock = JSON.parse(saveData.warehouseStock);
      } catch (e) {
        console.error("Failed to parse warehouse stock", e);
        this.stock = [...DEFAULT_STOCK];
      }
    } else {
      this.stock = [...DEFAULT_STOCK];
    }
  }

  static getStock(): WarehouseItem[] {
    return this.stock;
  }

  static addItem(id: string, qty: number, name?: string, category?: string, unit?: string) {
    const item = this.stock.find(i => i.id === id);
    if (item) {
      item.qty += qty;
    } else {
      this.stock.push({
        id,
        name: name || id,
        category: category || "General",
        qty,
        unit: unit || "buah",
      });
    }
    this.saveAndEmit();
  }

  static deductItem(id: string, qty: number): boolean {
    const item = this.stock.find(i => i.id === id);
    if (item && item.qty >= qty) {
      item.qty -= qty;
      this.saveAndEmit();
      return true;
    }
    return false;
  }

  static hasItem(id: string, qty: number = 1): boolean {
    const item = this.stock.find(i => i.id === id);
    return item ? item.qty >= qty : false;
  }

  private static saveAndEmit() {
    const saveData = SaveManager.load();
    if (saveData) {
      saveData.warehouseStock = JSON.stringify(this.stock);
      SaveManager.save(saveData as any);
    }
    EventBus.emit("warehouse_updated", this.stock);
  }
}
