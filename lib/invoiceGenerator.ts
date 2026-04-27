import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (order: any) => {
  try {
    console.log("Iniciando generación de PDF Premium para el pedido:", order.id);
    
    const doc = new jsPDF();
    const companyName = "BAHÍA MODA";
    const companySlogan = "ESTILO & EXCLUSIVIDAD";
    const date = new Date().toLocaleDateString('es-GT');
    
    const orderId = order.id || "00000";
    const shortId = orderId.toString().split('-')[0].toUpperCase();
    const invoiceId = `BM-${shortId}`;

    const total = Number(order.total || 0);
    const anticipo = Number(order.anticipo || (total * 0.5));
    const saldo = total - anticipo;

    // --- LUXURY SIDEBAR ---
    doc.setFillColor(18, 18, 18); // Elegant Black/Dark Zinc
    doc.rect(0, 0, 70, 297, 'F');

    // --- LOGO / HEADER (SIDEBAR) ---
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("BAHÍA", 35, 40, { align: 'center' });
    doc.text("MODA", 35, 50, { align: 'center' });

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(20, 55, 50, 55);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(companySlogan, 35, 62, { align: 'center' });

    // --- TRACKING BOX (SIDEBAR) ---
    doc.setFillColor(30, 30, 30);
    doc.roundedRect(10, 85, 50, 40, 5, 5, 'F');
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.text("ID DE SEGUIMIENTO", 35, 95, { align: 'center' });
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(invoiceId, 35, 108, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("VÁLIDO PARA RECLAMOS", 35, 118, { align: 'center' });

    // --- PAYMENT STATUS STAMP ---
    if (order.comprobante_url || order.estado === 'recibido' || order.estado === 'aprobado') {
        doc.setDrawColor(34, 197, 94); // Emerald
        doc.setLineWidth(1);
        doc.roundedRect(10, 140, 50, 15, 3, 3, 'D');
        doc.setTextColor(34, 197, 94);
        doc.setFontSize(8);
        doc.text("PAGO VALIDADO", 35, 150, { align: 'center' });
    }

    // --- MAIN CONTENT AREA ---
    doc.setTextColor(0, 0, 0);
    
    // Title
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("ORDEN DE PEDIDO", 85, 40);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`EMITIDO EL: ${date}`, 85, 48);

    // Client Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("DETALLES DE ENTREGA", 85, 65);
    
    doc.setDrawColor(230, 230, 230);
    doc.line(85, 68, 190, 68);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`CLIENTE: ${order.cliente_nombre || 'No registrado'}`, 85, 76);
    doc.text(`TELÉFONO: +502 ${order.cliente_telefono || 'N/A'}`, 85, 82);
    doc.text(`DIRECCIÓN:`, 85, 88);
    
    const splitUbicacion = doc.splitTextToSize(order.ubicacion || order.ubicacion_entrega || 'Puerto San José, Escuintla', 100);
    doc.text(splitUbicacion, 85, 94);

    // --- TABLE ---
    const items = Array.isArray(order.items) ? order.items : [];
    const tableRows = items.map((item: any) => [
      item.name || 'Producto Exclusivo',
      item.size || 'Única',
      item.quantity || 1,
      `Q${Number(item.price).toFixed(2)}`,
      `Q${(Number(item.price) * (item.quantity || 1)).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 115,
      margin: { left: 85 },
      head: [['DESCRIPCIÓN', 'TALLA', 'CANT', 'PRECIO', 'TOTAL']],
      body: tableRows,
      theme: 'plain',
      headStyles: { 
        fillColor: [255, 255, 255], 
        textColor: [0, 0, 0], 
        fontStyle: 'bold',
        fontSize: 8,
        lineWidth: { bottom: 0.5 },
        lineColor: [0, 0, 0]
      },
      styles: { fontSize: 8, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'right', fontStyle: 'bold' }
      }
    });

    // --- TOTALS ---
    const finalY = (doc as any).lastAutoTable?.finalY || 180;
    
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("TOTAL PRODUCTOS:", 140, finalY + 15);
    doc.setTextColor(0, 0, 0);
    doc.text(`Q${total.toFixed(2)}`, 190, finalY + 15, { align: 'right' });

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(130, finalY + 20, 65, 25, 3, 3, 'F');

    doc.setFont("helvetica", "bold");
    doc.text("ANTICIPO / TRANSF:", 135, finalY + 30);
    doc.setTextColor(34, 197, 94);
    doc.text(`- Q${anticipo.toFixed(2)}`, 190, finalY + 30, { align: 'right' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text("SALDO A PAGAR:", 135, finalY + 40);
    doc.text(`Q${saldo.toFixed(2)}`, 190, finalY + 40, { align: 'right' });

    // --- FOOTER NOTE ---
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(180, 180, 180);
    const footerText = "Este documento es un comprobante oficial de Bahía Moda. Para cambios o devoluciones, " +
                      "es indispensable presentar el ID de Seguimiento. La entrega se realiza bajo los términos " +
                      "de logística acordados vía WhatsApp.";
    const splitFooter = doc.splitTextToSize(footerText, 100);
    doc.text(splitFooter, 85, 270);

    // Luxury Barcode Simulation
    doc.setFillColor(0, 0, 0);
    for(let i=0; i<40; i++) {
        const w = Math.random() * 2;
        doc.rect(140 + (i*1.2), 275, w, 8, 'F');
    }

    // Save
    doc.save(`${invoiceId}_BahiaModa.pdf`);
    
  } catch (error) {
    console.error("Error en PDF Premium:", error);
    throw error;
  }
};

