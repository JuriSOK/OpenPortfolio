import type { Locale } from '../../schemas/common';

interface LocalizedStringValue {
  fr: string;
  en?: string;
}

interface LocalizedListValue {
  fr: string[];
  en?: string[];
}

// Résolution de locale à sens unique (ADR-0011 : fr seul garanti à tout
// statut, en conditionnel selon le statut de publication) :
// - locale "fr"                          -> value.fr
// - locale "en", traduction présente     -> value.en
// - locale "en", traduction absente      -> repli sur value.fr
// Jamais de repli fr -> en.
export function resolveLocalizedString(
  value: LocalizedStringValue | undefined,
  locale: Locale,
): string | undefined {
  if (!value) return undefined;
  if (locale === 'en' && value.en) return value.en;
  return value.fr;
}

export function resolveLocalizedStringList(
  value: LocalizedListValue | undefined,
  locale: Locale,
): string[] | undefined {
  if (!value) return undefined;
  if (locale === 'en' && value.en && value.en.length > 0) return value.en;
  return value.fr;
}
