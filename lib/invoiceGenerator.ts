import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (order: any) => {
  try {
    console.log("Iniciando generación de PDF para el pedido:", order.id);
    
    const doc = new jsPDF();
    const companyName = "BAHÍA MODA";
    const companySlogan = "Estilo & Exclusividad";
    const date = new Date().toLocaleDateString('es-GT');
    
    // Safety check for ID
    const orderId = order.id || "00000";
    const invoiceId = `BM-${orderId.toString().split('-')[0].toUpperCase()}`;

    const total = Number(order.total || 0);
    const anticipo = Number(order.anticipo || (total * 0.5));

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
    doc.text(`${order.cliente_nombre || 'Cliente Genérico'}`, 20, 62);
    doc.text(`Tel: ${order.cliente_telefono || 'N/A'}`, 20, 68);
    doc.text(`Ubicación: ${order.ubicacion || order.ubicacion_entrega || 'No especificada'}`, 20, 74);

    // --- TABLE OF PRODUCTS ---
    const items = Array.isArray(order.items) ? order.items : [];
    const tableRows = items.map((item: any) => [
      item.name || 'Producto',
      item.size || 'N/A',
      (item.quantity || 1).toString(),
      `Q${Number(item.price || 0).toFixed(2)}`,
      `Q${(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}`
    ]);

    // Use autoTable as a function, not a doc method
    autoTable(doc, {
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
    // Get final Y after table
    const finalY = (doc as any).lastAutoTable?.finalY || 150;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL A PAGAR:`, 140, finalY + 10);
    doc.text(`Q${total.toFixed(2)}`, 185, finalY + 10, { align: 'right' });

    // Luxury Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(130, finalY + 15, 195, finalY + 15);

    // Anticipo Highlight
    doc.setFillColor(240, 240, 240);
    doc.rect(130, finalY + 18, 65, 12, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text(`ANTICIPO (50%):`, 135, finalY + 26);
    doc.setTextColor(0, 100, 0); // Dark Green
    doc.text(`Q${anticipo.toFixed(2)}`, 185, finalY + 26, { align: 'right' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`SALDO PENDIENTE:`, 135, finalY + 37);
    doc.text(`Q${(total - anticipo).toFixed(2)}`, 185, finalY + 37, { align: 'right' });

    // --- FOOTER ---
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text("Gracias por confiar en Bahía Moda. Para cualquier consulta sobre su entrega,", 105, 270, { align: 'center' });
    doc.text("contáctenos directamente por WhatsApp al +502 4272-1798", 105, 275, { align: 'center' });

    // Save the PDF
    doc.save(`${invoiceId}_BahiaModa.pdf`);
    console.log("PDF generado y descargado exitosamente.");
  } catch (error) {
    console.error("Error crítico en generateInvoicePDF:", error);
    throw error;
  }
};
