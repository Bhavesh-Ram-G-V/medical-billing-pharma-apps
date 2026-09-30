import React, { useState, useMemo } from 'react';
import { 
  CATALOG_MEDICATIONS, 
  INSURANCE_OPTIONS, 
  BillableMedication, 
  InsuranceOption 
} from '../../data/mockMedicationCatalog';
import { Patient } from '../../types/clinical';
import { DOCTOR_PROFILE } from '../../data/mockClinicalData';
import { 
  Receipt, 
  Search, 
  CheckSquare, 
  Square, 
  Trash2, 
  Send, 
  ShieldCheck, 
  DollarSign, 
  Percent, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Sparkles, 
  Building2,
  ChevronDown
} from 'lucide-react';

export interface SelectedBillingItem {
  medication: BillableMedication;
  quantity: number;
  daysSupply: number;
}

interface PrescriptionBillingCreatorProps {
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient?: (patient: Patient) => void;
  onSendBillToPortal?: (billingSummary: {
    billId: string;
    patient: Patient;
    items: SelectedBillingItem[];
    totalRetail: number;
    totalReduction: number;
    finalOutOfPocket: number;
    insurancePlan: InsuranceOption;
    timestamp: string;
  }) => void;
  isCompact?: boolean;
}

export const PrescriptionBillingCreator: React.FC<PrescriptionBillingCreatorProps> = ({
  patients,
  activePatient,
  onSelectPatient,
  onSendBillToPortal,
  isCompact = false
}) => {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Patient & Insurance state
  const [targetPatient, setTargetPatient] = useState<Patient>(activePatient);
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceOption>(INSURANCE_OPTIONS[0]);

  // Selected billable items state (pre-populate with common prescriptions for immediate preview)
  const [selectedItems, setSelectedItems] = useState<SelectedBillingItem[]>([
    {
      medication: CATALOG_MEDICATIONS.find(m => m.id === 'med-lis-20') || CATALOG_MEDICATIONS[4],
      quantity: 30,
      daysSupply: 30
    },
    {
      medication: CATALOG_MEDICATIONS.find(m => m.id === 'med-ator-20') || CATALOG_MEDICATIONS[6],
      quantity: 30,
      daysSupply: 30
    }
  ]);

  // Billing confirmation modal state
  const [confirmedBill, setConfirmedBill] = useState<{
    billId: string;
    timestamp: string;
    patientName: string;
    patientMrn: string;
    itemsCount: number;
    totalRetail: number;
    totalReduction: number;
    finalOutOfPocket: number;
  } | null>(null);

  // Filtered medication catalog
  const filteredCatalog = useMemo(() => {
    return CATALOG_MEDICATIONS.filter(med => {
      const matchesSearch = 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.dosage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.commonIndication.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Check if item is selected
  const isSelected = (medId: string) => {
    return selectedItems.some(item => item.medication.id === medId);
  };

  // Toggle selection
  const handleToggleMedication = (med: BillableMedication) => {
    if (isSelected(med.id)) {
      setSelectedItems(prev => prev.filter(item => item.medication.id !== med.id));
    } else {
      setSelectedItems(prev => [
        ...prev,
        {
          medication: med,
          quantity: med.defaultQuantity,
          daysSupply: med.daysSupply
        }
      ]);
    }
  };

  // Update quantity
  const handleUpdateQuantity = (medId: string, qty: number) => {
    if (qty <= 0) {
      setSelectedItems(prev => prev.filter(item => item.medication.id !== medId));
      return;
    }
    setSelectedItems(prev =>
      prev.map(item =>
        item.medication.id === medId ? { ...item, quantity: qty } : item
      )
    );
  };

  // Dynamic calculations
  const billingCalculations = useMemo(() => {
    let totalRetail = 0;
    let totalReduction = 0;

    const lineCalculations = selectedItems.map(item => {
      // Calculate unit multiplier relative to default package
      const ratio = item.quantity / item.medication.defaultQuantity;
      const lineRetail = item.medication.retailPrice * ratio;
      
      // Insurance discount calculation
      const effectiveDiscountRate = Math.min(
        0.95, 
        (item.medication.insuranceCoverageRate + selectedInsurance.defaultDiscountRate) / 2
      );
      
      const lineReduction = lineRetail * effectiveDiscountRate;
      const lineOutOfPocket = Math.max(0, lineRetail - lineReduction);

      totalRetail += lineRetail;
      totalReduction += lineReduction;

      return {
        ...item,
        lineRetail,
        lineReduction,
        lineOutOfPocket
      };
    });

    const finalOutOfPocket = Math.max(0, totalRetail - totalReduction);

    return {
      lineCalculations,
      totalRetail,
      totalReduction,
      finalOutOfPocket
    };
  }, [selectedItems, selectedInsurance]);

  // Finalize and send bill
  const handleFinalizeAndSend = () => {
    if (selectedItems.length === 0) return;

    const billId = `BILL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' on ' + new Date().toLocaleDateString();

    const summary = {
      billId,
      patient: targetPatient,
      items: selectedItems,
      totalRetail: billingCalculations.totalRetail,
      totalReduction: billingCalculations.totalReduction,
      finalOutOfPocket: billingCalculations.finalOutOfPocket,
      insurancePlan: selectedInsurance,
      timestamp
    };

    if (onSendBillToPortal) {
      onSendBillToPortal(summary);
    }

    setConfirmedBill({
      billId,
      timestamp,
      patientName: `${targetPatient.firstName} ${targetPatient.lastName}`,
      patientMrn: targetPatient.mrn,
      itemsCount: selectedItems.length,
      totalRetail: billingCalculations.totalRetail,
      totalReduction: billingCalculations.totalReduction,
      finalOutOfPocket: billingCalculations.finalOutOfPocket
    });
  };

  return (
    <div className="bg-slate-900 rounded-2xl border-2 border-teal-500/50 shadow-2xl p-5 sm:p-6 space-y-6 relative overflow-hidden">
      {/* Visual Accent Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Prominent Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-inner">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Prescription Billing Creator
                </h2>
                <span className="text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Live Copay Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Rapid in-clinic medication pricing, real-time insurance discount calculation, and instant patient portal billing dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Patient & Insurance Target Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Patient Selector */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold pl-1">Billed Patient:</span>
            <select
              value={targetPatient.id}
              onChange={(e) => {
                const found = patients.find(p => p.id === e.target.value);
                if (found) {
                  setTargetPatient(found);
                  if (onSelectPatient) onSelectPatient(found);
                }
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-semibold focus:outline-none focus:border-teal-500 text-xs"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.mrn})
                </option>
              ))}
            </select>
          </div>

          {/* Insurance Selector */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold pl-1">Plan:</span>
            <select
              value={selectedInsurance.id}
              onChange={(e) => {
                const found = INSURANCE_OPTIONS.find(i => i.id === e.target.value);
                if (found) setSelectedInsurance(found);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-teal-300 font-semibold focus:outline-none focus:border-teal-500 text-xs max-w-[200px] truncate"
            >
              {INSURANCE_OPTIONS.map(ins => (
                <option key={ins.id} value={ins.id}>
                  {ins.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Billing Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left Column (5 Cols): Medication Search & Checkbox Selector List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Select Medications</span>
              <span className="text-teal-400 font-mono">({selectedItems.length} selected)</span>
            </h3>
            {selectedItems.length > 0 && (
              <button
                onClick={() => setSelectedItems([])}
                className="text-[11px] text-slate-400 hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* 1. Input Field for Search-Filtering Medicines */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" />
            <input
              type="text"
              placeholder="Search by medicine name, strength, or condition (e.g. Amoxicillin, Metformin, Lisinopril)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            {['All', 'Antibiotic', 'Cardiovascular', 'Endocrine', 'Respiratory'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 2. Checkbox Selector List to Rapidly Add Common Medications */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-800/80 max-h-[380px] overflow-y-auto">
            {filteredCatalog.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No medications matched "{searchTerm}".
              </div>
            ) : (
              filteredCatalog.map(med => {
                const checked = isSelected(med.id);
                return (
                  <div
                    key={med.id}
                    onClick={() => handleToggleMedication(med)}
                    className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                      checked
                        ? 'bg-teal-950/40 text-white'
                        : 'hover:bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <div className="mt-0.5 text-teal-400 shrink-0">
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-teal-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-xs text-white truncate">
                          {med.name} <span className="text-teal-300 font-mono font-normal">{med.dosage}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-300 shrink-0">
                          ${med.retailPrice.toFixed(2)}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {med.genericName} · {med.form} ({med.defaultQuantity} count / {med.daysSupply} days)
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                        <span className="truncate">{med.commonIndication}</span>
                        <span className="text-emerald-400 font-medium shrink-0 ml-2">
                          ~{Math.round(med.insuranceCoverageRate * 100)}% coverage
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (7 Cols): Dynamic Checkout Table & Finalize Action */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>Dynamic Checkout & Insurance Adjudication</span>
                <span className="text-slate-500 font-normal">|</span>
                <span className="text-teal-400 text-xs font-normal">
                  Covered under {selectedInsurance.name}
                </span>
              </h3>
            </div>

            {/* 3. Dynamic Checkout Table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Medicine & Strength</th>
                      <th className="py-2.5 px-3">Dispense Qty</th>
                      <th className="py-2.5 px-3 text-right">Retail Cost</th>
                      <th className="py-2.5 px-3 text-right text-emerald-400">Ins. Reduction</th>
                      <th className="py-2.5 px-3 text-right text-teal-300 font-bold">Patient Copay</th>
                      <th className="py-2.5 px-2 text-center w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {billingCalculations.lineCalculations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-500 text-xs">
                          No medications selected. Check boxes from the list on the left to add items to this prescription bill.
                        </td>
                      </tr>
                    ) : (
                      billingCalculations.lineCalculations.map((item) => (
                        <tr key={item.medication.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-white text-xs">
                              {item.medication.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {item.medication.dosage} · {item.medication.form}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={1}
                                max={360}
                                value={item.quantity}
                                onChange={(e) => handleUpdateQuantity(item.medication.id, Number(e.target.value))}
                                className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-center text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                              />
                              <span className="text-[10px] text-slate-500">units</span>
                            </div>
                          </td>

                          {/* Retail Cost */}
                          <td className="py-3 px-3 text-right font-mono font-medium text-slate-300 tabular-nums">
                            ${item.lineRetail.toFixed(2)}
                          </td>

                          {/* Insurance Reduction Amount */}
                          <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-400 tabular-nums">
                            -${item.lineReduction.toFixed(2)}
                          </td>

                          {/* Final Patient Out-Of-Pocket */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                            ${item.lineOutOfPocket.toFixed(2)}
                          </td>

                          <td className="py-3 px-2 text-center">
                            <button
                              onClick={() => handleToggleMedication(item.medication)}
                              className="text-slate-500 hover:text-red-400 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Subtotal Financial Breakdown Bar */}
              {selectedItems.length > 0 && (
                <div className="bg-slate-900/60 p-3.5 border-t border-slate-800 grid grid-cols-3 gap-2 text-xs text-center font-mono">
                  <div className="border-r border-slate-800 pr-2">
                    <span className="text-[10px] text-slate-400 uppercase font-sans block">Total Retail</span>
                    <span className="font-bold text-slate-200 tabular-nums text-sm">
                      ${billingCalculations.totalRetail.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-r border-slate-800 pr-2">
                    <span className="text-[10px] text-emerald-400 uppercase font-sans block">Insurance Covered</span>
                    <span className="font-bold text-emerald-400 tabular-nums text-sm">
                      -${billingCalculations.totalReduction.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-teal-400 uppercase font-sans block">Effective Savings</span>
                    <span className="font-bold text-teal-300 tabular-nums text-sm">
                      {billingCalculations.totalRetail > 0
                        ? Math.round((billingCalculations.totalReduction / billingCalculations.totalRetail) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Prominent Out-Of-Pocket Total & Obvious Finalize Action Button Right Next To It */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/60 border-2 border-teal-500/60 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Out-Of-Pocket Total Display */}
            <div>
              <div className="text-[11px] uppercase font-bold tracking-wider text-teal-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-teal-400" />
                <span>Final Patient Out-Of-Pocket Total</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tabular-nums tracking-tight mt-0.5">
                ${billingCalculations.finalOutOfPocket.toFixed(2)}
                <span className="text-xs font-normal text-slate-400 ml-2 font-sans">
                  USD (Copay Due)
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Calculated for <strong className="text-white">{targetPatient.firstName} {targetPatient.lastName}</strong> · {selectedInsurance.planType}
              </div>
            </div>

            {/* 5. Obvious "Finalize & Send Bill to Patient Portal" Action Button */}
            <div className="shrink-0 flex items-center">
              <button
                disabled={selectedItems.length === 0}
                onClick={handleFinalizeAndSend}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl hover:shadow-teal-500/25 transition-all transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>Finalize & Send Bill to Patient Portal</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation & Dispatch Modal */}
      {confirmedBill && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-teal-500/80 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Bill Dispatched Successfully</h4>
                  <div className="text-[11px] text-teal-400 font-mono">Statement ID: {confirmedBill.billId}</div>
                </div>
              </div>
              <button
                onClick={() => setConfirmedBill(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-white">{confirmedBill.patientName} ({confirmedBill.patientMrn})</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Adjudicated Plan:</span>
                <span className="text-teal-300">{selectedInsurance.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Prescription Items:</span>
                <span className="font-mono text-white">{confirmedBill.itemsCount} medications billed</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800">
                <span className="text-slate-500">Total Pharmacy Retail:</span>
                <span className="font-mono">${confirmedBill.totalRetail.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Insurance Benefit Applied:</span>
                <span className="font-mono">-${confirmedBill.totalReduction.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-slate-800">
                <span>Patient Balance Sent to Portal:</span>
                <span className="font-mono text-teal-300">${confirmedBill.finalOutOfPocket.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-teal-950/40 border border-teal-800/60 rounded-xl text-teal-200 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                Notification delivered to {confirmedBill.patientName}'s Trinity Health Patient Portal mobile app and SMS link.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Rx Bill Receipt</span>
              </button>
              <button
                onClick={() => setConfirmedBill(null)}
                className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
