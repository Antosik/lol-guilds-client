import { format, formatDistance, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";


export function formatDateDistanceToNow(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { locale: ru, addSuffix: true });
}

export function formatDateDistanceTo(from: string | Date, to: string | Date): string {
  return formatDistance(new Date(from), new Date(to), { locale: ru, addSuffix: true });
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "d MMMM", { locale: ru });
}