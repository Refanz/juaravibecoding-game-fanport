import { SaveManager } from "./SaveManager";
import { EventBus } from "../events/EventBus";

const DEFAULT_BUDGET = 50_000_000;

export class BudgetManager {
  private static budget: number = DEFAULT_BUDGET;

  static initialize() {
    const saveData = SaveManager.load();
    if (saveData && saveData.itBudget !== undefined) {
      this.budget = saveData.itBudget;
    } else {
      this.budget = DEFAULT_BUDGET;
    }
    
    // Clear old listeners to avoid duplicates if re-initialized
    EventBus.off("budget_event");
    EventBus.on("budget_event", (payload: { delta: number, reason: string }) => {
      this.addBudget(payload.delta);
      EventBus.emit("show_toast_notification", {
         type: "info",
         title: "Update Budget IT",
         message: `${payload.reason} (${payload.delta > 0 ? '+' : ''}${payload.delta.toLocaleString('id-ID')})`,
         colorTheme: payload.delta > 0 ? "green" : "orange",
         icon: "💰"
      });
    });
  }

  static getBudget(): number {
    return this.budget;
  }

  static deductBudget(amount: number): boolean {
    if (this.budget >= amount) {
      this.budget -= amount;
      this.saveAndEmit();
      return true;
    }
    return false;
  }
  
  static addBudget(amount: number) {
      this.budget += amount;
      this.saveAndEmit();
  }

  private static saveAndEmit() {
    const saveData = SaveManager.load();
    if (saveData) {
      saveData.itBudget = this.budget;
      SaveManager.save(saveData as any);
    }
    EventBus.emit("budget_updated", { budget: this.budget });
  }
}
