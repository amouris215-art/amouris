"use client";

import { useState, useMemo } from 'react';
import { useOrdersStore, Order, OrderStatus } from '@/store/orders.store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Clock, CheckCircle2, 
  Truck, XCircle, AlertCircle, FileText, 
  Printer, ChevronRight, Eye 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  preparing: 'En préparation',
  shipped: 'Expédié',
  delivered: 'Livré',
  cancelled: 'Annulé',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  preparing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-emerald-900 text-white border-emerald-800',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function AdminOrdersClient() {
  const { orders, updateStatus } = useOrdersStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const customerName = o.guest_first_name ? `${o.guest_first_name} ${o.guest_last_name}` : 'Client Enregistré';
      const matchSearch = o.order_number.toLowerCase().includes(search.toLowerCase()) || 
                          customerName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || o.order_status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const generatePDF = (order: Order) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(10, 61, 46); // Emerald 950
    doc.text('AMOURIS PARFUMS', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('FACTURE DE COMMANDE', 14, 28);
    doc.text(`N°: ${order.order_number}`, 140, 28);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 140, 33);

    // Client Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text('DESTINATAIRE:', 14, 50);
    doc.setFontSize(10);
    const name = order.guest_first_name ? `${order.guest_first_name} ${order.guest_last_name}` : `Client ID: ${order.customer_id}`;
    doc.text(name, 14, 57);
    doc.text(`Tél: ${order.guest_phone || 'N/A'}`, 14, 62);
    doc.text(`Wilaya: ${order.guest_wilaya || 'N/A'}`, 14, 67);

    // Items Table
    autoTable(doc, {
      startY: 80,
      head: [['Produit', 'Détails', 'Prix Unitaire', 'Total']],
      body: order.items.map(item => [
        item.product_name_fr,
        item.quantity_grams ? `${item.quantity_grams}g` : `${item.quantity_units} unités`,
        `${item.unit_price} DZD`,
        `${item.total_price} DZD`
      ]),
      headStyles: { fillColor: [10, 61, 46], textColor: [255, 255, 255] },
      margin: { top: 80 }
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`TOTAL FINAL: ${order.total_amount.toLocaleString()} DZD`, 120, finalY + 10);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Merci pour votre confiance.', 14, finalY + 30);
    doc.text('Livraison assurée par Amouris Parfums.', 14, finalY + 35);

    doc.save(`Facture_${order.order_number}.pdf`);
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <h1 className="font-serif text-4xl text-emerald-950 mb-2">Flux de Ventes</h1>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A84C]">Gestion des commandes & Expéditions</p>
        </div>
      </header>

      <section className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
           <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-950/20 group-focus-within:text-[#C9A84C] transition-colors" />
           <input 
             type="text"
             placeholder="Numéro ou Nom Client..."
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="w-full h-16 pl-16 pr-8 bg-white border border-emerald-950/5 rounded-2xl outline-none focus:border-[#C9A84C] shadow-sm font-medium text-emerald-950 transition-all"
           />
        </div>
        <div className="flex bg-neutral-100 p-1.5 rounded-2xl border border-emerald-950/5 h-16 items-center">
            <Filter size={16} className="text-emerald-950/20 mx-4" />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-emerald-950 outline-none pr-8 cursor-pointer"
            >
              <option value="all">Tous les Statuts</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v.toUpperCase()}</option>
              ))}
            </select>
        </div>
      </section>

      <div className="bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl shadow-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-emerald-950/5 bg-neutral-50/50">
                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30">N° Commande</th>
                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30">Client / Destination</th>
                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30">Total</th>
                <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30">Statut</th>
                <th className="px-10 py-6 text-right text-[9px] font-black uppercase tracking-[0.3em] text-emerald-950/30">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/5">
              <AnimatePresence mode="popLayout">
                {filtered.map((order) => {
                  const name = order.guest_first_name ? `${order.guest_first_name} ${order.guest_last_name}` : `Client #${order.customer_id?.slice(0, 5)}`;
                  return (
                    <motion.tr 
                      layout
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="px-10 py-8">
                        <div>
                          <p className="font-serif text-lg text-emerald-950">{order.order_number}</p>
                          <p className="text-[9px] font-black tracking-widest text-emerald-950/20 uppercase mt-1">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div>
                          <p className="text-sm font-bold text-emerald-950">{name}</p>
                          <p className="text-[10px] text-emerald-950/40 font-medium">{order.guest_wilaya || '—'}</p>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <p className="font-serif text-xl text-emerald-950">{order.total_amount.toLocaleString()} <span className="text-xs font-normal">DZD</span></p>
                      </td>
                      <td className="px-10 py-8">
                         <select 
                           value={order.order_status}
                           onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                           className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer ${STATUS_COLORS[order.order_status]}`}
                         >
                           {Object.entries(STATUS_LABELS).map(([k, v]) => (
                             <option key={k} value={k}>{v.toUpperCase()}</option>
                           ))}
                         </select>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => generatePDF(order)}
                              className="w-12 h-12 rounded-xl bg-white border border-emerald-950/5 flex items-center justify-center text-emerald-950/40 hover:text-emerald-950 hover:border-emerald-950/20 transition-all shadow-sm"
                              title="Imprimer la facture"
                            >
                               <Printer size={16} />
                            </button>
                         </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
