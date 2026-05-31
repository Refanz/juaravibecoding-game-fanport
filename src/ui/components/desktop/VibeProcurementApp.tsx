import React, { useState, useEffect } from 'react';
import { ProcurementManager } from '../../../infrastructure/storage/ProcurementManager';
import { PurchaseRequest } from '../../../domain/entities/PurchaseRequest';
import { nanoid } from 'nanoid';
import { EventBus } from '../../../infrastructure/events/EventBus';
import PODocument from './PODocument';
import DODocument from './DODocument';
import { WarehouseManager } from '../../../infrastructure/storage/WarehouseManager';
import { BudgetManager } from '../../../infrastructure/storage/BudgetManager';

interface Props {
  currentTimestamp: number;
}

const CATALOG = [
  { id: 'RAM', name: 'RAM 16GB DDR4', price: 800000, category: 'Komponen PC' },
  { id: 'LAN', name: 'Kabel UTP Cat6 (Rol)', price: 1500000, category: 'Jaringan' },
  { id: 'MONITOR', name: 'Monitor 24 inch', price: 2500000, category: 'Periferal' },
  { id: 'KB', name: 'Keyboard USB Standard', price: 150000, category: 'Periferal' },
  { id: 'MOUSE', name: 'Mouse USB Standard', price: 100000, category: 'Periferal' },
  { id: 'SERVER_PSU', name: 'Server PSU 1000W', price: 5000000, category: 'Server' },
  { id: 'AP', name: 'Wireless Access Point', price: 1500000, category: 'Jaringan' },
];

export default function VibeProcurementApp({ currentTimestamp }: Props) {
  const [activeTab, setActiveTab] = useState<'Katalog' | 'Daftar' | 'Detail'>('Katalog');
  const [prs, setPRs] = useState<PurchaseRequest[]>(ProcurementManager.getPRs());
  
  // Cart for Catalog
  const [cart, setCart] = useState<{item: typeof CATALOG[0], qty: number}[]>([]);
  const [reason, setReason] = useState('');
  
  // Detail View
  const [selectedPR, setSelectedPR] = useState<PurchaseRequest | null>(null);
  
  // Viewers
  const [viewingPO, setViewingPO] = useState<string | null>(null);
  const [viewingDO, setViewingDO] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onUpdate = () => {
      setPRs([...ProcurementManager.getPRs()]);
      if (selectedPR) {
        setSelectedPR(ProcurementManager.getPR(selectedPR.id) || null);
      }
    };
    EventBus.on("procurement_updated", onUpdate);
    return () => { EventBus.off("procurement_updated", onUpdate); };
  }, [selectedPR]);

  const addToCart = (item: typeof CATALOG[0]) => {
    setCart(prev => {
      const existing = prev.find(p => p.item.id === item.id);
      if (existing) {
        return prev.map(p => p.item.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(p => p.item.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(p => p.item.id === id ? { ...p, qty } : p));
  };

  const cartTotal = cart.reduce((sum, c) => sum + (c.item.price * c.qty), 0);

  const handleSubmitPR = () => {
    if (cart.length === 0 || !reason) return;
    
    const pr: PurchaseRequest = {
      id: `PR-${nanoid(6).toUpperCase()}`,
      items: cart.map(c => ({
        id: c.item.id,
        name: c.item.name,
        price: c.item.price,
        qty: c.qty
      })),
      totalPrice: cartTotal,
      reason,
      status: 'Diajukan',
      history: [
        { status: 'Diajukan', timestamp: currentTimestamp, notes: 'Menunggu persetujuan Atasan' }
      ]
    };
    
    ProcurementManager.addPR(pr);
    setCart([]);
    setReason('');
    
    // Simulate AI approval in backend (for Sprint 3, we'll just show it created)
    EventBus.emit("show_toast_notification", {
      message: `Purchase Request ${pr.id} berhasil diajukan!`,
      icon: '✅',
      colorTheme: 'green'
    });
    
    setActiveTab('Daftar');
  };

  const viewDetails = (pr: PurchaseRequest) => {
    setSelectedPR(pr);
    setActiveTab('Detail');
  };

  const requestApproval = async () => {
    if (!selectedPR || isLoading) return;
    setIsLoading(true);
    
    // For PO creation, it doesn't need AI, it's just a system state change
    if (selectedPR.status === 'Disetujui Direktur') {
      const pr = { ...selectedPR };
      const ts = currentTimestamp;
      pr.status = 'PO Dibuat';
      const poId = `PO-${nanoid(6).toUpperCase()}`;
      pr.poId = poId;
      ProcurementManager.addPO({
        id: poId,
        refPrId: pr.id,
        timestamp: ts,
        vendor: 'PT Jaya IT Nusantara',
        items: pr.items,
        total: pr.totalPrice,
        approver: 'Finance Dept',
        notes: ''
      });
      pr.history = [...pr.history, { status: pr.status, timestamp: ts, notes: `PO ${poId} telah diterbitkan.` }];
      ProcurementManager.updatePR(pr.id, pr);
      setIsLoading(false);
      return;
    }

    // For DO creation, it's also a system state change
    if (selectedPR.status === 'PO Dibuat') {
      const pr = { ...selectedPR };
      const ts = currentTimestamp;
      pr.status = 'Pesanan Dikirim';
      const doId = `DO-${nanoid(6).toUpperCase()}`;
      pr.doId = doId;
      ProcurementManager.addDO({
        id: doId,
        refPoId: pr.poId!,
        timestamp: ts,
        expedition: 'JNE Express',
        items: pr.items.map(i => ({ name: i.name, qty: i.qty })),
        status: 'Dikirim'
      });
      pr.history = [...pr.history, { status: pr.status, timestamp: ts, notes: `DO ${doId} sedang dalam perjalanan.` }];
      ProcurementManager.updatePR(pr.id, pr);
      setIsLoading(false);
      return;
    }

    // For Diajukan, Disetujui Atasan, Disetujui Finance -> use AI API
    const prData = {
      id: selectedPR.id,
      status: selectedPR.status,
      items: selectedPR.items,
      totalPrice: selectedPR.totalPrice,
      reason: selectedPR.reason
    };

    try {
      // Create a toast for waiting
      EventBus.emit("show_toast_notification", {
        message: `Menunggu persetujuan AI...`,
        icon: '⏳',
        colorTheme: 'blue'
      });

      const response = await fetch('/api/procurement/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pr: prData })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get approval');
      }

      const pr = { ...selectedPR };
      pr.status = data.nextStatus;
      pr.history = [...pr.history, { status: pr.status, timestamp: currentTimestamp, notes: data.notes }];
      ProcurementManager.updatePR(pr.id, pr);
      
    } catch (err: any) {
      console.error(err);
      EventBus.emit("show_toast_notification", {
        message: `Gagal memproses persetujuan: ${err.message}`,
        icon: '❌',
        colorTheme: 'red'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReceiveDO = (doId: string) => {
    if (!selectedPR) return;
    const doObj = ProcurementManager.getDO(doId);
    if (!doObj) return;

    // Update DO status
    doObj.status = 'Diterima';
    doObj.receiver = 'Player IT';
    
    // Update PR status
    const pr = { ...selectedPR };
    pr.status = 'Barang Diterima';
    pr.history.push({ status: pr.status, timestamp: currentTimestamp, notes: `Barang diterima oleh IT (Ref: ${doId}).` });
    ProcurementManager.updatePR(pr.id, pr);

    // Update Warehouse & Budget
    selectedPR.items.forEach(item => {
      WarehouseManager.addItem(item.id, item.qty, item.name, 'Komponen', 'buah');
    });
    BudgetManager.deductBudget(selectedPR.totalPrice);
    
    setViewingDO(null);
    EventBus.emit("show_toast_notification", {
      message: `Barang telah masuk gudang dan Budget terpotong Rp ${selectedPR.totalPrice.toLocaleString('id-ID')}`,
      icon: '📦',
      colorTheme: 'green'
    });
  };

  return (
    <div className="h-full flex flex-col text-gray-800 text-sm overflow-hidden bg-gray-50">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex gap-4 font-medium sticky top-0 z-10">
        <button 
          onClick={() => setActiveTab('Katalog')} 
          className={`pb-1 ${activeTab === 'Katalog' ? 'border-b-2 border-[#008080] text-[#008080]' : 'text-gray-500 hover:text-gray-800'}`}
        >
          📦 Katalog Barang
        </button>
        <button 
          onClick={() => setActiveTab('Daftar')} 
          className={`pb-1 ${activeTab === 'Daftar' ? 'border-b-2 border-[#008080] text-[#008080]' : 'text-gray-500 hover:text-gray-800'}`}
        >
          📄 Daftar Pengadaan
        </button>
        {selectedPR && (
          <button 
            onClick={() => setActiveTab('Detail')} 
            className={`pb-1 ${activeTab === 'Detail' ? 'border-b-2 border-[#008080] text-[#008080]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            🔍 Detail ({selectedPR.id})
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {/* TAB: KATALOG */}
        {activeTab === 'Katalog' && (
          <div className="flex flex-col md:flex-row gap-6 h-full">
            {/* Catalog Grid */}
            <div className="flex-[2] flex flex-col h-full">
              <h2 className="font-bold text-lg mb-4 text-[#008080]">Katalog Perangkat IT</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {CATALOG.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.category}</span>
                      <h3 className="font-bold text-gray-800 mt-1">{item.name}</h3>
                      <p className="text-[#008080] font-medium mt-2">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <button 
                      onClick={() => addToCart(item)}
                      className="mt-4 w-full bg-[#008080]/10 text-[#008080] font-bold py-2 rounded-lg hover:bg-[#008080] hover:text-white transition-colors"
                    >
                      + Tambah ke PR
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart & PR Form */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col h-fit sticky top-0">
              <h2 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                🛒 Form Purchase Request
              </h2>
              
              {cart.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 py-10 text-center">
                  Belum ada barang yang dipilih.<br/>Klik tambah dari katalog.
                </div>
              ) : (
                <div className="flex flex-col flex-1">
                  <div className="space-y-3 mb-4 max-h-[30vh] overflow-y-auto custom-scrollbar pr-2">
                    {cart.map(c => (
                      <div key={c.item.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{c.item.name}</p>
                          <p className="text-xs text-gray-500">Rp {c.item.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            min="1" 
                            value={c.qty}
                            onChange={(e) => updateQty(c.item.id, parseInt(e.target.value) || 1)}
                            onKeyDown={e => e.stopPropagation()}
                            className="w-16 px-2 py-1 border border-gray-300 rounded focus:border-[#008080] outline-none"
                          />
                          <button onClick={() => removeFromCart(c.item.id)} className="text-red-500 hover:text-red-700 font-bold px-1">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-auto border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center font-bold text-lg mb-4 text-[#008080]">
                      <span>Total:</span>
                      <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Alasan Pengadaan *</label>
                      <textarea 
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        placeholder="Contoh: Mengganti PC poli yang mati total..."
                        className="w-full border border-gray-300 rounded-lg p-2 h-20 resize-none focus:border-[#008080] outline-none"
                        required
                      ></textarea>
                    </div>
                    
                    <button 
                      onClick={handleSubmitPR}
                      disabled={!reason.trim()}
                      className="w-full bg-[#008080] text-white font-bold py-3 rounded-lg shadow-md hover:bg-[#006666] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Ajukan Purchase Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: DAFTAR */}
        {activeTab === 'Daftar' && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-lg">Daftar Purchase Request</h2>
            </div>
            
            {prs.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                Belum ada pengadaan yang diajukan.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-3 border-b border-gray-200">ID PR</th>
                    <th className="p-3 border-b border-gray-200 hidden sm:table-cell">Tanggal</th>
                    <th className="p-3 border-b border-gray-200">Total (Rp)</th>
                    <th className="p-3 border-b border-gray-200">Status</th>
                    <th className="p-3 border-b border-gray-200 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {prs.map(pr => {
                    const statusColor = 
                      pr.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                      pr.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                      pr.status === 'Barang Diterima' ? 'bg-teal-100 text-teal-700' :
                      'bg-blue-100 text-blue-700';
                      
                    return (
                      <tr key={pr.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                        <td className="p-3 font-bold text-gray-700">{pr.id}</td>
                        <td className="p-3 text-gray-500 hidden sm:table-cell">
                          {new Date(pr.history[0].timestamp).toLocaleDateString('id-ID', {day: '2-digit', month: 'short'})}
                        </td>
                        <td className="p-3 font-medium text-gray-700">{pr.totalPrice.toLocaleString('id-ID')}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${statusColor}`}>
                            {pr.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => viewDetails(pr)}
                            className="text-[#008080] font-medium hover:underline hover:text-[#006666]"
                          >
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB: DETAIL */}
        {activeTab === 'Detail' && selectedPR && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* PR Info & Items */}
            <div className="flex-[2] flex flex-col gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedPR.id}</h2>
                    <p className="text-gray-500 text-sm mt-1">Alasan: {selectedPR.reason}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold">
                    {selectedPR.status}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-700 mb-3 uppercase text-xs tracking-wider">Item Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  {selectedPR.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.qty}x @ Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <p className="font-bold text-gray-700">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300 font-bold text-lg text-[#008080]">
                    <span>Total Keseluruhan</span>
                    <span>Rp {selectedPR.totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Documents Area (PO & DO) */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-700 mb-4 uppercase text-xs tracking-wider">Dokumen Terkait</h3>
                <div className="flex flex-wrap gap-4">
                  {selectedPR.poId ? (
                    <button onClick={() => setViewingPO(selectedPR.poId!)} className="flex items-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 px-4 py-3 rounded-lg hover:bg-purple-100 transition-colors">
                      <span className="text-xl">📄</span> 
                      <div className="text-left">
                        <div className="text-xs font-bold">Purchase Order</div>
                        <div className="text-sm">{selectedPR.poId}</div>
                      </div>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-gray-50 text-gray-400 border border-gray-200 px-4 py-3 rounded-lg border-dashed">
                      <span className="text-xl">📄</span>
                      <div className="text-left text-sm">PO Belum Tersedia</div>
                    </div>
                  )}

                  {selectedPR.doId ? (
                    <button onClick={() => setViewingDO(selectedPR.doId!)} className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors">
                      <span className="text-xl">📦</span> 
                      <div className="text-left">
                        <div className="text-xs font-bold">Delivery Order</div>
                        <div className="text-sm">{selectedPR.doId}</div>
                      </div>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-gray-50 text-gray-400 border border-gray-200 px-4 py-3 rounded-lg border-dashed">
                      <span className="text-xl">📦</span>
                      <div className="text-left text-sm">DO Belum Tersedia</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline Tracking */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-5 h-fit flex flex-col">
              <h3 className="font-bold text-gray-700 mb-6 uppercase text-xs tracking-wider">Tracking Pengadaan</h3>
              <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 flex-1">
                {selectedPR.history.slice().reverse().map((hist, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${idx === 0 ? 'bg-[#008080] shadow-[0_0_0_2px_#00808040]' : 'bg-gray-300'}`}></div>
                    <div className="font-bold text-gray-800">{hist.status}</div>
                    <div className="text-xs text-gray-500 mb-1">
                      {new Date(hist.timestamp).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
                    </div>
                    {hist.notes && (
                      <div className="bg-gray-50 p-2 rounded-lg text-xs border border-gray-100 text-gray-600 mt-2 italic">
                        "{hist.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* AI & System Progress Action */}
              {selectedPR.status !== 'Barang Diterima' && selectedPR.status !== 'Selesai' && selectedPR.status !== 'Ditolak' && (
                <button 
                  onClick={requestApproval}
                  disabled={isLoading}
                  className={`mt-8 w-full text-white font-bold py-2 rounded-lg transition-colors text-xs flex items-center justify-center gap-2 shadow-md ${
                    isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#008080] hover:bg-[#006666] border border-[#006666]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      {selectedPR.status === 'Diajukan' && '⚙️ Minta Persetujuan Atasan IT (AI)'}
                      {selectedPR.status === 'Disetujui Atasan' && '⚙️ Minta Persetujuan Finance (AI)'}
                      {selectedPR.status === 'Disetujui Finance' && '⚙️ Minta Persetujuan Direktur (AI)'}
                      {selectedPR.status === 'Disetujui Direktur' && '📄 Terbitkan Purchase Order'}
                      {selectedPR.status === 'PO Dibuat' && '📦 Kirimkan Pesanan (DO)'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Render Document Modals */}
      {viewingPO && (
        <PODocument 
          po={ProcurementManager.getPO(viewingPO)!} 
          onClose={() => setViewingPO(null)} 
          onProcessDelivery={requestApproval}
        />
      )}
      
      {viewingDO && (
        <DODocument 
          doObj={ProcurementManager.getDO(viewingDO)!} 
          onClose={() => setViewingDO(null)} 
          onReceiveItems={() => handleReceiveDO(viewingDO)}
        />
      )}
    </div>
  );
}
