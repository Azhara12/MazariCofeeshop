// Helper to safely extract size text
const getSizeLabel = (item) => {
  if (typeof item.size === 'string') return item.size;
  if (item.selectedSize?.name) return item.selectedSize.name;
  return '';
};

// Helper to safely extract milk text
const getMilkLabel = (item) => {
  return item.milk || item.selectedMilk || '';
};

export const printKOT = (order) => {
  if (!order) return;

  const itemsList = order.orderItems || order.items || [];
  const orderToken = order.orderId || order.orderNumber || '#MZR-0000';
  const orderType = order.deliveryMethod || order.orderType || 'Takeaway';

  const itemsHtml = itemsList.map((item, i) => {
    const size = getSizeLabel(item);
    const milk = getMilkLabel(item);
    const sweetness = item.sweetness || '';
    const extraShots = item.extraShots || 0;

    return `
      <tr style="border-bottom: 2px dashed #000;">
        <td style="padding: 8px 0; font-size: 15px; font-weight: bold; text-align: left;">
          ${i + 1}. ${item.name}
          <div style="font-size: 12px; font-weight: normal; margin-top: 4px; color: #222;">
            ${size ? `• Size: <b>${size}</b><br/>` : ''}
            ${milk ? `• Milk: <b>${milk}</b><br/>` : ''}
            ${sweetness ? `• Sweetness: <b>${sweetness}</b><br/>` : ''}
            ${extraShots > 0 ? `• Extra Shots: <b>+${extraShots}</b>` : ''}
          </div>
        </td>
        <td style="padding: 8px 0; font-size: 20px; font-weight: bold; text-align: right; vertical-align: top;">
          x${item.quantity || 1}
        </td>
      </tr>
    `;
  }).join('');

  const printArea = document.createElement('div');
  printArea.id = 'printable-receipt-container';
  printArea.innerHTML = `
    <style>
      @media screen {
        #printable-receipt-container { display: none !important; }
      }
      @media print {
        body * { visibility: hidden !important; }
        #printable-receipt-container, #printable-receipt-container * { visibility: visible !important; }
        #printable-receipt-container {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          background: #fff !important;
          color: #000 !important;
          padding: 10px !important;
        }
        @page { size: auto; margin: 0mm; }
      }
    </style>
    <div style="font-family: monospace; width: 280px; margin: 0 auto; color: #000;">
      <div style="text-align: center;">
        <h2 style="margin: 0; font-size: 22px;">MAZARICS KITCHEN</h2>
        <h3 style="margin: 4px 0; font-size: 18px;">TOKEN: ${orderToken}</h3>
        <p style="margin: 2px 0; font-size: 12px;">Type: <b>${orderType}</b></p>
        <p style="margin: 2px 0; font-size: 11px;">Time: ${new Date(order.createdAt || Date.now()).toLocaleTimeString()}</p>
      </div>
      <div style="border-top: 2px solid #000; margin: 8px 0;"></div>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #000;">
            <th style="text-align: left; font-size: 13px;">ITEM & SPECIFICATIONS</th>
            <th style="text-align: right; font-size: 13px;">QTY</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <div style="border-top: 2px solid #000; margin: 8px 0;"></div>
      <div style="text-align: center; margin-top: 12px;">
        <p style="font-size: 12px; font-weight: bold; margin: 0;">*** COOK / BARISTA COPY ***</p>
      </div>
    </div>
  `;

  const oldContainer = document.getElementById('printable-receipt-container');
  if (oldContainer) oldContainer.remove();

  document.body.appendChild(printArea);

  setTimeout(() => {
    window.print();
  }, 100);
};

export const printCustomerBill = (order) => {
  if (!order) return;

  const itemsList = order.orderItems || order.items || [];
  const orderToken = order.orderId || order.orderNumber || '#MZR-0000';
  const customerName = order.customerDetails?.fullName || order.customerName || 'Walk-in Customer';
  const orderType = order.deliveryMethod || order.orderType || 'Takeaway';
  
  const subtotal = order.pricing?.subtotal ?? order.subtotal ?? 0;
  const tax = order.pricing?.tax ?? order.tax ?? 0;
  const totalAmount = order.pricing?.totalAmount ?? order.totalAmount ?? 0;
  const paymentMethod = order.paymentMethod || 'Cash';
  const paymentStatus = order.paymentStatus || 'Paid';

  const itemsHtml = itemsList.map(item => {
    const size = getSizeLabel(item);
    const milk = getMilkLabel(item);

    return `
      <tr style="border-bottom: 1px dashed #ccc;">
        <td style="padding: 5px 0; font-size: 12px; text-align: left;">
          <b>${item.name}</b><br/>
          <small style="color:#555;">
            ${size ? size : ''} ${milk ? `| ${milk}` : ''}
          </small>
        </td>
        <td style="padding: 5px 0; font-size: 12px; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 5px 0; font-size: 12px; text-align: right;">$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  const printArea = document.createElement('div');
  printArea.id = 'printable-receipt-container';
  printArea.innerHTML = `
    <style>
      @media screen {
        #printable-receipt-container { display: none !important; }
      }
      @media print {
        body * { visibility: hidden !important; }
        #printable-receipt-container, #printable-receipt-container * { visibility: visible !important; }
        #printable-receipt-container {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          background: #fff !important;
          color: #000 !important;
          padding: 10px !important;
        }
        @page { size: auto; margin: 0mm; }
      }
    </style>
    <div style="font-family: 'Courier New', Courier, monospace; width: 280px; margin: 0 auto; color: #111;">
      <div style="text-align: center;">
        <h2 style="margin: 0; font-size: 20px; font-family: serif;">MAZARICS COFFEE</h2>
        <p style="margin: 2px 0; font-size: 10px;">Artisanal Coffee & Fresh Bakes</p>
        <p style="margin: 2px 0; font-size: 10px;">Faisal Town, Sadiqabad, Punjab</p>
        <p style="margin: 2px 0; font-size: 10px;">Tel: +92 300 1234567</p>
      </div>
      <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>
      <div style="font-size: 11px;">
        <div style="display: flex; justify-content: space-between;"><span>Order Token:</span><b>${orderToken}</b></div>
        <div style="display: flex; justify-content: space-between;"><span>Date:</span><span>${new Date(order.createdAt || Date.now()).toLocaleDateString()} ${new Date(order.createdAt || Date.now()).toLocaleTimeString()}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Customer:</span><span>${customerName}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Type:</span><span>${orderType}</span></div>
      </div>
      <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #000; font-size: 11px;">
            <th style="text-align: left;">Item</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>
      <div style="display: flex; justify-content: space-between; font-size: 12px;"><span>Subtotal:</span><span>$${Number(subtotal).toFixed(2)}</span></div>
      <div style="display: flex; justify-content: space-between; font-size: 12px;"><span>Tax:</span><span>$${Number(tax).toFixed(2)}</span></div>
      <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>
      <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: bold;">
        <span>GRAND TOTAL:</span>
        <span>$${Number(totalAmount).toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 4px;">
        <span>Payment:</span>
        <b>${paymentStatus} (${paymentMethod})</b>
      </div>
      <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>
      <div style="text-align: center; margin-top: 10px; font-size: 10px;">
        <p style="margin: 2px 0; font-weight: bold;">Thank you for visiting MazariCS!</p>
        <p style="margin: 2px 0;">Have a wonderful day ❤️</p>
      </div>
    </div>
  `;

  const oldContainer = document.getElementById('printable-receipt-container');
  if (oldContainer) oldContainer.remove();

  document.body.appendChild(printArea);

  setTimeout(() => {
    window.print();
  }, 100);
};