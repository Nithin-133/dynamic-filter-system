import type { FilterRule, FieldSchema, MatchMode } from '../config/types';
import { OperatorRegistry } from '../config/operatorRegistry';
import { getNestedValue, isEmptyValue } from './utils';

/**
 * Pure function to filter records based on dynamic schema definitions, active rules, and matching mode.
 * Decoupled from React, fully memoizable and unit-testable.
 */
export function applyFilters<T>(
  data: T[],
  rules: FilterRule[],
  schemas: FieldSchema[],
  matchMode: MatchMode = 'AND'
): T[] {
  if (!data || data.length === 0) return [];
  if (rules.length === 0) return data;

  return data.filter((item) => {
    // For each rule, determine if the item matches it
    const ruleMatches = rules.map((rule) => {
      // 1. Resolve schema to get field type
      const schema = schemas.find((s) => s.key === rule.fieldKey);
      if (!schema) return true; // Ignore rule if schema isn't found

      // 2. Fetch value from item (resolves nested paths like 'address.city')
      const fieldValue = getNestedValue(item, rule.fieldKey);

      // 3. Lookup the operator logic in the config registry
      const typeConfig = OperatorRegistry[schema.type];
      const operatorConfig = typeConfig?.operators[rule.operator];

      if (!operatorConfig) return true; // Ignore if operator is unknown

      // 4. Handle edge case: empty value input
      // If user hasn't typed anything yet or has an empty range, do not filter out the row
      if (isEmptyValue(rule.value)) {
        return true;
      }

      // 5. Apply evaluator with safe try/catch boundaries
      try {
        return operatorConfig.apply(fieldValue, rule.value);
      } catch (err) {
        console.error(`Error evaluating rule: ${rule.fieldKey} ${rule.operator}`, err);
        return true; // Fallback to true in case of unexpected errors to avoid crashing UI
      }
    });

    // 6. Combine matches based on matching mode
    if (matchMode === 'AND') {
      return ruleMatches.every(Boolean);
    } else {
      // For OR mode, if all rule inputs are empty/inactive, we match everything
      const hasActiveRules = rules.some((r) => !isEmptyValue(r.value));
      if (!hasActiveRules) return true;
      
      return ruleMatches.some(Boolean);
    }
  });
}
