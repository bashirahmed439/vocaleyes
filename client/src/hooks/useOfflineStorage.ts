import { useState, useEffect } from 'react';

interface DraftEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: number;
}

const STORAGE_KEY = 'vocal_eyes_drafts';

export function useOfflineStorage() {
  const [drafts, setDrafts] = useState<DraftEmail[]>([]);

  useEffect(() => {
    // Load drafts from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setDrafts(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load drafts:', error);
      }
    }
  }, []);

  const saveDraft = (to: string, subject: string, body: string) => {
    const draft: DraftEmail = {
      id: Date.now().toString(),
      to,
      subject,
      body,
      timestamp: Date.now(),
    };

    const updated = [...drafts, draft];
    setDrafts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    return draft;
  };

  const getDrafts = () => {
    return drafts.sort((a, b) => b.timestamp - a.timestamp);
  };

  const deleteDraft = (id: string) => {
    const updated = drafts.filter(d => d.id !== id);
    setDrafts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearDrafts = () => {
    setDrafts([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    saveDraft,
    getDrafts,
    deleteDraft,
    clearDrafts,
    drafts,
  };
}
