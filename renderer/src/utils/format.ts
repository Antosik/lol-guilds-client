import type { Locale } from "date-fns";

import { format, formatDistance, formatDistanceToNow } from "date-fns";
import { ru, enUS } from "date-fns/locale";


function getLocale(locale: "ru" | "en"): Locale {
  return locale === "ru" ? ru : enUS;
}

export function formatDateDistanceToNow(date: string | Date, locale: "ru" | "en"): string {
  return formatDistanceToNow(new Date(date), { locale: getLocale(locale), addSuffix: true });
}

export function formatDateDistanceTo(from: string | Date, to: string | Date, locale: "ru" | "en"): string {
  return formatDistance(new Date(from), new Date(to), { locale: getLocale(locale), addSuffix: true });
}

export function formatDate(date: string | Date, locale: "ru" | "en"): string {
  return format(new Date(date), "d MMMM", { locale: getLocale(locale) });
}