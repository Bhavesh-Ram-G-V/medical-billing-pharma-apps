import { jsPDF } from 'jspdf';
import { Patient } from '../types/clinical';
import { SelectedBillingItem } from '../components/billing/PrescriptionBillingCreator';
import { InsuranceOption } from '../data/mockMedicationCatalog';
import { DOCTOR_PROFILE } from '../data/mockClinicalData';

interface GenerateInvoiceParams {
  billId: string;
  patient: Patient;
  items: SelectedBillingItem[];
  totalRetail: number;
  totalReduction: number;
  finalOutOfPocket: number;
  insurancePlan: InsuranceOption;
  dateStr?: string;
}

export function generateInvoicePDF({
  billId,
  patient,
  items,
  totalRetail,
  totalReduction,
  finalOutOfPocket,
  insurancePlan,
  dateStr
}: GenerateInvoiceParams) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const primaryTeal = [13, 148, 136]; // #0d9488
  const darkSlate = [15, 23, 42]; // #0f172a
  const mutedGray = [100, 116, 139]; // #64748b
  const lightBg = [248, 250, 252]; // #f8fafc

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // 1. Top Hospital Header Banner
  doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.rect(0, 0, pageWidth, 90, 'F');

  // Hospital Name & Clinic Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('TRINITY HEALTH MEDICAL CENTER', margin, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(204, 251, 241); // soft teal
  doc.text('Division of General & Internal Medicine · Suite 304, Pavilion B', margin, 54);
  doc.text('Springfield, IL · Direct: (555) 782-4401 · portal@trinityhealth.org', margin, 68);

  // Top Right "CLINICAL INVOICE" label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(45, 212, 191);
  doc.text('PRESCRIPTION RECEIPT', pageWidth - margin, 40, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  doc.text(`Statement: #${billId}`, pageWidth - margin, 56, { align: 'right' });
  doc.text(`Issued: ${dateStr || new Date().toLocaleDateString()}`, pageWidth - margin, 70, { align: 'right' });

  let y = 115;

  // 2. Clinician & Patient Two-Column Summary Card
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(margin, y, contentWidth, 75, 4, 4, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 75, 4, 4, 'D');

  // Left side: Patient info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.text('PATIENT RECORD INFORMATION', margin + 12, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(`${patient.firstName} ${patient.lastName}`, margin + 12, y + 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text(`Medical Record #: ${patient.mrn}   |   DOB: ${patient.dob} (${patient.age}y ${patient.gender})`, margin + 12, y + 46);
  doc.text(`Insurance: ${insurancePlan.name}`, margin + 12, y + 60);

  // Right side: Attending Provider info
  const rightColX = margin + contentWidth / 2 + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.text('ATTENDING PHYSICIAN', rightColX, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(DOCTOR_PROFILE.name, rightColX, y + 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text(`NPI: ${DOCTOR_PROFILE.npiNumber}   |   License: ${DOCTOR_PROFILE.badgeNumber}`, rightColX, y + 46);
  doc.text(`Practice: ${DOCTOR_PROFILE.department}`, rightColX, y + 60);

  y += 95;

  // 3. Itemized Prescription Billing Table Header
  doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.rect(margin, y, contentWidth, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('MEDICATION & STRENGTH', margin + 8, y + 16);
  doc.text('QTY / SUPPLY', margin + 220, y + 16);
  doc.text('RETAIL PRICE', margin + 330, y + 16, { align: 'right' });
  doc.text('INS. REDUCTION', margin + 430, y + 16, { align: 'right' });
  doc.text('PATIENT COPAY', pageWidth - margin - 8, y + 16, { align: 'right' });

  y += 24;

  // 4. Itemized Rows
  items.forEach((item, index) => {
    const ratio = item.quantity / item.medication.defaultQuantity;
    const lineRetail = item.medication.retailPrice * ratio;
    const effectiveDiscountRate = Math.min(
      0.95,
      (item.medication.insuranceCoverageRate + insurancePlan.defaultDiscountRate) / 2
    );
    const lineReduction = lineRetail * effectiveDiscountRate;
    const lineOutOfPocket = Math.max(0, lineRetail - lineReduction);

    // Alternating row color
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(margin, y, contentWidth, 32, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 32, pageWidth - margin, y + 32);

    // Medicine Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text(`${item.medication.name} ${item.medication.dosage}`, margin + 8, y + 14);

    // Generic subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text(`${item.medication.genericName} · ${item.medication.form}`, margin + 8, y + 25);

    // Quantity / Supply
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text(`${item.quantity} units (${item.daysSupply} days)`, margin + 220, y + 19);

    // Retail Price
    doc.text(`$${lineRetail.toFixed(2)}`, margin + 330, y + 19, { align: 'right' });

    // Insurance Reduction
    doc.setTextColor(16, 185, 129); // green
    doc.setFont('helvetica', 'bold');
    doc.text(`-$${lineReduction.toFixed(2)}`, margin + 430, y + 19, { align: 'right' });

    // Patient Out-of-pocket
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text(`$${lineOutOfPocket.toFixed(2)}`, pageWidth - margin - 8, y + 19, { align: 'right' });

    y += 32;
  });

  y += 15;

  // 5. Financial Summary Box (Right Aligned)
  const summaryBoxWidth = 260;
  const summaryBoxX = pageWidth - margin - summaryBoxWidth;

  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(summaryBoxX, y, summaryBoxWidth, 90, 4, 4, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(summaryBoxX, y, summaryBoxWidth, 90, 4, 4, 'D');

  // Total Retail Line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text('Total Pharmacy Retail:', summaryBoxX + 12, y + 20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(`$${totalRetail.toFixed(2)}`, summaryBoxX + summaryBoxWidth - 12, y + 20, { align: 'right' });

  // Insurance Covered Line
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text('Insurance Benefit Applied:', summaryBoxX + 12, y + 38);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(`-$${totalReduction.toFixed(2)}`, summaryBoxX + summaryBoxWidth - 12, y + 38, { align: 'right' });

  // Divider line
  doc.setDrawColor(203, 213, 225);
  doc.line(summaryBoxX + 12, y + 48, summaryBoxX + summaryBoxWidth - 12, y + 48);

  // Final Patient Out-Of-Pocket Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.text('PATIENT OUT-OF-POCKET:', summaryBoxX + 12, y + 66);
  doc.setFontSize(13);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(`$${finalOutOfPocket.toFixed(2)}`, summaryBoxX + summaryBoxWidth - 12, y + 68, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Status: Dispatched to Patient Portal (Copay Billed)', summaryBoxX + 12, y + 82);

  // 6. Left Side: Notice & Prescriber Certification
  const noticeWidth = summaryBoxX - margin - 20;
  doc.setFillColor(240, 253, 250); // very soft teal
  doc.roundedRect(margin, y, noticeWidth, 90, 4, 4, 'F');
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(margin, y, noticeWidth, 90, 4, 4, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.text('CLINICAL PHARMACY ADJUDICATION NOTICE', margin + 10, y + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const disclaimer = `This clinical invoice reflects prescription copays adjudicated via ${insurancePlan.name}. All medications have been electronically authorized by Dr. Sarah Jenkins, MD under NPI #1942083921 and transmitted directly to the patient's preferred pharmacy.`;
  doc.text(doc.splitTextToSize(disclaimer, noticeWidth - 20), margin + 10, y + 30);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('Digitally Authorized & Signed: Sarah Jenkins, MD', margin + 10, y + 78);

  // 7. Bottom Document Footer
  const footerY = doc.internal.pageSize.getHeight() - 35;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text(
    `Trinity Health Medical Center · Clinical EHR System v2026.4 · Verification Token: ${billId} · HIPAA Protected Health Information (PHI)`,
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );

  // Save the PDF
  const filename = `TrinityHealth_Receipt_${billId}_${patient.lastName}.pdf`;
  doc.save(filename);
}
