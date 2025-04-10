import { InitOptions, TOptions } from 'i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import en from 'locales/en.json';
import vi from 'locales/vi.json';

export type I18nKey = keyof typeof en;

export const t = (key: I18nKey, options?: TOptions) =>
  i18n.t(key, { ...options, ns: 'translation' });

import { initReactI18next } from 'react-i18next';
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  // pass the i18n instance to react-i18next.
  .use(Backend)
  .use(initReactI18next)
  .use(LanguageDetector)

  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'vi',
    debug: true,
    supportedLngs: ['vi', 'en'],

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: en,
      },
      vi: {
        translation: vi,
      },
    },
  } as InitOptions);

export default i18n;
