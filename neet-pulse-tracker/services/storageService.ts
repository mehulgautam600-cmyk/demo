import { TestRecord, SubjectScores } from '../types';
import { LOCAL_STORAGE_KEY, MAX_SCORE_TOTAL } from '../constants';

const TARGET_SCORE_KEY = 'neet_target_score';

export const getStoredTests = (): TestRecord[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load data", error);
    return [];
  }
};

export const saveTest = (test: TestRecord): TestRecord[] => {
  const current = getStoredTests();
  const updated = [...current, test].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteTest = (id: string): TestRecord[] => {
  const current = getStoredTests();
  const updated = current.filter(t => t.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const getTargetScore = (): number => {
  try {
    const data = localStorage.getItem(TARGET_SCORE_KEY);
    return data ? parseInt(data, 10) : 650; // Default target
  } catch {
    return 650;
  }
};

export const saveTargetScore = (score: number): void => {
  localStorage.setItem(TARGET_SCORE_KEY, score.toString());
};

export const calculateTotal = (scores: SubjectScores): number => {
  return scores.physics + scores.chemistry + scores.biology;
};

export const getProgressStatus = (current: number, previous: number): { label: string, color: string, icon: 'up' | 'down' | 'equal' } => {
  const diff = current - previous;
  if (diff > 0) return { label: `+${diff} GAIN`, color: 'text-emerald-400', icon: 'up' };
  if (diff < 0) return { label: `${diff} LOSS`, color: 'text-red-500', icon: 'down' };
  return { label: 'STAGNANT', color: 'text-gray-400', icon: 'equal' };
};
