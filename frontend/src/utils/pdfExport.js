import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { scaleIngredients, shortUnit } from './scaleIngredients.js';

/**
 * Generate and download a styled Ayurvedic remedy PDF.
 */
export function downloadRemedyPDF({ remedy, disease, severity, duration, userName }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  let y = 0;

  // ── Header Banner ────────────────────────────────────────────────────────────
  doc.setFillColor(30, 58, 47); // forest-800
  doc.rect(0, 0, W, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('🌿 AyurCare', 14, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('AI-Powered Ayurvedic Wellness Platform', 14, 23);
  doc.text('www.ayurcare.app', 14, 29);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, W - 14, 29, { align: 'right' });

  y = 48;

  // ── Patient Info ─────────────────────────────────────────────────────────────
  doc.setFillColor(240, 247, 242); // forest-50
  doc.roundedRect(12, y, W - 24, 28, 3, 3, 'F');

  doc.setTextColor(30, 58, 47);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Patient Details', 18, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(61, 78, 67);
  if (userName) doc.text(`Patient: ${userName}`, 18, y + 17);
  doc.text(`Condition: ${disease}`, 18, y + 23);
  doc.text(`Severity: ${severity?.toUpperCase()}`, W / 2, y + 17);
  doc.text(`Treatment Duration: ${duration} day${duration > 1 ? 's' : ''}`, W / 2, y + 23);

  y += 36;

  // ── Remedy Name ───────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(74, 124, 89); // forest-500
  doc.text(remedy.remedyName || 'Ayurvedic Remedy', 14, y);
  y += 6;

  // ── Description ───────────────────────────────────────────────────────────────
  if (remedy.description) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const descLines = doc.splitTextToSize(remedy.description, W - 28);
    doc.text(descLines, 14, y);
    y += descLines.length * 5 + 6;
  }

  // ── Ingredients Table ─────────────────────────────────────────────────────────
  const scaledIngredients = scaleIngredients(remedy.ingredients, duration);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 47);
  doc.text('Ingredients', 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [['Ingredient', '/ Day', `Total (${duration}d)`, 'Unit', 'Benefits']],
    body: scaledIngredients.map((ing) => [
      ing.name,
      ing.quantity_per_day,
      ing.quantity_scaled,
      shortUnit(ing.unit),
      ing.benefits,
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [74, 124, 89], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 247, 242] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 'auto' },
    },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 10;

  // ── Preparation Steps ─────────────────────────────────────────────────────────
  if (remedy.preparationSteps?.length) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 47);
    doc.text('Preparation Method', 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    remedy.preparationSteps.forEach((step, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${step}`, W - 28);
      if (y + lines.length * 5 > 270) { doc.addPage(); y = 20; }
      doc.text(lines, 14, y);
      y += lines.length * 5 + 2;
    });
    y += 4;
  }

  // ── Dosage Schedule ───────────────────────────────────────────────────────────
  if (remedy.dosageSchedule?.length) {
    if (y + 30 > 270) { doc.addPage(); y = 20; }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 47);
    doc.text('Dosage Schedule', 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [['Time', 'Amount', 'Instructions']],
      body: remedy.dosageSchedule.map((d) => [d.time, d.amount, d.instructions]),
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [212, 160, 23], textColor: 255 },
      margin: { left: 14, right: 14 },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // ── Storage & Diet ─────────────────────────────────────────────────────────────
  if (remedy.storageInstructions || remedy.shelfLife) {
    if (y + 20 > 270) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 47);
    doc.text('Storage', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`${remedy.storageInstructions || ''} (Shelf life: ${remedy.shelfLife || 'N/A'})`, 14, y + 5);
    y += 14;
  }

  // ── Safety Warning ────────────────────────────────────────────────────────────
  if (remedy.safetyWarning) {
    if (y + 24 > 270) { doc.addPage(); y = 20; }
    doc.setFillColor(255, 248, 235);
    doc.roundedRect(12, y, W - 24, 20, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(180, 83, 9);
    doc.text('⚠️ Safety Notice', 17, y + 7);
    doc.setFont('helvetica', 'normal');
    const warnLines = doc.splitTextToSize(remedy.safetyWarning, W - 34);
    doc.text(warnLines, 17, y + 13);
    y += 26;
  }

  // ── Disclaimer ────────────────────────────────────────────────────────────────
  doc.setFillColor(245, 240, 232);
  doc.rect(0, doc.internal.pageSize.getHeight() - 18, W, 18, 'F');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 100);
  doc.text(
    'DISCLAIMER: This remedy is for informational purposes only and is not a substitute for professional medical advice. Consult a qualified Ayurvedic practitioner or physician before use.',
    14,
    doc.internal.pageSize.getHeight() - 9,
    { maxWidth: W - 28 }
  );

  // ── Save ──────────────────────────────────────────────────────────────────────
  const filename = `AyurCare_${(remedy.remedyName || 'Remedy').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
