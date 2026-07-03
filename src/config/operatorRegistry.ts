import type { FieldType, RangeValue, DateRangeValue } from './types';

export interface OperatorConfig<TVal, TFieldVal> {
  label: string;
  apply: (fieldValue: TFieldVal, filterValue: TVal) => boolean;
  validate?: (value: TVal) => string | null;
}

export interface FieldTypeConfig<TVal = any, TFieldVal = any> {
  operators: Record<string, OperatorConfig<TVal, TFieldVal>>;
  defaultValue: () => TVal;
  inputType: 'text' | 'number' | 'select' | 'multi-select' | 'boolean' | 'date' | 'range' | 'date-range';
}

// Safely convert any value to string for comparison
const safeString = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val).toLowerCase();
  return String(val).trim().toLowerCase();
};

// Parse a date safely
const parseDate = (val: any): Date | null => {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

export const OperatorRegistry: Record<FieldType, FieldTypeConfig> = {
  text: {
    inputType: 'text',
    defaultValue: () => '',
    operators: {
      contains: {
        label: 'Contains',
        apply: (fieldVal, filterVal) => {
          const f = safeString(fieldVal);
          const v = safeString(filterVal);
          return v === '' || f.includes(v);
        }
      },
      equals: {
        label: 'Equals',
        apply: (fieldVal, filterVal) => {
          return safeString(fieldVal) === safeString(filterVal);
        }
      },
      starts_with: {
        label: 'Starts With',
        apply: (fieldVal, filterVal) => {
          return safeString(fieldVal).startsWith(safeString(filterVal));
        }
      },
      ends_with: {
        label: 'Ends With',
        apply: (fieldVal, filterVal) => {
          return safeString(fieldVal).endsWith(safeString(filterVal));
        }
      },
      does_not_contain: {
        label: 'Does Not Contain',
        apply: (fieldVal, filterVal) => {
          const f = safeString(fieldVal);
          const v = safeString(filterVal);
          return v === '' || !f.includes(v);
        }
      }
    }
  },
  number: {
    inputType: 'range',
    defaultValue: () => ({ min: undefined, max: undefined }),
    operators: {
      equals: {
        label: 'Equals',
        apply: (fieldVal, filterVal) => {
          if (fieldVal === null || fieldVal === undefined) return false;
          if (typeof filterVal === 'object') {
            const val = filterVal.min; // fallback in case of range state
            return val === undefined ? true : Number(fieldVal) === Number(val);
          }
          return Number(fieldVal) === Number(filterVal);
        }
      },
      gt: {
        label: 'Greater Than',
        apply: (fieldVal, filterVal) => {
          if (fieldVal === null || fieldVal === undefined) return false;
          const target = typeof filterVal === 'object' ? filterVal.min : filterVal;
          return target === undefined ? true : Number(fieldVal) > Number(target);
        }
      },
      lt: {
        label: 'Less Than',
        apply: (fieldVal, filterVal) => {
          if (fieldVal === null || fieldVal === undefined) return false;
          const target = typeof filterVal === 'object' ? filterVal.max : filterVal;
          return target === undefined ? true : Number(fieldVal) < Number(target);
        }
      },
      gte: {
        label: 'Greater Than or Equal',
        apply: (fieldVal, filterVal) => {
          if (fieldVal === null || fieldVal === undefined) return false;
          const target = typeof filterVal === 'object' ? filterVal.min : filterVal;
          return target === undefined ? true : Number(fieldVal) >= Number(target);
        }
      },
      lte: {
        label: 'Less Than or Equal',
        apply: (fieldVal, filterVal) => {
          if (fieldVal === null || fieldVal === undefined) return false;
          const target = typeof filterVal === 'object' ? filterVal.max : filterVal;
          return target === undefined ? true : Number(fieldVal) <= Number(target);
        }
      },
      between: {
        label: 'Between',
        apply: (fieldVal, filterVal) => {
          if (fieldVal === null || fieldVal === undefined) return false;
          const range = filterVal as RangeValue<number>;
          const min = range.min;
          const max = range.max;
          const val = Number(fieldVal);

          if (min !== undefined && max !== undefined) {
            return val >= min && val <= max;
          } else if (min !== undefined) {
            return val >= min;
          } else if (max !== undefined) {
            return val <= max;
          }
          return true;
        }
      }
    }
  },
  date: {
    inputType: 'date-range',
    defaultValue: () => ({ start: '', end: '' }),
    operators: {
      before: {
        label: 'Before',
        apply: (fieldVal, filterVal) => {
          const fieldDate = parseDate(fieldVal);
          if (!fieldDate) return false;
          const targetStr = typeof filterVal === 'object' ? filterVal.start : filterVal;
          const targetDate = parseDate(targetStr);
          return targetDate ? fieldDate.getTime() < targetDate.getTime() : true;
        }
      },
      after: {
        label: 'After',
        apply: (fieldVal, filterVal) => {
          const fieldDate = parseDate(fieldVal);
          if (!fieldDate) return false;
          const targetStr = typeof filterVal === 'object' ? filterVal.end : filterVal;
          const targetDate = parseDate(targetStr);
          return targetDate ? fieldDate.getTime() > targetDate.getTime() : true;
        }
      },
      between: {
        label: 'Between (Range)',
        apply: (fieldVal, filterVal) => {
          const fieldDate = parseDate(fieldVal);
          if (!fieldDate) return false;
          const range = filterVal as DateRangeValue;
          const start = parseDate(range.start);
          const end = parseDate(range.end);
          const valTime = fieldDate.getTime();

          if (start && end) {
            return valTime >= start.getTime() && valTime <= end.getTime();
          } else if (start) {
            return valTime >= start.getTime();
          } else if (end) {
            return valTime <= end.getTime();
          }
          return true;
        }
      }
    }
  },
  amount: {
    inputType: 'range',
    defaultValue: () => ({ min: undefined, max: undefined }),
    operators: {
      equals: {
        label: 'Equals',
        apply: (fieldVal, filterVal) => {
          if (fieldVal === null || fieldVal === undefined) return false;
          if (typeof filterVal === 'object') {
            const val = filterVal.min;
            return val === undefined ? true : Number(fieldVal) === Number(val);
          }
          return Number(fieldVal) === Number(filterVal);
        }
      },
      gt: {
        label: 'Greater Than',
        apply: (fieldVal, filterVal) => {
          if (fieldVal === null || fieldVal === undefined) return false;
          const target = typeof filterVal === 'object' ? filterVal.min : filterVal;
          return target === undefined ? true : Number(fieldVal) > Number(target);
        }
      },
      lt: {
        label: 'Less Than',
        apply: (fieldVal, filterVal) => {
          if (fieldVal === null || fieldVal === undefined) return false;
          const target = typeof filterVal === 'object' ? filterVal.max : filterVal;
          return target === undefined ? true : Number(fieldVal) < Number(target);
        }
      },
      between: {
        label: 'Between',
        apply: (fieldVal, filterVal) => {
          if (fieldVal === null || fieldVal === undefined) return false;
          const range = filterVal as RangeValue<number>;
          const min = range.min;
          const max = range.max;
          const val = Number(fieldVal);

          if (min !== undefined && max !== undefined) {
            return val >= min && val <= max;
          } else if (min !== undefined) {
            return val >= min;
          } else if (max !== undefined) {
            return val <= max;
          }
          return true;
        }
      }
    }
  },
  select: {
    inputType: 'select',
    defaultValue: () => '',
    operators: {
      is: {
        label: 'Is',
        apply: (fieldVal, filterVal) => {
          if (fieldVal === null || fieldVal === undefined) return filterVal === '';
          return String(fieldVal) === String(filterVal);
        }
      },
      is_not: {
        label: 'Is Not',
        apply: (fieldVal, filterVal) => {
          if (fieldVal === null || fieldVal === undefined) return filterVal !== '';
          return String(fieldVal) !== String(filterVal);
        }
      }
    }
  },
  'multi-select': {
    inputType: 'multi-select',
    defaultValue: () => [],
    operators: {
      in: {
        label: 'In',
        apply: (fieldVal, filterVal) => {
          const list = filterVal as any[];
          if (!list || list.length === 0) return true;
          return list.map(String).includes(String(fieldVal));
        }
      },
      not_in: {
        label: 'Not In',
        apply: (fieldVal, filterVal) => {
          const list = filterVal as any[];
          if (!list || list.length === 0) return true;
          return !list.map(String).includes(String(fieldVal));
        }
      }
    }
  },
  boolean: {
    inputType: 'boolean',
    defaultValue: () => true,
    operators: {
      is: {
        label: 'Is',
        apply: (fieldVal, filterVal) => {
          const f = fieldVal === true || String(fieldVal).toLowerCase() === 'true';
          const v = filterVal === true || String(filterVal).toLowerCase() === 'true';
          return f === v;
        }
      }
    }
  },
  array: {
    inputType: 'multi-select',
    defaultValue: () => [],
    operators: {
      contains_any: {
        label: 'Contains Any',
        apply: (fieldVal, filterVal) => {
          const fieldArr = Array.isArray(fieldVal) ? fieldVal.map(String) : [];
          const filterArr = Array.isArray(filterVal) ? filterVal.map(String) : [];
          if (filterArr.length === 0) return true;
          return filterArr.some((item) => fieldArr.includes(item));
        }
      },
      contains_all: {
        label: 'Contains All',
        apply: (fieldVal, filterVal) => {
          const fieldArr = Array.isArray(fieldVal) ? fieldVal.map(String) : [];
          const filterArr = Array.isArray(filterVal) ? filterVal.map(String) : [];
          if (filterArr.length === 0) return true;
          return filterArr.every((item) => fieldArr.includes(item));
        }
      },
      does_not_contain: {
        label: 'Does Not Contain',
        apply: (fieldVal, filterVal) => {
          const fieldArr = Array.isArray(fieldVal) ? fieldVal.map(String) : [];
          const filterArr = Array.isArray(filterVal) ? filterVal.map(String) : [];
          if (filterArr.length === 0) return true;
          return !filterArr.some((item) => fieldArr.includes(item));
        }
      }
    }
  }
};
