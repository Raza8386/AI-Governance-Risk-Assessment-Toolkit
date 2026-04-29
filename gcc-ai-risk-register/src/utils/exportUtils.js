import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { RISK_COLORS } from './riskUtils';

const TABLE_HEADERS = [
  'Risk ID',
  'AI System',
  'Category',
  'Risk Title',
  'Description',
  'Likelihood',
  'Impact',
  'Risk Score',
  'Risk Level',
  'Regulatory References',
  'Risk Owner',
  'Control Status',
  'Residual Risk',
  'Status',
  'Review Date',
  'Comments',
];

const riskToRow = (r) => [
  r.id,
  r.aiSystem,
  r.category,
  r.title,
  r.description,
  r.likelihood,
  r.impact,
  r.riskScore,
  r.riskLevel,
  Array.isArray(r.regulatoryRefs) ? r.regulatoryRefs.join('; ') : '',
  r.riskOwner,
  r.controlStatus,
  r.residualRisk,
  r.status,
  r.reviewDate || '',
  r.comments || '',
];

export const exportToExcel = (risks, filename = 'GCC-AI-Risk-Register') => {
  const data = [TABLE_HEADERS, ...risks.map(riskToRow)];
  const ws = XLSX.utils.aoa_to_sheet(data);

  ws['!cols'] = [
    { wch: 10 }, { wch: 24 }, { wch: 34 }, { wch: 40 }, { wch: 60 },
    { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 50 },
    { wch: 24 }, { wch: 18 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 40 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Risk Register');

  const metaData = [
    ['GCC AI Risk Register — Export'],
    [`Generated: ${format(new Date(), 'dd MMM yyyy, HH:mm')}`],
    [`Total Risks: ${risks.length}`],
    [],
    ['Risk Level Key:'],
    ['Critical', 'Score 20–25'],
    ['High', 'Score 12–19'],
    ['Medium', 'Score 6–11'],
    ['Low', 'Score 1–5'],
  ];
  const wsMeta = XLSX.utils.aoa_to_sheet(metaData);
  XLSX.utils.book_append_sheet(wb, wsMeta, 'About');

  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = (risks, filename = 'GCC-AI-Risk-Register') => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('GCC AI Risk Register', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${format(new Date(), 'dd MMMM yyyy, HH:mm')}  |  Total risks: ${risks.length}`, 14, 25);
  doc.text('Aligned with: SDAIA AI Ethics | PDPL | NCA ECC | NIST AI RMF | ISO/IEC 42001', 14, 30);

  const pdfHeaders = [
    'Risk ID', 'AI System', 'Category', 'Risk Title',
    'L', 'I', 'Score', 'Level',
    'Regulatory Refs', 'Owner', 'Control', 'Residual', 'Status', 'Review Date',
  ];

  const pdfRows = risks.map((r) => [
    r.id,
    r.aiSystem,
    r.category,
    r.title,
    r.likelihood,
    r.impact,
    r.riskScore,
    r.riskLevel,
    Array.isArray(r.regulatoryRefs) ? r.regulatoryRefs.join('\n') : '',
    r.riskOwner,
    r.controlStatus,
    r.residualRisk,
    r.status,
    r.reviewDate || '',
  ]);

  autoTable(doc, {
    startY: 36,
    head: [pdfHeaders],
    body: pdfRows,
    styles: {
      fontSize: 6.5,
      cellPadding: 2,
      valign: 'top',
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7,
    },
    columnStyles: {
      0: { cellWidth: 14 },
      1: { cellWidth: 26 },
      2: { cellWidth: 36 },
      3: { cellWidth: 44 },
      4: { cellWidth: 8 },
      5: { cellWidth: 8 },
      6: { cellWidth: 12 },
      7: { cellWidth: 16 },
      8: { cellWidth: 38 },
      9: { cellWidth: 24 },
      10: { cellWidth: 18 },
      11: { cellWidth: 16 },
      12: { cellWidth: 18 },
      13: { cellWidth: 20 },
    },
    didParseCell(data) {
      if (data.section === 'body' && data.column.index === 7) {
        const level = data.cell.raw;
        const colors = RISK_COLORS[level];
        if (colors) {
          data.cell.styles.fillColor = colors.pdf;
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = [40, 40, 40];
        }
      }
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `GCC AI Risk Register  |  Page ${i} of ${pageCount}  |  Confidential`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    );
  }

  doc.save(`${filename}.pdf`);
};

export const exportSingleRiskToPDF = (risk) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const colors = RISK_COLORS[risk.riskLevel] || RISK_COLORS.Low;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('GCC AI Risk Register', 14, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text('Individual Risk Report — Audit Ready', 14, 20);
  doc.text(`Generated: ${format(new Date(), 'dd MMM yyyy')}`, 150, 20);

  const levelRGB = hexToRgb(colors.hex) || [200, 200, 200];
  doc.setFillColor(...levelRGB);
  doc.roundedRect(14, 34, 182, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(`${risk.id}  —  ${risk.title}`, 18, 43);

  const fields = [
    ['AI System', risk.aiSystem],
    ['Risk Category', risk.category],
    ['Risk Owner', risk.riskOwner],
    ['Status', risk.status],
    ['Review Date', risk.reviewDate || 'Not set'],
    ['Likelihood', `${risk.likelihood} / 5`],
    ['Impact', `${risk.impact} / 5`],
    ['Risk Score', `${risk.riskScore} / 25`],
    ['Risk Level', risk.riskLevel],
    ['Control Status', risk.controlStatus],
    ['Residual Risk', risk.residualRisk],
  ];

  autoTable(doc, {
    startY: 54,
    body: fields,
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45, fillColor: [248, 250, 252], textColor: [71, 85, 105] },
      1: { cellWidth: 135 },
    },
    theme: 'plain',
    tableLineColor: [226, 232, 240],
    tableLineWidth: 0.1,
  });

  const afterTable = doc.lastAutoTable.finalY + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Risk Description', 14, afterTable);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const descLines = doc.splitTextToSize(risk.description || '', 182);
  doc.text(descLines, 14, afterTable + 6);

  const descEnd = afterTable + 6 + descLines.length * 4 + 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Regulatory References', 14, descEnd);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const refs = Array.isArray(risk.regulatoryRefs) ? risk.regulatoryRefs.join(' | ') : '';
  const refLines = doc.splitTextToSize(refs, 182);
  doc.text(refLines, 14, descEnd + 6);

  const refsEnd = descEnd + 6 + refLines.length * 4 + 4;

  if (risk.comments) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text('Comments / Risk Treatment Notes', 14, refsEnd);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    const commLines = doc.splitTextToSize(risk.comments, 182);
    doc.text(commLines, 14, refsEnd + 6);
  }

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `GCC AI Risk Register  |  ${risk.id}  |  Confidential`,
    105,
    290,
    { align: 'center' }
  );

  doc.save(`GCC-AI-Risk-${risk.id}.pdf`);
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
};
