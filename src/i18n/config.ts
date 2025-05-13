import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import jaTranslation from './locales/ja.json';

i18n
  .use(initReactI18next)
  .use(LanguageDetector) // ユーザーの言語設定を検知するために必要
  .init({
    fallbackLng: 'ja', // デフォルトの言語を設定
    returnEmptyString: false, // 空文字での定義を許可に
    resources: {
      // 辞書情報
      // 用意した翻訳ファイルを読み込む
      en: {
        translation: enTranslation,
      },
      ja: {
        translation: jaTranslation,
      },
    },
    interpolation: {
      // 翻訳された文字列内のHTMLやReactコンポーネントをエスケープすることを無効に
      escapeValue: false,
    },
    react: {
      // 指定したHTMLノードを翻訳時にそのまま保持して表示するための設定
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'span'],
    },
    detection: {
      // 言語を検出する順序を指定します
      order: [
        'querystring', // URLのクエリパラメータから検出
        'cookie', // クッキーから検出
        'localStorage', // ローカルストレージから検出
        'navigator', // ブラウザの言語設定から検出
        'htmlTag', // HTMLタグのlang属性から検出
        'path', // URLのパスから検出
        'subdomain', // サブドメインから検出
      ],
      // 言語設定をキャッシュする方法を指定します
      caches: ['cookie'], // クッキーにキャッシュ
    },
  });

export default i18n;
