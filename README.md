# Architecture Design Doc: Reusable Dynamic Filter Component System

This project contains a type-safe, configuration-driven dynamic filter component system built with React 18, TypeScript, and Material UI. It is designed to work with any data table, supporting varied data schemas (including nested fields and array values) without modifying the internal engine.

---

## 1. What Problem This Solves
Generic tables are easy; generic *filtering* is hard. Most React filter builders fall into the trap of using large, nested switch/case blocks for UI rendering and filter evaluation. This leads to rigid architectures that violate the Open/Closed Principle: adding a new data type or operator forces developers to modify several files (UI inputs, validation handlers, and evaluation engines).

This architecture implements a **data-driven query engine**. The UI components and filtering engine are completely decoupled from concrete fields, operators, and schemas. They rely instead on:
1. A **Discriminated Union Type System** that statically guarantees that only valid operator/value combinations are configured.
2. A **Centralized Operator Registry** that maps field types to their valid operations and pure evaluator functions.

---

## 2. Directory Structure & Key Architectural Separation

The folder structure is cleanly separated into config, logic engine, and presentation layers:

```
src/
├── config/
│   ├── types.ts             # Compile-time type boundaries (discriminated unions)
│   └── operatorRegistry.ts  # Runtime mapping of field types to logic & UI controls
├── engine/
│   ├── filterEvaluator.ts   # Decoupled, pure, testable filter algorithm (applyFilters)
│   └── utils.ts             # Dot notation resolver and input helpers
├── mock/
│   ├── employees.ts         # Sample dataset 1 (50+ employees, arrays, nulls, nested objects)
│   └── transactions.ts      # Sample dataset 2 (50+ spend ledgers, currency fields, different categories)
├── presentation/
│   ├── components/
│   │   ├── DataTable/       # Reusable, sortable table rendering engine
│   │   └── FilterBuilder/   # Configuration-driven query UI (rows, dynamic inputs)
│   └── theme/               # Dark & Light modes with sleek modern CSS tokens
├── App.tsx                  # Root shell page linking the layers
└── main.tsx                 # App mount entrypoint
```

---

## 3. Key Design Decisions

### A. Discriminated Union Type Safety
`FilterRule` is defined as a discriminated union mapped across the `FieldType` enum. TypeScript checks the `type` discriminant, enforcing that:
* If the rule targets a `boolean` field, the operator *must* be `'is'` and the value *must* be a `boolean`.
* If it targets a `number` field, the operator *must* be an allowed numeric operator (like `between`) and the value shape *must* match `number | RangeValue<number>`.

This prevents invalid rules (e.g. searching "Contains" on a boolean status) at compile time.

### B. The Operator Registry Pattern (Open/Closed Principle)
Every field type registers its allowed actions inside the `OperatorRegistry`:
```typescript
export interface OperatorConfig<TVal, TFieldVal> {
  label: string;
  apply: (fieldValue: TFieldVal, filterValue: TVal) => boolean;
  validate?: (value: TVal) => string | null;
}
```
The query builder looks up what operator list to display and how to evaluate values by inspecting this registry. The evaluator is a pure loop lookup:
```typescript
const typeConfig = OperatorRegistry[schema.type];
const operatorConfig = typeConfig?.operators[rule.operator];
return operatorConfig.apply(fieldValue, rule.value);
```
No `switch-case` statements exist for operators.

### C. Pure Decoupled Filtering Engine
`applyFilters(data, rules, schemas, matchMode)` is a side-effect-free, pure utility. It does not depend on React components, states, or hooks. This enables:
* **Trivial unit-testability**: You can test complex query logic in a pure JS test environment.
* **Performance optimization**: React can memoize the results using `useMemo` based on the data and active rules array, preventing unnecessary re-calculations on unrelated state updates.

---

## 4. How to Add a New Field Type in 3 Steps

Adding a completely new field type (for example, a `duration` field with specific time duration inputs and operators like `longer_than` or `shorter_than`) requires **zero modifications** to components or evaluator loops:

1. **Add type literals to `src/config/types.ts`**:
   Add `'duration'` to the `FieldType` union, define its valid operators (`'longer_than' | 'shorter_than'`), and set its value shape (e.g. `{ minutes: number }`).

2. **Register it in `src/config/operatorRegistry.ts`**:
   Add a `duration` entry inside the `OperatorRegistry`:
   ```typescript
   duration: {
     inputType: 'range', // UI component style helper
     defaultValue: () => ({ min: 0, max: 0 }),
     operators: {
       longer_than: {
         label: 'Longer Than',
         apply: (fieldVal, filterVal) => Number(fieldVal) > Number(filterVal.min)
       }
       // ... other operators
     }
   }
   ```

3. **Map the input UI in `src/presentation/components/FilterBuilder/FilterValueInput.tsx`**:
   Add a case inside `FilterValueInput` to render your custom duration slider or input boxes. The builder row will pick it up automatically!

---

## 5. Edge Cases Handled

* **Incomplete Range Bounds**: For the `between` range operator (numbers, dates, currency), if the user only fills in the minimum bound, the engine safely evaluates it as `>= min` rather than throwing an error or filtering out all results.
* **Null / Undefined Field Traversal**: When resolving nested keys like `address.city`, if the intermediate object `address` is missing or null, the traverser safely falls back to `undefined` without throwing runtime crashes.
* **Typing Debounces**: Text searches are debounced by `300ms` at the field input layer. The active filter list only updates after the user stops typing, maintaining 60fps scrolling performance on the table.
* **Empty Rules Recovery**: If rules are empty, or if an invalid combination slips through, the evaluator defaults to `true` to ensure the table continues displaying data.

---

## 6. How to Run Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* npm (v9 or higher)

### Setup Instructions
1. Navigate to the project root directory:
   ```bash
   cd dynamic-filter-system
   ```
2. Install dependencies with legacy peer dependencies to support React 19 / Material UI integrations:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
