import React from 'react';
import { Printer, Utensils } from 'lucide-react';
import { printKOT, printCustomerBill } from '../../utils/printEngine';

const OrderPrintActions = ({ currentOrder }) => {
  if (!currentOrder) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {/* 1. Print Cook / Kitchen Slip */}
      <button
        type="button"
        onClick={() => printKOT(currentOrder)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-stone-100 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
        title="Print Kitchen Order Slip for Cook/Barista"
      >
        <Utensils className="w-3.5 h-3.5 text-amber-400" />
        Print KOT
      </button>

      {/* 2. Print Customer Bill */}
      <button
        type="button"
        onClick={() => printCustomerBill(currentOrder)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C68B45] hover:bg-[#a87337] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
        title="Print Customer Tax Bill Invoice"
      >
        <Printer className="w-3.5 h-3.5" />
        Print Bill
      </button>
    </div>
  );
};

export default OrderPrintActions;