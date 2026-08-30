import { useEffect } from 'react';
import { useQuote } from './useQuote';

/**
 * Lets a page take over the standing corner button.
 *
 * The corner button offers a free quote almost everywhere, but the realtor and
 * partner pages are asking for something else entirely, and each already has its
 * own form. On those pages the button keeps its place and raises that form
 * instead, so the corner always offers whatever the page is actually about.
 *
 * Pass a stable onClick, from useCallback or a setter, or the registration will
 * run on every render.
 */
export function useCornerCta(label, onClick, hidden = false) {
  const { setCornerCta } = useQuote();

  useEffect(() => {
    setCornerCta({ label, onClick, hidden });
    return () => setCornerCta(null);
  }, [label, onClick, hidden, setCornerCta]);
}
