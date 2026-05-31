import React from 'react';
import { DeliveryOrder } from '../../../domain/entities/PurchaseRequest';

interface Props {
  doObj: DeliveryOrder;
  onClose: () => void;
  onReceiveItems?: () => void;
}

export default function DODocument({ doObj, onClose, onReceiveItems }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[150] p-4 pointer-events-auto overflow-y-auto">
      <div className="bg-[#fffdf0] text-gray-900 max-w-2xl w-full min-h-[600px] shadow-2xl p-8 relative border border-[#e2d5a3] print:shadow-none print:p-0">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl print:hidden">✕</button>
        
        {/* Header */}
        <div className="border-b-2 border-red-800 pb-4 mb-6 text-center">
          <h1 className="text-2xl font-serif font-bold text-red-800 uppercase tracking-widest">Surat Jalan (Delivery Order)</h1>
          <p className="text-sm font-serif italic text-gray-600 mt-1">Harap periksa kondisi barang sebelum menandatangani bukti terima.</p>
        </div>

        {/* Info Grid */}
        <div className="flex justify-between mb-8 text-sm">
          <div>
            <table className="border-collapse">
              <tbody>
                <tr><td className="pr-4 py-1 text-gray-500 font-bold uppercase">DO Number</td><td className="font-bold text-lg">{doObj.id}</td></tr>
                <tr><td className="pr-4 py-1 text-gray-500 font-bold uppercase">Date</td><td className="font-medium">{new Date(doObj.timestamp).toLocaleDateString('id-ID')}</td></tr>
                <tr><td className="pr-4 py-1 text-gray-500 font-bold uppercase">Ref PO</td><td className="font-medium">{doObj.refPoId}</td></tr>
                <tr><td className="pr-4 py-1 text-gray-500 font-bold uppercase">Expedition</td><td className="font-medium">{doObj.expedition}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="text-right border border-gray-300 p-4 bg-white shadow-sm max-w-[250px]">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Deliver To</p>
            <p className="font-bold">Gudang IT - Vibe Hospital</p>
            <p className="text-xs mt-1">Lantai 1, Ruang Logistik</p>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left mb-8 border-collapse border border-gray-400 bg-white">
          <thead>
            <tr className="bg-gray-200 border-b-2 border-gray-400">
              <th className="py-2 px-4 border-r border-gray-400 uppercase text-xs font-bold text-center w-12">No</th>
              <th className="py-2 px-4 border-r border-gray-400 uppercase text-xs font-bold">Deskripsi Barang</th>
              <th className="py-2 px-4 uppercase text-xs font-bold text-center w-24">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {doObj.items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-300">
                <td className="py-3 px-4 border-r border-gray-300 text-center font-medium">{idx + 1}</td>
                <td className="py-3 px-4 border-r border-gray-300 font-medium">{item.name}</td>
                <td className="py-3 px-4 text-center font-bold text-lg">{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer & Signatures */}
        <div className="grid grid-cols-3 gap-4 mt-16 text-center text-sm">
          <div>
            <p className="mb-16">Pengirim,</p>
            <p className="border-t border-gray-400 pt-1 mx-4 font-bold">{doObj.expedition} Courier</p>
          </div>
          <div>
            <p className="mb-16">Mengetahui,</p>
            <p className="border-t border-gray-400 pt-1 mx-4 font-bold">Security Officer</p>
          </div>
          <div>
            <p className="mb-16">Penerima (Gudang IT),</p>
            {doObj.status === 'Diterima' ? (
              <p className="border-t border-gray-400 pt-1 mx-4 font-bold text-green-700">✓ {doObj.receiver || 'IT Staff'}</p>
            ) : (
              <div className="mx-4 border-t border-gray-400 pt-2 print:hidden">
                {onReceiveItems && (
                  <button 
                    onClick={onReceiveItems}
                    className="w-full bg-green-600 text-white py-2 px-2 font-bold rounded shadow hover:bg-green-700 transition-colors text-xs"
                  >
                    Tanda Tangan & Terima
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
