import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autotable
interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export const generateInvoicePDF = (order: any) => {
  const doc = new jsPDF() as jsPDFWithPlugin;
  const companyName = "BAHÍA MODA";
  const companySlogan = "Estilo & Exclusividad";
  const date = new Date().toLocaleDateString('es-GT');
  const invoiceId = `BM-${order.id.split('-')[0].toUpperCase()}`;

  // --- HEADER DESIGN ---
  // Background rectangle for header
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 210, 40, 'F');

  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(companyName, 20, 25);

  // Slogan
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text(companySlogan, 20, 32);

  // Invoice Details (Right Side)
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`RECIBO DE RESERVA`, 140, 20);
  doc.setFont("helvetica", "normal");
  doc.text(`No: ${invoiceId}`, 140, 26);
  doc.text(`Fecha: ${date}`, 140, 32);

  // --- CLIENT INFO ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENTE:", 20, 55);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`${order.cliente_nombre}`, 20, 62);
  doc.text(`Tel: ${order.cliente_telefono}`, 20, 68);
  doc.text(`Ubicación: ${order.ubicacion || order.ubicacion_entrega}`, 20, 74);

  // --- TABLE OF PRODUCTS ---
  const tableRows = order.items.map((item: any) => [
    item.name,
    item.size || 'N/A',
    item.quantity.toString(),
    `Q${item.price.toFixed(2)}`,
    `Q${(item.price * item.quantity).toFixed(2)}`
  ]);

  doc.autoTable({
    startY: 85,
    head: [['Descripción del Producto', 'Talla', 'Cant.', 'Precio Unit.', 'Subtotal']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'right' }
    }
  });

  // --- FINANCIAL SUMMARY ---
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL A PAGAR:`, 140, finalY + 5);
  doc.text(`Q${order.total.toFixed(2)}`, 185, finalY + 5, { align: 'right' });

  // Luxury Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(130, finalY + 10, 195, finalY + 10);

  // Anticipo Highlight
  doc.setFillColor(240, 240, 240);
  doc.rect(130, finalY + 13, 65, 12, 'F');
  doc.setTextColor(0, 0, 0);
  doc.text(`ANTICIPO (50%):`, 135, finalY + 21);
  doc.setTextColor(0, 100, 0); // Dark Green
  doc.text(`Q${order.anticipo.toFixed(2)}`, 185, finalY + 21, { align: 'right' });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`SALDO PENDIENTE:`, 135, finalY + 32);
  doc.text(`Q${(order.total - order.anticipo).toFixed(2)}`, 185, finalY + 32, { align: 'right' });

  // --- FOOTER ---
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text("Gracias por confiar en Bahía Moda. Para cualquier consulta sobre su entrega,", 105, 270, { align: 'center' });
  doc.text("contáctenos directamente por WhatsApp al +502 4272-1798", 105, 275, { align: 'center' });

  // Save the PDF
  doc.save(`${invoiceId}_BahiaModa.pdf`);
};
