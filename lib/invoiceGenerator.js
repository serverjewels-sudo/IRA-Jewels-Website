import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInvoice(order) {
  const doc = new jsPDF();

  // --- Header ---
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("TATVAAN", 14, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Princess Plaza, Mini Bazar,", 14, 30);
  doc.text("9th Floor 905, Surat, Gujarat", 14, 35);
  doc.text("GSTIN: 24AAHCI5512M1ZH", 14, 40);

  // --- Invoice Info ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 140, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice Ref: ${order.order_number}`, 140, 30);
  
  const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  doc.text(`Date: ${orderDate}`, 140, 35);

  // --- Bill To ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 14, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`${order.customer_name}`, 14, 62);
  
  if (order.shipping_address) {
    const { address, city, state, pincode } = order.shipping_address;
    doc.text(`${address}`, 14, 67);
    doc.text(`${city}, ${state} - ${pincode}`, 14, 72);
  }

  // --- Itemized Table ---
  const tableRows = [];
  
  order.items.forEach((item) => {
    // If order was placed before pre_tax_price was saved, fallback to a 3% reverse calc
    const preTaxPrice = item.pre_tax_price || (item.price / 1.03);
    const lineTotal = preTaxPrice * item.quantity;
    
    tableRows.push([
      item.name,
      item.quantity,
      `Rs ${Number(preTaxPrice).toFixed(2)}`,
      `Rs ${Number(lineTotal).toFixed(2)}`
    ]);
  });

  autoTable(doc, {
    startY: 85,
    head: [["Product Name", "Qty", "Unit Price (Pre-tax)", "Line Total"]],
    body: tableRows,
    theme: "striped",
    headStyles: { fillColor: [46, 49, 53] },
    styles: { fontSize: 10, cellPadding: 4 },
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  
  // --- Summary Calculations ---
  // Using exact stored values if available, otherwise fallback to backward-compatible reverse calculation
  const totalGst = Number(order.total_gst_amount) || (Number(order.subtotal) - (Number(order.subtotal) / 1.03));
  const subtotalPreTax = Number(order.pre_tax_subtotal) || (Number(order.subtotal) / 1.03);
  const shipping = Number(order.shipping) || 0;
  const grandTotal = Number(order.total);
  
  const state = order.shipping_address?.state?.toLowerCase() || "";
  
  // Summary block
  const summaryX = 140;
  let currentY = finalY;
  
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", summaryX, currentY);
  doc.text(`Rs ${subtotalPreTax.toFixed(2)}`, 196, currentY, { align: "right" });
  currentY += 7;

  if (state === "gujarat") {
    // Split GST
    const halfGst = totalGst / 2;
    doc.text("CGST:", summaryX, currentY);
    doc.text(`Rs ${halfGst.toFixed(2)}`, 196, currentY, { align: "right" });
    currentY += 7;
    doc.text("SGST:", summaryX, currentY);
    doc.text(`Rs ${halfGst.toFixed(2)}`, 196, currentY, { align: "right" });
    currentY += 7;
  } else {
    // IGST
    doc.text("IGST:", summaryX, currentY);
    doc.text(`Rs ${totalGst.toFixed(2)}`, 196, currentY, { align: "right" });
    currentY += 7;
  }
  
  if (shipping > 0) {
    doc.text("Shipping:", summaryX, currentY);
    doc.text(`Rs ${shipping.toFixed(2)}`, 196, currentY, { align: "right" });
    currentY += 7;
  }

  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", summaryX, currentY);
  doc.text(`Rs ${grandTotal.toFixed(2)}`, 196, currentY, { align: "right" });
  
  // --- Footer ---
  const paymentMethod = order.payment_method === "razorpay" ? "Razorpay (Online)" : "Cash on Delivery";
  const paymentStatus = order.payment_status === "paid" ? "Paid" : "Pending";
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Payment Method: ${paymentMethod}`, 14, finalY);
  doc.text(`Payment Status: ${paymentStatus}`, 14, finalY + 7);

  // Save PDF
  doc.save(`${order.order_number}-Invoice.pdf`);
}
