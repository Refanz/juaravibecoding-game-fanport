export interface PurchaseRequest {
  id: string;
  items: {
    id: string;
    name: string;
    qty: number;
    price: number;
  }[];
  totalPrice: number;
  reason: string;
  status: 'Draft' | 'Diajukan' | 'Disetujui Atasan' | 'Disetujui Finance' | 'Disetujui Direktur' | 'PO Dibuat' | 'Pesanan Dikirim' | 'Barang Diterima' | 'Selesai' | 'Ditolak';
  history: {
    status: string;
    timestamp: number;
    notes?: string;
  }[];
  poId?: string;
  doId?: string;
}

export interface PurchaseOrder {
  id: string;
  refPrId: string;
  timestamp: number;
  vendor: string;
  items: {
    name: string;
    qty: number;
    price: number;
  }[];
  total: number;
  approver: string;
  notes: string;
}

export interface DeliveryOrder {
  id: string;
  refPoId: string;
  timestamp: number;
  expedition: string;
  items: {
    name: string;
    qty: number;
  }[];
  status: string;
  receiver?: string;
  notes?: string;
}

export interface DiscrepancyReport {
  id: string;
  refDoId: string;
  item: string;
  expectedQty: number;
  actualQty: number;
  notes: string;
  status: 'Pending' | 'Resolved';
}
