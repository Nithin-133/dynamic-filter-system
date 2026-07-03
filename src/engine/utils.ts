/**
 * Safely extracts a value from an object using a dot-notation string path.
 * E.g., getNestedValue({ address: { city: 'SF' } }, 'address.city') -> 'SF'
 */
export function getNestedValue(obj: any, path: string): any {
  if (obj === null || obj === undefined) return undefined;
  if (!path) return obj;

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }

  return current;
}

/**
 * Checks if a value is empty or not filled.
 * Useful for checking range selections.
 */
export function isEmptyValue(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') {
    // Check if range/date-range has any filled property
    return Object.values(value).every((v) => v === undefined || v === '');
  }
  return false;
}
