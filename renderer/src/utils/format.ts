import type { Locale } from "date-fns";

import format from "date-fns/format";
import formatDistance from "date-fns/formatDistance";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import ru from "date-fns/locale/ru";
import enUS from "date-fns/locale/en-US";


function getDateLocale(locale: "ru" | "en"): Locale {
  return locale === "ru" ? ru : enUS;
}

export function formatDateDistanceToNow(date: string | Date, locale: "ru" | "en"): string {
  return formatDistanceToNow(new Date(date), { locale: getDateLocale(locale), addSuffix: true });
}

export function formatDateDistanceTo(from: string | Date, to: string | Date, locale: "ru" | "en"): string {
  return formatDistance(new Date(from), new Date(to), { locale: getDateLocale(locale), addSuffix: true });
}

export function formatDate(date: string | Date, locale: "ru" | "en"): string {
  return format(new Date(date), "d MMMM", { locale: getDateLocale(locale) });
}
