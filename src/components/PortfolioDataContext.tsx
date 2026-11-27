'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  mergePortfolioData,
  PORTFOLIO_DATA,
  PortfolioData,
} from '@/data/portfolio';

interface PortfolioDataContextValue {
  data: PortfolioData;
  isLiveLoaded: boolean;
}

const PortfolioDataContext = createContext<PortfolioDataContextValue>({
  data: PORTFOLIO_DATA,
  isLiveLoaded: false,
});

export function PortfolioDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<PortfolioData>(PORTFOLIO_DATA);
  const [isLiveLoaded, setIsLiveLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchPortfolio() {
      try {
        const snap = await getDoc(doc(db, 'portfolio', 'main'));
        if (!active) return;
        if (snap.exists()) {
          const merged = mergePortfolioData(snap.data() as Partial<PortfolioData>);
          setData(merged);
        }
      } catch {
        // Fallback silently to hardcoded defaults so public site never breaks
      } finally {
        if (active) setIsLiveLoaded(true);
      }
    }

    fetchPortfolio();
    return () => {
      active = false;
    };
  }, []);

  return (
    <PortfolioDataContext.Provider value={{ data, isLiveLoaded }}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  return useContext(PortfolioDataContext);
}
