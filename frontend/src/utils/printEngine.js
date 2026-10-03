/**
 * printEngine.js
 * ─────────────────────────────────────────────────────────────────
 * Generates KOT (Kitchen Order Ticket) and Customer Bill slips
 * optimised for 80mm thermal printers (no pagination breaks).
 *
 * Uses an invisible in-DOM print container so browser popup
 * blockers never fire.
 */

// ── Helpers ───────────────────────────────────────────────────────────────────
const getSizeLabel   = (item) => typeof item.size === 'string' ? item.size : item.selectedSize?.name || '';
const getMilkLabel   = (item) => item.milk || item.selectedMilk || '';

// ── Core print executor ───────────────────────────────────────────────────────
const executeCleanPrint = (htmlContent) => {
  // Remove any previous print container
  document.getElementById('mazarics-print-container')?.remove();

  const container = document.createElement('div');
  container.id    = 'mazarics-print-container';

  container.innerHTML = `
    <style>
      /* Hidden on screen */
      @media screen {
        #mazarics-print-container { display: none !important; }
      }

      /* Thermal-printer optimised print styles */
      @media print {
        /* Hide everything except our container */
        body > *:not(#mazarics-print-container) { display: none !important; }

        @page {
          size: 80mm auto;   /* 80 mm width, auto height – no forced page breaks */
          margin: 0;
        }

        #mazarics-print-container {
          display: block !important;
          position: absolute;
          top: 0;
          left: 0;
          width: 80mm;
          background: #fff;
          color: #000;
          /* Prevent the browser from inserting extra blank pages */
          page-break-after: avoid;
          page-break-inside: avoid;
        }

        /* Prevent widows/orphans across auto-sized content */
        * {
          page-break-inside: avoid;
          orphans: 1;
          widows: 1;
        }
      }
    </style>
    ${htmlContent}
  `;

  document.body.appendChild(container);

  // Small delay to allow DOM repaint, then trigger native print
  setTimeout(() => window.print(), 150);
};

// ── 1. Kitchen Order Ticket (KOT) ─────────────────────────────────────────────
export const printKOT = (order) => {
  if (!order) return;

  const items     = order.orderItems || order.items || [];
  const token     = order.orderId || order.orderNumber || '#MZR-0000';
  const orderType = order.deliveryMethod || order.orderType || 'Takeaway';
  const time      = new Date(order.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const itemsHtml = items.map((item, i) => {
    const size       = getSizeLabel(item);
    const milk       = getMilkLabel(item);
    const sweetness  = item.sweetness || '';
    const extraShots = item.extraShots || 0;

    return `
      <tr style="border-bottom: 1px dashed #000;">
        <td style="padding: 7px 0; font-size: 14px; font-weight: bold; text-align: left; vertical-align: top;">
          ${i + 1}. ${item.name}
          <div style="font-size: 11px; font-weight: normal; color: #222; margin-top: 3px; line-height: 1.5;">
            ${size       ? `• Size: <b>${size}</b><br/>` : ''}
            ${milk       ? `• Milk: <b>${milk}</b><br/>` : ''}
            ${sweetness  ? `• Sugar: <b>${sweetness}</b><br/>` : ''}
            ${extraShots > 0 ? `• Extra Shots: <b>+${extraShots}</b>` : ''}
          </div>
        </td>
        <td style="padding: 7px 4px 7px 0; font-size: 18px; font-weight: 900; text-align: right; vertical-align: top; white-space: nowrap;">
          ×${item.quantity || 1}
        </td>
      </tr>
    `;
  }).join('');

  const content = `
    <div style="font-family: 'Courier New', Courier, monospace; width: 78mm; margin: 0; padding: 8px 4px; color: #000;">
      <div style="text-align: center; margin-bottom: 6px;">
        <div style="font-size: 20px; font-weight: 900; letter-spacing: 1px;">MAZARICS KITCHEN</div>
        <div style="font-size: 16px; font-weight: 700; margin-top: 3px;">TOKEN: ${token}</div>
        <div style="font-size: 11px; margin-top: 2px;">Type: <b>${orderType}</b></div>
        <div style="font-size: 10px; color: #555;">Time: ${time}</div>
      </div>

      <div style="border-top: 2px solid #000; margin: 6px 0;"></div>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #000;">
            <th style="text-align: left; font-size: 11px; padding-bottom: 4px;">ITEM &amp; SPECS</th>
            <th style="text-align: right; font-size: 11px; padding-bottom: 4px;">QTY</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <div style="border-top: 2px solid #000; margin: 8px 0;"></div>
      <div style="text-align: center; font-size: 11px; font-weight: bold;">*** COOK / BARISTA COPY ***</div>
    </div>
  `;

  executeCleanPrint(content);
};

// ── 2. Customer Tax Invoice / Bill ────────────────────────────────────────────
export const printCustomerBill = (order) => {
  if (!order) return;

  const items         = order.orderItems || order.items || [];
  const token         = order.orderId || order.orderNumber || '#MZR-0000';
  const customerName  = order.customerDetails?.fullName || order.customerName || 'Walk-in Customer';
  const orderType     = order.deliveryMethod || order.orderType || 'Takeaway';
  const subtotal      = Number(order.pricing?.subtotal     ?? order.subtotal    ?? 0);
  const tax           = Number(order.pricing?.tax          ?? order.tax         ?? 0);
  const shippingFee   = Number(order.pricing?.shippingFee  ?? order.shippingFee ?? 0);
  const discount      = Number(order.pricing?.discount     ?? order.discount    ?? 0);
  const totalAmount   = Number(order.pricing?.totalAmount  ?? order.totalAmount ?? 0);
  const paymentMethod = order.paymentMethod  || 'Cash';
  const paymentStatus = order.paymentStatus  || 'Paid';
  const dateStr       = new Date(order.createdAt || Date.now()).toLocaleString();

  const itemsHtml = items.map(item => {
    const size = getSizeLabel(item);
    const milk = getMilkLabel(item);
    const lineTotal = ((item.price || 0) * (item.quantity || 1)).toFixed(2);

    return `
      <tr style="border-bottom: 1px dashed #ccc;">
        <td style="padding: 5px 2px; font-size: 11px; text-align: left; vertical-align: top;">
          <b>${item.name}</b><br/>
          <span style="color: #555; font-size: 10px;">
            ${size ? size : ''}${milk ? (size ? ' | ' : '') + milk : ''}
          </span>
        </td>
        <td style="padding: 5px 4px; font-size: 11px; text-align: center; vertical-align: top;">${item.quantity || 1}</td>
        <td style="padding: 5px 2px; font-size: 11px; text-align: right; vertical-align: top; white-space: nowrap;">$${lineTotal}</td>
      </tr>
    `;
  }).join('');

  const content = `
    <div style="font-family: 'Courier New', Courier, monospace; width: 78mm; margin: 0; padding: 8px 4px; color: #111;">

      <!-- Header -->
      <div style="text-align: center; margin-bottom: 6px;">
        <div style="font-family: serif; font-size: 18px; font-weight: 900;">MAZARICS COFFEE</div>
        <div style="font-size: 9px; color: #555; margin-top: 2px;">Artisanal Coffee &amp; Fresh Bakes</div>
        <div style="font-size: 9px; color: #555;">Faisal Town, Sadiqabad, Punjab</div>
        <div style="font-size: 9px; color: #555;">Tel: +92 300 1234567</div>
      </div>

      <div style="border-top: 1px dashed #000; margin: 6px 0;"></div>

      <!-- Order Info -->
      <div style="font-size: 10px; line-height: 1.7;">
        <div style="display: flex; justify-content: space-between;"><span>Token:</span><b>${token}</b></div>
        <div style="display: flex; justify-content: space-between;"><span>Date:</span><span>${dateStr}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Customer:</span><span>${customerName}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Type:</span><span>${orderType}</span></div>
      </div>

      <div style="border-top: 1px dashed #000; margin: 6px 0;"></div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #000;">
            <th style="text-align: left; font-size: 10px; padding-bottom: 3px;">Item</th>
            <th style="text-align: center; font-size: 10px; padding-bottom: 3px;">Qty</th>
            <th style="text-align: right; font-size: 10px; padding-bottom: 3px;">Amt</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <div style="border-top: 1px dashed #000; margin: 6px 0;"></div>

      <!-- Totals -->
      <div style="font-size: 11px; line-height: 1.8;">
        <div style="display: flex; justify-content: space-between;"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
        ${discount > 0 ? `<div style="display: flex; justify-content: space-between; color: #16a34a;"><span>Discount:</span><span>-$${discount.toFixed(2)}</span></div>` : ''}
        ${shippingFee > 0 ? `<div style="display: flex; justify-content: space-between;"><span>Shipping:</span><span>$${shippingFee.toFixed(2)}</span></div>` : ''}
        <div style="display: flex; justify-content: space-between;"><span>Tax:</span><span>$${tax.toFixed(2)}</span></div>
      </div>

      <div style="border-top: 1px solid #000; margin: 6px 0;"></div>

      <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 900;">
        <span>TOTAL:</span>
        <span>$${totalAmount.toFixed(2)}</span>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 10px; margin-top: 3px;">
        <span>Payment:</span>
        <b>${paymentStatus} (${paymentMethod})</b>
      </div>

      <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>

      <!-- Footer -->
      <div style="text-align: center; font-size: 9px; color: #555; line-height: 1.7;">
        <div style="font-weight: bold; font-size: 10px;">Thank you for visiting MazariCS!</div>
        <div>Come back soon ☕</div>
        <div style="margin-top: 4px;">mazarics.com</div>
      </div>
    </div>
  `;

  executeCleanPrint(content);
};