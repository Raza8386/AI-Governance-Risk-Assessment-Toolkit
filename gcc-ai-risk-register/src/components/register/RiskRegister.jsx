import { useState } from 'react';
import { Plus, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { RiskFilters } from './RiskFilters';
import { RiskTable } from './RiskTable';
import { filterRisks } from '../../utils/riskUtils';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';

const DEFAULT_FILTERS = {
  search: '',
  category: '',
  riskLevel: '',
  status: '',
  aiSystem: '',
  regulatoryRef: '',
};

export const RiskRegister = ({ risks, masters, onAdd, onEdit, onDelete, onView }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filtered = filterRisks(risks, filters);

  const handleExcelExport = () => {
    exportToExcel(filtered);
    setShowExportMenu(false);
  };

  const handlePdfExport = () => {
    exportToPDF(filtered);
    setShowExportMenu(false);
  };

  return (
    <div className="p-6 space-y-4 max-w-screen-2xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">AI Risk Register</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Aligned with SDAIA · PDPL · NCA · NIST AI RMF · ISO 42001
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu((s) => !s)}
              className="btn-secondary"
            >
              <Download size={14} />
              Export
            </button>
            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden w-44">
                  <button
                    onClick={handleExcelExport}
                    className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FileSpreadsheet size={14} className="text-green-600" />
                    Export to Excel
                  </button>
                  <button
                    onClick={handlePdfExport}
                    className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                  >
                    <FileText size={14} className="text-red-600" />
                    Export to PDF
                  </button>
                </div>
              </>
            )}
          </div>
          <button onClick={onAdd} className="btn-primary">
            <Plus size={14} />
            Add Risk
          </button>
        </div>
      </div>

      <RiskFilters
        filters={filters}
        onChange={setFilters}
        resultCount={filtered.length}
        totalCount={risks.length}
        masters={masters}
      />

      <RiskTable
        risks={filtered}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    </div>
  );
};
