import { TRANSLATIONS } from "./translations.js";

const LANGUAGE_STORAGE_KEY = "lang";
const SUPPORTED_LANGUAGES = Object.keys(TRANSLATIONS);

/** Saved choice first, then the browser language, then English. */
export function getInitialLanguage() {
  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (SUPPORTED_LANGUAGES.includes(savedLanguage)) return savedLanguage;
  } catch {
    // Storage can be blocked (private mode); fall back to the browser language.
  }
  const browserLanguage = (navigator.language || "").toLowerCase();
  return browserLanguage.startsWith("hr") ? "hr" : "en";
}

export function saveLanguage(language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Not saving the choice is fine; it only affects the next visit.
  }
}

/** Fills every element marked with a data-i18n* attribute with the texts for `language`. */
export function applyStaticTranslations(language) {
  const texts = TRANSLATIONS[language];
  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = texts[element.dataset.i18n];
  });
  // Only our own fixed texts from translations.js go in as HTML (for the bold words).
  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = texts[element.dataset.i18nHtml];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = texts[element.dataset.i18nPlaceholder];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", texts[element.dataset.i18nAria]);
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.alt = texts[element.dataset.i18nAlt];
  });
  document.querySelectorAll("[data-lang]").forEach((languageButton) => {
    languageButton.setAttribute("aria-pressed", String(languageButton.dataset.lang === language));
  });

  return texts;
}
