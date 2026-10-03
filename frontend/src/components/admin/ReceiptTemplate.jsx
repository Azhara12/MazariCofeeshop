import React, { forwardRef } from 'react';

const getSizeLabel = (item) => {
  if (typeof item.size === 'string') return item.size;
  if (item.selectedSize?.name) return item.selectedSize.name;
  return '';
};

const getMilkLabel = (item) => item.milk || item.selectedMilk || '';

export const ReceiptTemplate = forwardRef(({ order, type }, ref) => {
  if (!order) return null;

  const itemsList = order.orderItems || order.items || [];
  const orderToken = order.orderId || order.orderNumber || '#MZR-0000';
  const customerName = order.customerDetails?.fullName || order.customerName || 'Walk-in Customer';
  const orderType = order.deliveryMethod || order.orderType || 'Takeaway';

  const subtotal = order.pricing?.subtotal ?? order.subtotal ?? 0;
  const tax = order.pricing?.tax ?? order.tax ?? 0;
  const totalAmount = order.pricing?.totalAmount ?? order.totalAmount ?? 0;
  const paymentMethod = order.paymentMethod || 'Cash';
  const paymentStatus = order.paymentStatus || 'Paid';

  return (
    <div className="hidden">
      <div ref={ref} className="p-4 w-[280px] mx-auto text-black font-mono text-xs bg-white">
        {type === 'KOT' ? (
          /* Kitchen Order Ticket (KOT) Template */
          <div>
            <div className="text-center font-bold">
              <h2 className="text-lg uppercase">MazariCS Kitchen</h2>
              <h3 className="text-base font-extrabold">TOKEN: {orderToken}</h3>
              <p className="text-xs">Type: <b>{orderType}</b></p>
              <p className="text-[10px]">Time: {new Date(order.createdAt || Date.now()).toLocaleTimeString()}</p>
            </div>

            <div className="border-b-2 border-black my-2" />

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-xs">
                  <th className="py-1">ITEM & SPECIFICATIONS</th>
                  <th className="py-1 text-right">QTY</th>
                </tr>
              </thead>
              <tbody>
                {itemsList.map((item, i) => {
                  const size = getSizeLabel(item);
                  const milk = getMilkLabel(item);
                  return (
                    <tr key={i} className="border-b border-dashed border-black">
                      <td className="py-2">
                        <span className="font-bold text-sm">{i + 1}. {item.name}</span>
                        <div className="text-[11px] font-normal leading-tight">
                          {size && <div>• Size: <b>{size}</b></div>}
                          {milk && <div>• Milk: <b>{milk}</b></div>}
                          {item.sweetness && <div>• Sweetness: <b>{item.sweetness}</b></div>}
                          {item.extraShots > 0 && <div>• Extra Shots: <b>+{item.extraShots}</b></div>}
                        </div>
                      </td>
                      <td className="py-2 text-right font-bold text-base align-top">
                        x{item.quantity || 1}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="border-b-2 border-black my-2" />
            <div className="text-center font-bold text-xs mt-3">
              *** COOK / BARISTA COPY ***
            </div>
          </div>
        ) : (
          /* Customer Bill Template */
          <div>
            <div className="text-center">
              <h2 className="text-lg font-serif font-bold uppercase">MazariCS Coffee</h2>
              <p className="text-[10px]">Artisanal Coffee & Fresh Bakes</p>
              <p className="text-[10px]">Faisal Town, Sadiqabad, Punjab</p>
              <p className="text-[10px]">Tel: +92 300 1234567</p>
            </div>

            <div className="border-b border-dashed border-black my-2" />

            <div className="text-[11px] space-y-0.5">
              <div className="flex justify-between"><span>Token:</span><b>{orderToken}</b></div>
              <div className="flex justify-between"><span>Date:</span><span>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span>Customer:</span><span>{customerName}</span></div>
              <div className="flex justify-between"><span>Type:</span><span>{orderType}</span></div>
            </div>

            <div className="border-b border-dashed border-black my-2" />

            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black text-[11px]">
                  <th className="pb-1">Item</th>
                  <th className="pb-1 text-center">Qty</th>
                  <th className="pb-1 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-stone-300">
                {itemsList.map((item, i) => {
                  const size = getSizeLabel(item);
                  const milk = getMilkLabel(item);
                  return (
                    <tr key={i}>
                      <td className="py-1">
                        <b>{item.name}</b>
                        {(size || milk) && <div className="text-[10px] text-stone-600">{size} {milk && `| ${milk}`}</div>}
                      </td>
                      <td className="py-1 text-center">{item.quantity || 1}</td>
                      <td className="py-1 text-right">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="border-b border-dashed border-black my-2" />

            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span>Subtotal:</span><span>${Number(subtotal).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax:</span><span>${Number(tax).toFixed(2)}</span></div>
              <div className="border-b border-dashed border-black my-1" />
              <div className="flex justify-between text-sm font-bold">
                <span>TOTAL:</span>
                <span>${Number(totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Payment:</span>
                <b>{paymentStatus} ({paymentMethod})</b>
              </div>
            </div>

            <div className="border-b border-dashed border-black my-2" />
            <div className="text-center text-[10px] font-bold mt-2">
              <p>Thank you for visiting MazariCS!</p>
              <p>Have a wonderful day ❤️</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});