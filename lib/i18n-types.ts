/**
 * i18n 类型定义 — 引用自 docs/i18n-core/src/lib/types.ts
 */

export type Locale =
  | "zh-CN"
  | "zh-TW"
  | "en"
  | "ja"
  | "ko"
  | "ar"
  | "de"
  | "fr"
  | "es"
  | "pt-BR";

export type TranslationMap = Record<string, unknown>;

export interface TranslateParams {
  key: string;
  params?: Record<string, string | number>;
  locale?: Locale;
}

// RTL 相关
export type TextDirection = "ltr" | "rtl";

export type RTLLocale = "ar" | "he" | "fa" | "ur";

export const RTL_LOCALES: RTLLocale[] = ["ar", "he", "fa", "ur"];

export function isRTL(locale: string): boolean {
  return RTL_LOCALES.includes(locale as RTLLocale);
}

// 间距镜像
export type SpacingProperty =
  | "ml" | "mr" | "pl" | "pr"
  | "ml-" | "mr-" | "pl-" | "pr-"
  | "margin-left" | "margin-right"
  | "padding-left" | "padding-right";

export type HorizontalAlignment = "left" | "right" | "start" | "end";
