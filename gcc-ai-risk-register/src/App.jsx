import { useState, useCallback } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { RiskRegister } from './components/register/RiskRegister';
import { RegulatoryPanel } from './components/regulatory/RegulatoryPanel';
import { MastersPage } from './components/masters/MastersPage';
import { RiskModal, ViewRiskModal } from './components/form/RiskModal';
import { useRisks } from './hooks/useRisks';
import { useMasters } from './hooks/useMasters';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [modalState, setModalState] = useState({ type: null, risk: null });

  const {
    risks, stats, activityFeed,
    addRisk, updateRisk, deleteRisk, resetToSample,
  } = useRisks();

  const {
    masters,
    addItem, updateItem, deleteItem, moveItem, resetList,
  } = useMasters();

  const openAdd  = useCallback(() => setModalState({ type: 'add',  risk: null }), []);
  const openEdit = useCallback((r) => setModalState({ type: 'edit', risk: r  }), []);
  const openView = useCallback((r) => setModalState({ type: 'view', risk: r  }), []);
  const closeModal = useCallback(() => setModalState({ type: null, risk: null }), []);

  const handleSave = useCallback((riskData) => {
    if (modalState.type === 'edit') {
      updateRisk(riskData.id, riskData);
    } else {
      addRisk(riskData);
    }
  }, [modalState.type, updateRisk, addRisk]);

  const handleDelete = useCallback((id) => {
    if (window.confirm('Delete this risk? This action cannot be undone.')) {
      deleteRisk(id);
    }
  }, [deleteRisk]);

  const handleReset = useCallback(() => {
    if (window.confirm('Reset the risk register to sample data? All custom changes will be lost.')) {
      resetToSample();
    }
  }, [resetToSample]);

  const navigate = useCallback((target) => {
    setPage(target);
    if (target === 'register' && false) openAdd();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar currentPage={page} onNavigate={navigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentPage={page} stats={stats} onReset={handleReset} />

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {page === 'dashboard' && (
            <Dashboard
              risks={risks}
              stats={stats}
              activityFeed={activityFeed}
              onNavigate={navigate}
            />
          )}
          {page === 'register' && (
            <RiskRegister
              risks={risks}
              masters={masters}
              onAdd={openAdd}
              onEdit={openEdit}
              onDelete={handleDelete}
              onView={openView}
            />
          )}
          {page === 'regulatory' && <RegulatoryPanel />}
          {page === 'masters' && (
            <MastersPage
              masters={masters}
              risks={risks}
              onAdd={addItem}
              onUpdate={updateItem}
              onDelete={deleteItem}
              onMove={moveItem}
              onReset={resetList}
            />
          )}
        </main>
      </div>

      <RiskModal
        isOpen={modalState.type === 'add' || modalState.type === 'edit'}
        onClose={closeModal}
        onSave={handleSave}
        editRisk={modalState.type === 'edit' ? modalState.risk : null}
        existingRisks={risks}
        masters={masters}
      />

      <ViewRiskModal
        isOpen={modalState.type === 'view'}
        onClose={closeModal}
        risk={modalState.risk}
        onEdit={openEdit}
      />
    </div>
  );
}
