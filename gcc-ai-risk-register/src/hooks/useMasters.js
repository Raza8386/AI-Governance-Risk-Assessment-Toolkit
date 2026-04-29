import { useState, useEffect } from 'react';
import defaultCategories from '../data/riskCategories.json';

const STORAGE_KEY = 'gcc-ai-risk-masters-v1';

const DEFAULT_MASTERS = {
  aiSystems: [
    'HR Recruitment AI',
    'Customer-facing Chatbot',
    'Credit Scoring Model',
    'Fraud Detection System',
    'Predictive Maintenance AI',
  ],
  riskCategories: defaultCategories,
  riskOwners: [
    'Chief HR Officer',
    'Chief Risk Officer',
    'Chief Information Security Officer',
    'Chief Technology Officer',
    'Chief Customer Officer',
    'Data Protection Officer',
    'Legal & Compliance Director',
    'Operations Director',
    'Head of Engineering',
    'Head of Fraud Operations',
    'Vendor Risk Manager',
    'Digital Customer Experience Director',
    'Compliance Officer',
    'Risk Manager',
  ],
};

const load = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        aiSystems:      parsed.aiSystems      || DEFAULT_MASTERS.aiSystems,
        riskCategories: parsed.riskCategories || DEFAULT_MASTERS.riskCategories,
        riskOwners:     parsed.riskOwners     || DEFAULT_MASTERS.riskOwners,
      };
    }
  } catch {
    // corrupted storage
  }
  return DEFAULT_MASTERS;
};

export const useMasters = () => {
  const [masters, setMasters] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(masters));
    } catch {
      // storage full
    }
  }, [masters]);

  const addItem = (listKey, value) => {
    const trimmed = value.trim();
    if (!trimmed) return { ok: false, error: 'Value cannot be empty.' };
    if (masters[listKey].some((v) => v.toLowerCase() === trimmed.toLowerCase()))
      return { ok: false, error: 'This item already exists.' };
    setMasters((m) => ({ ...m, [listKey]: [...m[listKey], trimmed] }));
    return { ok: true };
  };

  const updateItem = (listKey, oldValue, newValue) => {
    const trimmed = newValue.trim();
    if (!trimmed) return { ok: false, error: 'Value cannot be empty.' };
    if (trimmed === oldValue) return { ok: true };
    if (masters[listKey].some((v) => v.toLowerCase() === trimmed.toLowerCase()))
      return { ok: false, error: 'This item already exists.' };
    setMasters((m) => ({
      ...m,
      [listKey]: m[listKey].map((v) => (v === oldValue ? trimmed : v)),
    }));
    return { ok: true };
  };

  const deleteItem = (listKey, value) => {
    setMasters((m) => ({
      ...m,
      [listKey]: m[listKey].filter((v) => v !== value),
    }));
  };

  const moveItem = (listKey, fromIndex, direction) => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    setMasters((m) => {
      const list = [...m[listKey]];
      if (toIndex < 0 || toIndex >= list.length) return m;
      [list[fromIndex], list[toIndex]] = [list[toIndex], list[fromIndex]];
      return { ...m, [listKey]: list };
    });
  };

  const resetList = (listKey) => {
    setMasters((m) => ({ ...m, [listKey]: DEFAULT_MASTERS[listKey] }));
  };

  return { masters, addItem, updateItem, deleteItem, moveItem, resetList, DEFAULT_MASTERS };
};
