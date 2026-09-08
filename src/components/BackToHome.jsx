import { useLang } from '../context/useLang';
import { getSectionHash } from '../translations';
import { goToHash } from '../lib/routing';

/**
 * One way back, the same on every individual page.
 *
 * Each page had invented its own: a full primary button here, a bare link
 * there, different wording in the middle. A visitor reads that as three
 * different sites, so the link is now a single component with a single key
 * behind it.
 */
export default function BackToHome() {
  const { t, lang } = useLang();
  const homeHash = getSectionHash(lang, 'home');

  const goHome = (e) => {
    e.preventDefault();
    goToHash(homeHash);
    setTimeout(() => window.scrollTo(0, 0), 50);
  };

  return (
    <div className="back-home-wrap">
      <a href={`#${homeHash}`} className="back-home" onClick={goHome}>
        <span className="back-home-arrow" aria-hidden="true">&larr;</span>
        {t('privacy.backToHome')}
      </a>
    </div>
  );
}
