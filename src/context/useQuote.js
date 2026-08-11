import { useContext } from 'react';
import { QuoteContext } from './quoteContextInstance';

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error('useQuote must be used within QuoteProvider');
  return ctx;
}
