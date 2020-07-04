export function isNotExists<T>(item: T | undefined | null): item is undefined {
  return item === undefined || item === null;
}

export function isExists<T>(item: T | undefined | null): item is T {
  return item !== undefined && item !== null;
}

export function isNotEmpty<T>(item: T[] | undefined | null): item is T[] {
  return isExists(item) && item.length > 0;
}

export function isEmpty<T>(item: T[] | undefined | null): item is undefined {
  return !isExists(item) || item.length === 0;
}
