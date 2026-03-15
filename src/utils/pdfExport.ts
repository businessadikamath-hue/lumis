import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { db } from '../db/db';

export const exportMonthToPDF = async (year: number, month: number) => {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
  
  const entries = await db.entries
    .where('date').between(startDate, endDate, true, true)
    .and(e => e.deleted === 0)
    .sortBy('date');
  
  if (entries.length === 0) {
    alert('No entries found for this month.');
    return;
  }

  const container = document.createElement('div');
  container.id = 'pdf-export-container';
  container.style.padding = '40px';
  container.style.background = '#ffffff';
  container.style.color = '#000000';
  container.style.width = '800px';
  container.style.position = 'fixed';
  container.style.left = '-2000px';
  document.body.appendChild(container);

  container.innerHTML = `
    <h1 style="font-family: serif; font-size: 32px; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Lumis Journal — ${year}/${month}</h1>
    ${entries.map(e => `
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <h2 style="font-size: 18px; margin: 0;">${new Date(e.date).toLocaleDateString()}</h2>
          <span style="font-size: 14px;">Mood: ${e.mood}/10 | Stress: ${e.stress} | Energy: ${e.energy}</span>
        </div>
        <p style="font-size: 15px; line-height: 1.6;">${e.emoji} ${e.freeText || 'No text recorded.'}</p>
        <div style="color: #666; font-size: 12px;">Tags: ${e.tags.join(', ') || 'none'}</div>
      </div>
    `).join('')}
  `;

  const canvas = await html2canvas(container, {
    scale: 2,
    backgroundColor: '#ffffff'
  });

  document.body.removeChild(container);
  
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const imgH = (canvas.height * pdfWidth) / canvas.width;
  
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, imgH);
  pdf.save(`lumis-journal-${year}-${month}.pdf`);
};
