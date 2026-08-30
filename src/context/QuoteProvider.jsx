import { useState, useCallback, useMemo } from 'react';
import { QuoteContext } from './quoteContextInstance';

/**
 * Holds whether the quote dialog is showing. It lives above the page switch so any
 * page, and any button on it, can raise the same form.
 */
export function QuoteProvider({ children }) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  // What the corner button offers. Null means the free quote, which is the case
  // on every page except the two that are asking for something else.
  const [cornerCta, setCornerCta] = useState(null);
  const openQuote = useCallback(() => setQuoteOpen(true), []);
  const closeQuote = useCallback(() => setQuoteOpen(false), []);
  const value = useMemo(
    () => ({ quoteOpen, openQuote, closeQuote, cornerCta, setCornerCta }),
    [quoteOpen, openQuote, closeQuote, cornerCta],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}
