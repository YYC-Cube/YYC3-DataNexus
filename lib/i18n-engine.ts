/**
 * i18n 引擎核心 — 引用自 docs/i18n-core/src/lib/engine.ts
 * 零依赖、高性能国际化引擎
 */

import type { Locale, TranslationMap } from "./i18n-types";

export interface I18nEngineConfig {
  locale: Locale;
  fallbackLocale?: Locale;
  translations?: Partial<Record<Locale, TranslationMap>>;
}

export class I18nEngine {
  private locale: Locale;
  private fallbackLocale: Locale;
  private translations: Map<Locale, TranslationMap> = new Map();

  constructor(config: I18nEngineConfig) {
    this.locale = config.locale;
    this.fallbackLocale = config.fallbackLocale ?? "zh-CN";
    if (config.translations) {
      for (const [loc, map] of Object.entries(config.translations)) {
        this.translations.set(loc as Locale, map || {});
      }
    }
  }

  setLocale(locale: Locale): void {
    this.locale = locale;
  }

  getLocale(): Locale {
    return this.locale;
  }

  load(locale: Locale, translations: TranslationMap): void {
    const existing = this.translations.get(locale) || {};
    this.translations.set(locale, { ...existing, ...translations });
  }

  t(key: string, params?: Record<string, string | number>): string {
    const template = this.resolve(key) ?? key;
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_, name: string) =>
      String(params[name] ?? `{${name}}`)
    );
  }

  private resolve(key: string): string | undefined {
    const parts = key.split(".");
    return (
      this.lookup(this.locale, parts) ??
      this.lookup(this.fallbackLocale, parts)
    );
  }

  private lookup(locale: Locale, parts: string[]): string | undefined {
    const map = this.translations.get(locale);
    if (!map) return undefined;
    let current: unknown = map;
    for (const part of parts) {
      if (typeof current !== "object" || current === null) return undefined;
      current = (current as Record<string, unknown>)[part];
    }
    return typeof current === "string" ? current : undefined;
  }
}

let _instance: I18nEngine | null = null;

export function initI18n(config: I18nEngineConfig): I18nEngine {
  _instance = new I18nEngine(config);
  return _instance;
}

export function i18n(): I18nEngine {
  if (!_instance) {
    _instance = initI18n({ locale: "zh-CN", fallbackLocale: "en" });
  }
  return _instance;
}

export function t(key: string, params?: Record<string, string | number>): string {
  return i18n().t(key, params);
}
