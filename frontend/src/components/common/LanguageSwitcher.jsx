import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from '../../i18n';

export default function LanguageSwitcher({ className = '', variant = 'light' }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const isDark = variant === 'dark';

  const current =
    SUPPORTED_LANGUAGES.find(({ code }) => code === i18n.language?.split('-')[0]) ||
    SUPPORTED_LANGUAGES[0];

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`language-switcher ${isDark ? 'language-switcher-dark' : ''} ${open ? 'is-open' : ''} ${className}`.trim()}
    >
      <button
        type="button"
        className={`btn btn-sm language-switcher-toggle d-flex align-items-center gap-2 ${
          isDark ? 'btn-booking-lang' : 'btn-outline-secondary'
        }`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('common.language')}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="language-flag" aria-hidden="true">
          {current.flag}
        </span>
        <span className="language-label d-none d-sm-inline">{current.label}</span>
        <span className="language-chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <ul className="language-switcher-menu shadow-sm" role="listbox">
          {SUPPORTED_LANGUAGES.map(({ code, label, flag }) => (
            <li key={code} role="option" aria-selected={current.code === code}>
              <button
                type="button"
                className={`language-switcher-item ${current.code === code ? 'active' : ''}`}
                onClick={() => handleChange(code)}
              >
                <span aria-hidden="true">{flag}</span>
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
