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
    const black = [20, 20, 20] as const;
    const grey = [100, 100, 100] as const;

    // --- PAGE BACKGROUND ---
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');

    // --- HEADER ---
    // LOGO "BM" (Black circle, gold border)
    doc.setFillColor(...black);
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.5);
    doc.circle(25, 25, 12, 'FD'); // Fill and Draw
    
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("BM", 25, 27, { align: 'center' });

    // BRAND NAME (Black text)
    doc.setTextColor(...black);
    doc.setFontSize(22);
    doc.text("BAHÍA MODA", 45, 24);
    
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grey);
    doc.text("E X C L U S I V I D A D   &   E S T I L O", 45, 29);

    // INVOICE TYPE (RIGHT - GOLD BOX)
    doc.setFillColor(...gold);
    doc.rect(145, 15, 50, 7, 'F');
    doc.setTextColor(...black);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("ORDEN DE COMPRA", 170, 20, { align: 'center' });

    doc.setTextColor(...black);
    doc.setFontSize(11);
    doc.text(`#${invoiceId}`, 170, 29, { align: 'center' });
    doc.setFontSize(6);
    doc.setTextColor(...grey);
    doc.text(`EMITIDO: ${date}`, 170, 34, { align: 'center' });

    // --- GOLD DIVIDER LINE ---
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.5);
    doc.line(15, 42, 195, 42);

    // --- CLIENT INFO (LIGHT GREY BOX) ---
    doc.setFillColor(243, 244, 246); // #F3F4F6
    doc.roundedRect(15, 50, 180, 30, 2, 2, 'F');

    doc.setTextColor(...black);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN DEL CLIENTE", 20, 58);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("NOMBRE:", 20, 65);
    doc.text("TELÉFONO:", 20, 70);
    doc.text("ENTREGA:", 20, 75);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...black);
    doc.text(`${order.cliente_nombre || 'No registrado'}`, 45, 65);
    doc.text(`+502 ${order.cliente_telefono || 'N/A'}`, 45, 70);
    
    const splitUbicacion = doc.splitTextToSize(`${order.ubicacion || order.ubicacion_entrega || 'Puerto San José'}`, 140);
    doc.text(splitUbicacion, 45, 75);

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
      startY: 90,
      margin: { left: 15, right: 15 },
      head: [['ARTÍCULO / DESCRIPCIÓN', 'TALLA', 'CANT', 'PRECIO UNIT.', 'SUBTOTAL']],
      body: tableRows,
      theme: 'plain',
      headStyles: { 
        fillColor: navyBlue as [number, number, number], 
        textColor: gold as [number, number, number], 
        fontStyle: 'normal',
        fontSize: 8,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [0, 0, 0],
        cellPadding: 4
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      columnStyles: {
        0: { cellWidth: 80, halign: 'left' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'right' }
      }
    });

    // Add a gold line under the table
    const finalY = (doc as any).lastAutoTable?.finalY || 120;
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.5);
    doc.line(15, finalY + 5, 195, finalY + 5);

    // --- FINANCIAL SUMMARY ---
    // Totals Box
    doc.setFontSize(8);
    doc.setTextColor(...black);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL PEDIDO:", 145, finalY + 15);
    doc.text(`Q${total.toFixed(2)}`, 190, finalY + 15, { align: 'right' });

    doc.setTextColor(34, 197, 94); // Green
    doc.text("ANTICIPO (PAGADO):", 145, finalY + 22);
    doc.text(`- Q${anticipo.toFixed(2)}`, 190, finalY + 22, { align: 'right' });

    // Solid Gold Box for Final Balance
    doc.setFillColor(...gold);
    doc.rect(130, finalY + 27, 65, 10, 'F'); 
    
    doc.setTextColor(...black);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("SALDO A PAGAR:", 135, finalY + 34);
    doc.text(`Q${saldo.toFixed(2)}`, 190, finalY + 34, { align: 'right' });

    // --- FOOTER / SELLO & BARCODE ---
    // Barcode (Simulated lines)
    doc.setFillColor(...black);
    for(let i=0; i<30; i++) {
        const w = Math.random() * 1.5;
        doc.rect(15 + (i*1.2), 260, w, 10, 'F');
    }
    doc.setFontSize(5);
    doc.setTextColor(...grey);
    doc.setFont("helvetica", "normal");
    doc.text(`SECURE_ID: ${order.id}`, 15, 273);

    // Official Stamp (Concentric Circles, right side)
    doc.setDrawColor(...black);
    doc.setLineWidth(0.3);
    doc.circle(180, 260, 15, 'D'); // Outer
    doc.setLineWidth(0.1);
    doc.circle(180, 260, 13.5, 'D'); // Inner 1
    doc.circle(180, 260, 9, 'D'); // Inner 2
    
    doc.setTextColor(...black);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text("BAHÍA MODA", 180, 258, { align: 'center' });
    doc.setFontSize(4);
    doc.setFont("helvetica", "normal");
    doc.text("SELLO DE", 180, 262, { align: 'center' });
    doc.text("AUTENTICIDAD", 180, 265, { align: 'center' });

    // Legal Footer
    doc.setFontSize(6);
    doc.setTextColor(...grey);
    const footerText = "Este recibo es su comprobante oficial. Su reserva. Bahía Moda garantiza la autenticidad de sus productos. Cualquier cambio se gestiona exclusivamente con el ID de orden.";
    doc.text(footerText, 15, 280);

    // Save the PDF
    doc.save(`${invoiceId}_BahiaModa_Official.pdf`);
    
  } catch (error) {
    console.error("Error en PDF Ultra-Premium:", error);
    throw error;
  }
};


