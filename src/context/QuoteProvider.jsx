import { useState, useCallback, useMemo } from 'react';
import { QuoteContext } from './quoteContextInstance';

/**
 * Holds whether the quote dialog is showing. It lives above the page switch so any
 * page, and any button on it, can raise the same form.
 */
export function QuoteProvider({ children }) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const openQuote = useCallback(() => setQuoteOpen(true), []);
  const closeQuote = useCallback(() => setQuoteOpen(false), []);
  const value = useMemo(() => ({ quoteOpen, openQuote, closeQuote }), [quoteOpen, openQuote, closeQuote]);

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}
