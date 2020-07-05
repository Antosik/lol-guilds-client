type NotExisting = undefined | null;

export function isNotExists<T>(item: T | NotExisting): item is NotExisting {
  return item === undefined || item === null;
}

export function isExists<T>(item: T | NotExisting): item is T {
  return item !== undefined && item !== null;
}

export function isNotEmpty<T>(item: T[] | NotExisting): item is T[] {
  return isExists(item) && item.length > 0;
}

export function isEmpty<T>(item: T[] | NotExisting): item is NotExisting {
  return !isExists(item) || item.length === 0;
}

export function isNotBlank(item: string | NotExisting): item is string {
  return isExists(item) && item.trim().length > 0;
}

export function isBlank(item: string | NotExisting): item is NotExisting {
  return !isExists(item) || item.trim().length === 0;
}