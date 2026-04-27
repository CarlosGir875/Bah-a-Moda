import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (order: any) => {
  try {
    console.log("Iniciando generación de PDF Ultra-Premium para el pedido:", order.id);
    
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('es-GT');
    const orderId = order.id || "00000";
    const shortId = orderId.toString().split('-')[0].toUpperCase();
    const invoiceId = `BM-${shortId}`;

    const total = Number(order.total || 0);
    const anticipo = Number(order.anticipo || (total * 0.5));
    const saldo = total - anticipo;

    // --- PAGE BORDERS (PREMIUM STYLE) ---
    doc.setDrawColor(20, 20, 20);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 287); // Outer border
    doc.setLineWidth(0.1);
    doc.rect(7, 7, 196, 283); // Inner thin border

    // --- HEADER / LOGO SECTION ---
    // Background for Logo area
    doc.setFillColor(15, 15, 15);
    doc.rect(7, 7, 196, 45, 'F');

    // DIBUJAR LOGO "BM" GEOMÉTRICO
    doc.setDrawColor(212, 175, 55); // Metallic Gold
    doc.setLineWidth(1);
    doc.circle(30, 30, 15, 'D'); // Outer Circle
    
    doc.setTextColor(212, 175, 55);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("B", 25, 32);
    doc.text("M", 31, 32);

    // BRAND NAME
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("BAHÍA MODA", 55, 28);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 180);
    doc.text("E X C L U S I V I D A D   &   E S T I L O", 55, 35);

    // INVOICE TYPE (RIGHT)
    doc.setFillColor(212, 175, 55); // Gold Accent
    doc.rect(145, 15, 50, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("ORDEN DE COMPRA", 170, 21, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(`#${invoiceId}`, 170, 35, { align: 'center' });
    doc.setFontSize(7);
    doc.text(`EMITIDO: ${date}`, 170, 42, { align: 'center' });

    // --- CLIENT INFO (BOXED) ---
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 60, 180, 40, 3, 3, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, 60, 180, 40, 3, 3, 'D');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN DEL CLIENTE", 25, 70);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`NOMBRE: ${order.cliente_nombre || 'No registrado'}`, 25, 78);
    doc.text(`TELÉFONO: +502 ${order.cliente_telefono || 'N/A'}`, 25, 84);
    
    const splitUbicacion = doc.splitTextToSize(`ENTREGA: ${order.ubicacion || order.ubicacion_entrega || 'Puerto San José'}`, 150);
    doc.text(splitUbicacion, 25, 90);

    // --- TABLE OF PRODUCTS ---
    const items = Array.isArray(order.items) ? order.items : [];
    const tableRows = items.map((item: any) => [
      item.name || 'Producto Exclusivo',
      item.size || 'N/A',
      item.quantity || 1,
      `Q${Number(item.price).toFixed(2)}`,
      `Q${(Number(item.price) * (item.quantity || 1)).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 110,
      margin: { left: 15, right: 15 },
      head: [['ARTÍCULO / DESCRIPCIÓN', 'TALLA', 'CANT', 'PRECIO UNIT.', 'SUBTOTAL']],
      body: tableRows,
      theme: 'striped',
      headStyles: { 
        fillColor: [15, 15, 15], 
        textColor: [212, 175, 55], 
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center'
      },
      styles: { fontSize: 8, cellPadding: 5, font: 'helvetica' },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'right', fontStyle: 'bold' }
      }
    });

    // --- FINANCIAL SUMMARY ---
    const finalY = (doc as any).lastAutoTable?.finalY || 180;
    
    // Totals Box
    doc.setFillColor(248, 250, 252);
    doc.rect(130, finalY + 5, 65, 35, 'F');
    doc.setDrawColor(15, 15, 15);
    doc.setLineWidth(0.5);
    doc.line(130, finalY + 5, 195, finalY + 5);

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("TOTAL PEDIDO:", 135, finalY + 15);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`Q${total.toFixed(2)}`, 190, finalY + 15, { align: 'right' });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(34, 197, 94); // Green
    doc.text("ANTICIPO (PAGADO):", 135, finalY + 23);
    doc.text(`- Q${anticipo.toFixed(2)}`, 190, finalY + 23, { align: 'right' });

    doc.setFillColor(15, 15, 15);
    doc.rect(130, finalY + 28, 65, 12, 'F');
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("SALDO A PAGAR:", 135, finalY + 36);
    doc.text(`Q${saldo.toFixed(2)}`, 190, finalY + 36, { align: 'right' });

    // --- FOOTER / SELLO ---
    // Barcode at bottom left
    doc.setFillColor(0, 0, 0);
    for(let i=0; i<30; i++) {
        const w = Math.random() * 1.5;
        doc.rect(15 + (i*1.2), 265, w, 10, 'F');
    }
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text(`SECURE_ID: ${order.id}`, 15, 278);

    // Official Stamp (Vector Circle)
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.2);
    doc.circle(170, 260, 15, 'D');
    doc.setFontSize(6);
    doc.text("BAHÍA MODA", 170, 258, { align: 'center' });
    doc.text("OFFICIAL", 170, 262, { align: 'center' });
    doc.text("DOCUMENT", 170, 266, { align: 'center' });

    // Legal Footer
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    const footerText = "Este recibo es el comprobante oficial de su reserva. Bahía Moda garantiza la autenticidad de sus productos. " +
                      "Cualquier cambio se gestiona exclusivamente con el ID de orden.";
    doc.text(footerText, 105, 285, { align: 'center' });

    // Save the PDF
    doc.save(`${invoiceId}_BahiaModa_Official.pdf`);
    
  } catch (error) {
    console.error("Error en PDF Ultra-Premium:", error);
    throw error;
  }
};


