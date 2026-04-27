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

    // --- COLORES PREMIUM ---
    const navyBlue = [26, 37, 48] as const;
    const gold = [212, 175, 55] as const;

    // --- PAGE BACKGROUND & BORDERS ---
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');

    // --- HEADER / LOGO SECTION (NAVY BLUE) ---
    doc.setFillColor(...navyBlue);
    doc.rect(10, 10, 190, 45, 'F');

    // DIBUJAR LOGO "BM" GEOMÉTRICO (ORO)
    doc.setDrawColor(...gold);
    doc.setLineWidth(1);
    doc.circle(30, 32, 15, 'D'); // Outer Circle
    doc.setLineWidth(0.3);
    doc.circle(30, 32, 13.5, 'D'); // Inner thin circle
    
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("BM", 30, 34, { align: 'center' });

    // BRAND NAME
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("BAHÍA MODA", 55, 30);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(150, 160, 170);
    doc.text("EXCLUSIVIDAD & ESTILO EN CADA DETALLE", 55, 36);

    // INVOICE TYPE (RIGHT - GOLD BOX)
    doc.setFillColor(...gold);
    doc.rect(145, 18, 50, 8, 'F');
    doc.setTextColor(...navyBlue);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("ORDEN DE COMPRA", 170, 23.5, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(`#${invoiceId}`, 170, 35, { align: 'center' });
    doc.setFontSize(7);
    doc.setTextColor(180, 190, 200);
    doc.text(`EMITIDO: ${date}`, 170, 42, { align: 'center' });

    // --- CLIENT INFO (BOXED) ---
    doc.setFillColor(248, 250, 252); // Very light gray
    doc.roundedRect(15, 65, 180, 35, 3, 3, 'F');
    doc.setDrawColor(220, 225, 230);
    doc.roundedRect(15, 65, 180, 35, 3, 3, 'D');

    doc.setTextColor(...navyBlue);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN DEL CLIENTE", 25, 75);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("CLIENTE:", 25, 84);
    doc.text("TELÉFONO:", 25, 90);
    doc.text("ENTREGA:", 25, 96);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`${order.cliente_nombre || 'No registrado'}`, 55, 84);
    doc.text(`+502 ${order.cliente_telefono || 'N/A'}`, 55, 90);
    
    const splitUbicacion = doc.splitTextToSize(`${order.ubicacion || order.ubicacion_entrega || 'Puerto San José'}`, 130);
    doc.text(splitUbicacion, 55, 96);

    // --- STRIP BRAND FROM PRODUCT NAME ---
    const stripBrand = (name: string) => {
      if (!name) return 'Artículo de Lujo';
      return name.replace(/\s+de\s+(arabela|l'bel|lbel|scentia|esika|cyzone|avon|natura|mary kay)/i, '').trim();
    };

    // --- TABLE OF PRODUCTS ---
    const items = Array.isArray(order.items) ? order.items : [];
    const tableRows = items.map((item: any) => [
      stripBrand(item.name),
      item.size || 'N/A',
      item.quantity || 1,
      `Q${Number(item.price).toFixed(2)}`,
      `Q${(Number(item.price) * (item.quantity || 1)).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 110,
      margin: { left: 15, right: 15 },
      head: [['ARTÍCULO', 'TALLA', 'CANT.', 'P. UNITARIO', 'SUBTOTAL']],
      body: tableRows,
      theme: 'plain',
      headStyles: { 
        fillColor: navyBlue as [number, number, number], 
        textColor: gold as [number, number, number], 
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [50, 50, 50],
        cellPadding: 5
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      columnStyles: {
        0: { cellWidth: 80, halign: 'left', fontStyle: 'bold' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'right', fontStyle: 'bold', textColor: [0, 0, 0] }
      }
    });

    // Add a thick line under the table
    const finalY = (doc as any).lastAutoTable?.finalY || 150;
    doc.setDrawColor(...navyBlue);
    doc.setLineWidth(0.5);
    doc.line(15, finalY, 195, finalY);

    // --- FINANCIAL SUMMARY ---
    // Totals Box
    doc.setFontSize(9);
    doc.setTextColor(...navyBlue);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL PEDIDO:", 145, finalY + 15);
    doc.text(`Q${total.toFixed(2)}`, 190, finalY + 15, { align: 'right' });

    doc.setTextColor(34, 197, 94); // Green
    doc.text("ANTICIPO (PAGADO):", 145, finalY + 23);
    doc.text(`- Q${anticipo.toFixed(2)}`, 190, finalY + 23, { align: 'right' });

    // Golden Box for Final Balance
    doc.setDrawColor(...gold);
    doc.setLineWidth(1);
    doc.setFillColor(255, 255, 255);
    doc.rect(130, finalY + 28, 65, 12, 'FD'); // Fill and Draw
    
    doc.setTextColor(...navyBlue);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("SALDO A PAGAR:", 135, finalY + 36);
    doc.text(`Q${saldo.toFixed(2)}`, 190, finalY + 36, { align: 'right' });

    // --- FOOTER / SELLO & QR ---
    // Simulated QR Code (Grid of squares)
    doc.setFillColor(30, 30, 30);
    const qrSize = 25;
    const qrX = 15;
    const qrY = 250;
    doc.rect(qrX, qrY, qrSize, qrSize, 'F'); // Dark background
    doc.setFillColor(255, 255, 255);
    // Draw some white blocks to simulate a QR code
    for(let i=0; i<8; i++) {
        for(let j=0; j<8; j++) {
            if (Math.random() > 0.4) {
                doc.rect(qrX + 2 + (i*2.6), qrY + 2 + (j*2.6), 2.6, 2.6, 'F');
            }
        }
    }
    // "Eyes" of the QR
    doc.setFillColor(30, 30, 30);
    doc.rect(qrX + 2, qrY + 2, 6, 6, 'F');
    doc.rect(qrX + qrSize - 8, qrY + 2, 6, 6, 'F');
    doc.rect(qrX + 2, qrY + qrSize - 8, 6, 6, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(qrX + 3, qrY + 3, 4, 4, 'F');
    doc.rect(qrX + qrSize - 7, qrY + 3, 4, 4, 'F');
    doc.rect(qrX + 3, qrY + qrSize - 7, 4, 4, 'F');
    doc.setFillColor(30, 30, 30);
    doc.rect(qrX + 4, qrY + 4, 2, 2, 'F');
    doc.rect(qrX + qrSize - 6, qrY + 4, 2, 2, 'F');
    doc.rect(qrX + 4, qrY + qrSize - 6, 2, 2, 'F');

    // Official Stamp (Vector Circles)
    doc.setDrawColor(...navyBlue);
    doc.setLineWidth(0.5);
    doc.circle(180, 260, 16, 'D');
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.2);
    doc.circle(180, 260, 14.5, 'D');
    doc.circle(180, 260, 10, 'D');
    
    doc.setTextColor(...navyBlue);
    doc.setFontSize(7);
    doc.text("BAHÍA MODA", 180, 258, { align: 'center' });
    doc.setFontSize(5);
    doc.text("SELLO DE AUTENTICIDAD", 180, 262, { align: 'center' });

    // Legal Footer
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 130, 140);
    const footerText = "Este recibo garantiza su reserva. Los artículos están sujetos a disponibilidad. Válido por 30 días.";
    doc.text(footerText, 15, 282);
    
    doc.setFont("helvetica", "bold");
    doc.text(`ID VERIFICACIÓN: ${order.id}`, 15, 286);

    // Save the PDF
    doc.save(`${invoiceId}_BahiaModa_Official.pdf`);
    
  } catch (error) {
    console.error("Error en PDF Ultra-Premium:", error);
    throw error;
  }
};


