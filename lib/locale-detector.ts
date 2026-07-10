/**
 * 语言检测器 — 引用自 docs/i18n-core/src/lib/detector.ts
 */

import type { Locale } from "./i18n-types";

export interface LocaleDetectionResult {
  locale: Locale;
  source: "navigator" | "localStorage" | "cookie" | "default";
  confidence: number;
}

const LOCALE_MAP: Record<string, Locale> = {
  "zh": "zh-CN",
  "zh-CN": "zh-CN",
  "zh-Hans": "zh-CN",
  "zh-SG": "zh-CN",
  "zh-TW": "zh-TW",
  "zh-Hant": "zh-TW",
  "zh-HK": "zh-TW",
  "en": "en",
  "en-US": "en",
  "en-GB": "en",
  "ja": "ja",
  "ja-JP": "ja",
  "ko": "ko",
  "ko-KR": "ko",
  "ar": "ar",
  "de": "de",
  "fr": "fr",
  "es": "es",
  "pt-BR": "pt-BR",
  "pt": "pt-BR",
};

export function normalizeLocale(raw: string): Locale {
  return LOCALE_MAP[raw] || LOCALE_MAP[raw.split("-")[0]] || "en";
}

export function isChineseLocale(locale: string): boolean {
  return locale.startsWith("zh");
}

export function detectSystemLocale(): LocaleDetectionResult {
  if (typeof window === "undefined") {
    return { locale: "zh-CN", source: "default", confidence: 0 };
  }

  // 1. localStorage
  const stored = localStorage.getItem("yyc3:locale");
  if (stored) {
    return { locale: normalizeLocale(stored), source: "localStorage", confidence: 1 };
  }

  // 2. navigator
  const nav = navigator.language;
  if (nav) {
    return { locale: normalizeLocale(nav), source: "navigator", confidence: 0.8 };
  }

  return { locale: "zh-CN", source: "default", confidence: 0 };
}
