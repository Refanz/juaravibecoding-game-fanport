import React from 'react';
import { PurchaseOrder } from '../../../domain/entities/PurchaseRequest';

interface Props {
  po: PurchaseOrder;
  onClose: () => void;
  onProcessDelivery?: () => void;
}

export default function PODocument({ po, onClose, onProcessDelivery }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[150] p-4 pointer-events-auto overflow-y-auto">
      <div className="bg-white text-black max-w-2xl w-full min-h-[600px] shadow-2xl p-8 relative print:shadow-none print:p-0">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl print:hidden">✕</button>
        
        {/* Header */}
        <div className="border-b-4 border-gray-800 pb-4 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">PURCHASE ORDER</h1>
            <p className="text-gray-500 font-bold tracking-widest text-sm mt-1">VIBE HOSPITAL IT DEPT</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-500 uppercase">PO Number</p>
            <p className="text-xl font-bold">{po.id}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">To Vendor</p>
            <p className="font-bold">{po.vendor}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Date</p>
            <p className="font-bold">{new Date(po.timestamp).toLocaleDateString('id-ID')}</p>
            <p className="text-xs font-bold text-gray-400 uppercase mt-4 mb-1">Ref PR</p>
            <p className="font-bold">{po.refPrId}</p>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left mb-8 border-collapse">
          <thead>
            <tr className="bg-gray-100 border-y-2 border-gray-300">
              <th className="py-2 px-4 uppercase text-xs text-gray-600">Item Description</th>
              <th className="py-2 px-4 uppercase text-xs text-gray-600 text-center">Qty</th>
              <th className="py-2 px-4 uppercase text-xs text-gray-600 text-right">Unit Price</th>
              <th className="py-2 px-4 uppercase text-xs text-gray-600 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {po.items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium">{item.name}</td>
                <td className="py-3 px-4 text-center">{item.qty}</td>
                <td className="py-3 px-4 text-right">Rp {item.price.toLocaleString('id-ID')}</td>
                <td className="py-3 px-4 text-right font-bold">Rp {(item.price * item.qty).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-4 border-gray-800">
              <td colSpan={3} className="py-4 px-4 text-right font-bold uppercase">Total Amount</td>
              <td className="py-4 px-4 text-right font-black text-lg">Rp {po.total.toLocaleString('id-ID')}</td>
            </tr>
          </tfoot>
        </table>

        {/* Footer & Signatures */}
        <div className="flex justify-between items-end mt-16 pt-8 border-t border-gray-200">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-8">Authorized By</p>
            <p className="font-bold underline decoration-2 underline-offset-4">{po.approver}</p>
            <p className="text-xs text-gray-500 mt-1">Director / Finance</p>
          </div>
          
          {onProcessDelivery && (
            <button 
              onClick={onProcessDelivery}
              className="bg-black text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors print:hidden shadow-xl"
            >
              Proses Pengiriman (DO) →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
