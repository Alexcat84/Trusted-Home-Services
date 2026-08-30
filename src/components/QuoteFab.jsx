import { useEffect, useState } from 'react';
import { useLang } from '../context/useLang';
import { useQuote } from '../context/useQuote';

/**
 * Standing quote button, pinned to the bottom right of the viewport on every page.
 *
 * It replaces the quote entry that used to sit in the navigation, and the calls to
 * action that used to close each service page. Because it never scrolls away, the
 * form is one click from anywhere instead of something to go looking for.
 */
export default function QuoteFab() {
  const { t } = useLang();
  const { quoteOpen, openQuote, cornerCta } = useQuote();
  const [overFooter, setOverFooter] = useState(false);

  // Once the footer is on screen the visitor has reached the end of the page,
  // where the button would only sit on top of the closing content. The footer is
  // looked up on every check rather than observed once, because moving between
  // the home page and a service page swaps the element for a new one.
  useEffect(() => {
    let pending = false;
    let frame = null;
    const measure = () => {
      pending = false;
      frame = null;
      const footer = document.querySelector('.footer');
      setOverFooter(footer ? footer.getBoundingClientRect().top < window.innerHeight : false);
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame != null) window.cancelAnimationFrame(frame);
    };
  }, []);

  // While the dialog is up the button has nothing left to do, and it would only
  // sit behind the scrim.
  // A page that registered its own offer also says when its form is up.
  if (quoteOpen || cornerCta?.hidden) return null;

  const label = cornerCta ? cornerCta.label : t('nav.quote');
  const onClick = cornerCta ? cornerCta.onClick : openQuote;

  return (
    <button
      type="button"
      className={`quote-fab ${overFooter ? 'quote-fab--hidden' : ''}`}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <path
          d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9L20 9.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M14 4v6h6M8 13h8M8 16.5h5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="quote-fab-label">{label}</span>
    </button>
  );
}
