import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from './supabase';

export const generateInvoicePDF = async (order: any) => {
  try {
    console.log("Iniciando generación de PDF Seguro (Caja Fuerte) para el pedido:", order.id);
    
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('es-GT');
    const orderId = order.id || "00000";
    const shortId = orderId.toString().split('-')[0].toUpperCase();
    const invoiceId = `BM-${shortId}`;

    const total = Number(order.total || 0);
    const anticipo = Number(order.anticipo || (total * 0.5));
    const saldo = total - anticipo;

    // --- COLORES LUXURY ---
    const nightBlue = [15, 23, 42] as const;
    const champagneGold = [196, 154, 108] as const;
    const goldLight = [230, 190, 150] as const;
    const goldDark = [156, 124, 88] as const;
    const softGrey = [241, 245, 249] as const;

    // --- PAGE BACKGROUND ---
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');

    // --- WATERMARK (Escudo de Autenticidad) ---
    doc.saveGraphicsState();
    doc.setGState(new (doc as any).GState({ opacity: 0.04 }));
    doc.setTextColor(...nightBlue);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(150);
    doc.text("BM", 105, 160, { align: 'center', angle: 45 });
    doc.restoreGraphicsState();

    // --- HEADER SECTION ---
    doc.setFillColor(...nightBlue);
    doc.setDrawColor(...champagneGold);
    doc.setLineWidth(0.8);
    doc.circle(30, 30, 14, 'FD');
    doc.setLineWidth(0.2);
    doc.circle(30, 30, 12.5, 'D');
    
    doc.setTextColor(...goldLight);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("BM", 30, 32, { align: 'center' });

    doc.setTextColor(...nightBlue);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("BAHÍA MODA", 55, 28);
    
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...goldDark);
    doc.text("E X C L U S I V I D A D   &   E S T I L O   E N   C A D A   D E T A L L E", 55, 34);

    doc.setFillColor(...goldDark);
    doc.rect(145, 15, 50, 9, 'F');
    doc.setFillColor(...champagneGold);
    doc.rect(145, 15.5, 50, 8, 'F');
    
    doc.setTextColor(...nightBlue);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("ORDEN DE COMPRA", 170, 21, { align: 'center' });

    doc.setTextColor(...nightBlue);
    doc.setFontSize(12);
    doc.text(`#${invoiceId}`, 170, 32, { align: 'center' });
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text(`EMITIDO: ${date}`, 170, 38, { align: 'center' });

    doc.setDrawColor(...goldDark);
    doc.setLineWidth(0.6);
    doc.line(15, 48, 195, 48);
    doc.setDrawColor(...goldLight);
    doc.setLineWidth(0.2);
    doc.line(15, 48.8, 195, 48.8);

    doc.setFillColor(...softGrey);
    doc.roundedRect(15, 58, 180, 32, 4, 4, 'F');
    
    doc.setTextColor(...nightBlue);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN DEL CLIENTE", 25, 68);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("CLIENTE:", 25, 75);
    doc.text("CONTACTO:", 25, 80);
    doc.text("ENTREGA:", 25, 85);

    doc.setTextColor(...nightBlue);
    doc.setFont("helvetica", "bold");
    doc.text(`${order.cliente_nombre || 'Invitado'}`, 55, 75);
    doc.text(`+502 ${order.cliente_telefono || 'N/A'}`, 55, 80);
    
    const splitUbicacion = doc.splitTextToSize(`${order.ubicacion || order.ubicacion_entrega || 'Puerto San José'}`, 125);
    doc.text(splitUbicacion, 55, 85);

    const stripBrand = (name: string) => {
      if (!name) return 'Artículo Exclusivo';
      return name.replace(/\s+de\s+(arabela|l'bel|lbel|scentia|esika|cyzone|avon|natura|mary kay)/i, '').trim();
    };

    const items = Array.isArray(order.items) ? order.items : [];
    const tableRows = items.map((item: any) => [
      stripBrand(item.name),
      item.size || 'N/A',
      item.quantity || 1,
      `Q${Number(item.price).toFixed(2)}`,
      `Q${(Number(item.price) * (item.quantity || 1)).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 98,
      margin: { left: 15, right: 15 },
      head: [['ARTÍCULO', 'TALLA', 'CANT.', 'P. UNITARIO', 'SUBTOTAL']],
      body: tableRows,
      theme: 'plain',
      headStyles: { 
        fillColor: nightBlue as [number, number, number], 
        textColor: goldLight as [number, number, number], 
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center',
        cellPadding: 5
      },
      bodyStyles: { fontSize: 8, textColor: [30, 41, 59], cellPadding: 4 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 80, halign: 'left', fontStyle: 'bold' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'right', fontStyle: 'bold' }
      }
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 140;
    doc.setDrawColor(...softGrey);
    doc.setLineWidth(0.5);
    doc.line(15, finalY + 2, 195, finalY + 2);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL DEL PEDIDO:", 140, finalY + 12);
    doc.setTextColor(...nightBlue);
    doc.text(`Q${total.toFixed(2)}`, 190, finalY + 12, { align: 'right' });

    doc.setTextColor(34, 197, 94);
    doc.text("ANTICIPO VALIDADO:", 140, finalY + 19);
    doc.text(`- Q${anticipo.toFixed(2)}`, 190, finalY + 19, { align: 'right' });

    doc.setFillColor(...goldDark);
    doc.roundedRect(130, finalY + 25, 65, 12, 2, 2, 'F');
    doc.setFillColor(...champagneGold);
    doc.roundedRect(130, finalY + 25.5, 65, 11, 2, 2, 'F');
    
    doc.setTextColor(...nightBlue);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("SALDO A PAGAR:", 135, finalY + 33);
    doc.text(`Q${saldo.toFixed(2)}`, 187, finalY + 33, { align: 'right' });

    // --- PRE-CALCULAR URL DIRECTA AL PDF (Caja Fuerte) ---
    const bucketName = 'receipts';
    const fileName = `R-${order.id.slice(0, 10)}.pdf`;
    
    // Obtener la URL pública dinámicamente
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    // --- REAL QR CODE GENERATION (Linking DIRECTLY to the PDF file) ---
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(publicUrl)}`;
    
    try {
      const response = await fetch(qrUrl);
      if (!response.ok) throw new Error("QR API error");
      const blob = await response.blob();
      const reader = new FileReader();
      const qrBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      doc.addImage(qrBase64, 'PNG', 15, 240, 25, 25);
    } catch (qrError) {
      console.warn("No se pudo generar el QR real", qrError);
      doc.setFillColor(...nightBlue);
      doc.rect(15, 240, 25, 25, 'F');
    }

    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text("ESCANEÉ PARA VER ORIGINAL (PDF)", 15, 238);

    // PIE DE PÁGINA LIMPIO
    doc.setDrawColor(...champagneGold);
    doc.setLineWidth(0.5);
    doc.circle(175, 255, 18, 'D');
    doc.setDrawColor(...nightBlue);
    doc.setLineWidth(0.1);
    doc.circle(175, 255, 16, 'D');
    
    doc.setTextColor(...nightBlue);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text("BAHÍA MODA", 175, 253, { align: 'center' });
    doc.setFontSize(4);
    doc.text("GARANTÍA DE EXCLUSIVIDAD", 175, 257, { align: 'center' });
    doc.text("DOCUMENTO OFICIAL", 175, 260, { align: 'center' });

    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "italic");
    const disclaimer = "Este documento es una orden de compra oficial de Bahía Moda. Verifique su autenticidad mediante el código QR.";
    doc.text(disclaimer, 105, 285, { align: 'center' });

    // --- SUBIR PDF A LA CAJA FUERTE ---
    try {
      const pdfBlob = doc.output('blob');
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, pdfBlob, {
          upsert: true,
          contentType: 'application/pdf'
        });
      
      if (uploadError) {
        console.error("Error al subir a la Caja Fuerte:", uploadError.message);
      } else {
        console.log("PDF asegurado en la Caja Fuerte correctamente.");
      }
    } catch (err) {
      console.error("Fallo crítico en subida:", err);
    }

    // Descargar siempre para el cliente, pase lo que pase con la subida
    doc.save(`${invoiceId}_BahiaModa_Official.pdf`);
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error al generar factura premium. Intente de nuevo.");
  }
};
