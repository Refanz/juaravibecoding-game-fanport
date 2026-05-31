import { SaveManager } from './SaveManager';
import { PurchaseRequest, PurchaseOrder, DeliveryOrder, DiscrepancyReport } from '../../domain/entities/PurchaseRequest';
import { EventBus } from '../events/EventBus';

export class ProcurementManager {
  private static prs: PurchaseRequest[] = [];
  private static pos: PurchaseOrder[] = [];
  private static dos: DeliveryOrder[] = [];
  private static discrepancies: DiscrepancyReport[] = [];

  static initialize() {
    const data = SaveManager.load();
    if (data?.procurementData) {
      try {
        const parsed = JSON.parse(data.procurementData);
        this.prs = parsed.prs || [];
        this.pos = parsed.pos || [];
        this.dos = parsed.dos || [];
      } catch (e) {
        console.error("Failed to parse procurementData", e);
      }
    }
    if (data?.discrepancyReports) {
      try {
        this.discrepancies = JSON.parse(data.discrepancyReports);
      } catch (e) {
        console.error("Failed to parse discrepancyReports", e);
      }
    }
  }

  static getData() {
    return { 
      prs: this.prs, 
      pos: this.pos, 
      dos: this.dos, 
      discrepancies: this.discrepancies 
    };
  }

  static getPRs() { return this.prs; }
  static getPOs() { return this.pos; }
  static getDOs() { return this.dos; }

  static addPR(pr: PurchaseRequest) {
    this.prs.unshift(pr);
    this.emitUpdate();
  }
  
  static updatePR(id: string, update: Partial<PurchaseRequest>) {
    const pr = this.prs.find(p => p.id === id);
    if (pr) {
      Object.assign(pr, update);
      this.emitUpdate();
    }
  }

  static addPO(po: PurchaseOrder) {
    this.pos.unshift(po);
    this.emitUpdate();
  }

  static addDO(doObj: DeliveryOrder) {
    this.dos.unshift(doObj);
    this.emitUpdate();
  }

  static getPR(id: string) { return this.prs.find(p => p.id === id); }
  static getPO(id: string) { return this.pos.find(p => p.id === id); }
  static getDO(id: string) { return this.dos.find(p => p.id === id); }

  private static emitUpdate() {
    EventBus.emit("procurement_updated");
  }
}
