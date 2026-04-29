import { useState, useEffect, useCallback } from 'react';
import sampleRisks from '../data/sampleRisks.json';

const STORAGE_KEY = 'gcc-ai-risk-register-v1';

const loadRisks = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // corrupted storage — fall through to seed
  }
  return sampleRisks;
};

export const useRisks = () => {
  const [risks, setRisks] = useState(loadRisks);
  const [activityFeed, setActivityFeed] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(risks));
    } catch {
      // storage full — silent fail
    }
  }, [risks]);

  const addActivity = useCallback((entry) => {
    setActivityFeed((prev) => [entry, ...prev].slice(0, 20));
  }, []);

  const addRisk = useCallback((riskData) => {
    const now = new Date().toISOString();
    const newRisk = {
      ...riskData,
      createdAt: now,
      updatedAt: now,
      auditLog: [
        { timestamp: now, action: 'Created', user: 'Risk Manager', note: 'Risk added via GCC AI Risk Register' },
      ],
    };
    setRisks((prev) => [newRisk, ...prev]);
    addActivity({ type: 'created', riskId: newRisk.id, title: newRisk.title, timestamp: now });
    return newRisk;
  }, [addActivity]);

  const updateRisk = useCallback((id, updatedData) => {
    const now = new Date().toISOString();
    setRisks((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const entry = {
          timestamp: now,
          action: 'Updated',
          user: 'Risk Manager',
          note: `Risk updated — status: ${updatedData.status}, level: ${updatedData.riskLevel}`,
        };
        return {
          ...r,
          ...updatedData,
          id: r.id,
          createdAt: r.createdAt,
          updatedAt: now,
          auditLog: [...(r.auditLog || []), entry],
        };
      })
    );
    addActivity({ type: 'updated', riskId: id, title: updatedData.title, timestamp: now });
  }, [addActivity]);

  const deleteRisk = useCallback((id) => {
    const risk = risks.find((r) => r.id === id);
    setRisks((prev) => prev.filter((r) => r.id !== id));
    if (risk) {
      addActivity({
        type: 'deleted',
        riskId: id,
        title: risk.title,
        timestamp: new Date().toISOString(),
      });
    }
  }, [risks, addActivity]);

  const resetToSample = useCallback(() => {
    setRisks(sampleRisks);
    addActivity({
      type: 'reset',
      riskId: null,
      title: 'Risk register reset to sample data',
      timestamp: new Date().toISOString(),
    });
  }, [addActivity]);

  const getRiskById = useCallback((id) => risks.find((r) => r.id === id), [risks]);

  const stats = {
    total:    risks.length,
    critical: risks.filter((r) => r.riskLevel === 'Critical').length,
    high:     risks.filter((r) => r.riskLevel === 'High').length,
    medium:   risks.filter((r) => r.riskLevel === 'Medium').length,
    low:      risks.filter((r) => r.riskLevel === 'Low').length,
    open:     risks.filter((r) => r.status === 'Open').length,
    inProgress: risks.filter((r) => r.status === 'In Progress').length,
    closed:   risks.filter((r) => r.status === 'Closed').length,
  };

  return {
    risks,
    stats,
    activityFeed,
    addRisk,
    updateRisk,
    deleteRisk,
    resetToSample,
    getRiskById,
  };
};
