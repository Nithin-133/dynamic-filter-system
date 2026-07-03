export type FieldType = 'text' | 'number' | 'date' | 'amount' | 'select' | 'multi-select' | 'boolean' | 'array';

export interface BaseField {
  key: string;
  label: string;
}

export type TextFieldSchema = BaseField & { type: 'text' };
export type NumberFieldSchema = BaseField & { type: 'number' };
export type DateFieldSchema = BaseField & { type: 'date' };
export type AmountFieldSchema = BaseField & { type: 'amount' };
export type SelectFieldSchema = BaseField & { type: 'select'; options: { label: string; value: any }[] };
export type MultiSelectFieldSchema = BaseField & { type: 'multi-select'; options: { label: string; value: any }[] };
export type BooleanFieldSchema = BaseField & { type: 'boolean' };
export type ArrayFieldSchema = BaseField & { type: 'array' };

export type FieldSchema =
  | TextFieldSchema
  | NumberFieldSchema
  | DateFieldSchema
  | AmountFieldSchema
  | SelectFieldSchema
  | MultiSelectFieldSchema
  | BooleanFieldSchema
  | ArrayFieldSchema;

export type TextOperator = 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'does_not_contain';
export type NumberOperator = 'equals' | 'gt' | 'lt' | 'gte' | 'lte' | 'between';
export type DateOperator = 'before' | 'after' | 'between';
export type AmountOperator = 'equals' | 'gt' | 'lt' | 'between';
export type SelectOperator = 'is' | 'is_not';
export type MultiSelectOperator = 'in' | 'not_in';
export type BooleanOperator = 'is';
export type ArrayOperator = 'contains_any' | 'contains_all' | 'does_not_contain';

export type Operator =
  | TextOperator
  | NumberOperator
  | DateOperator
  | AmountOperator
  | SelectOperator
  | MultiSelectOperator
  | BooleanOperator
  | ArrayOperator;

export interface RangeValue<T> {
  min?: T;
  max?: T;
}

export interface DateRangeValue {
  start?: string;
  end?: string;
}

export type FilterValueMap = {
  text: {
    operator: TextOperator;
    value: string;
  };
  number: {
    operator: NumberOperator;
    value: number | RangeValue<number>;
  };
  date: {
    operator: DateOperator;
    value: string | DateRangeValue;
  };
  amount: {
    operator: AmountOperator;
    value: number | RangeValue<number>;
  };
  select: {
    operator: SelectOperator;
    value: any;
  };
  'multi-select': {
    operator: MultiSelectOperator;
    value: any[];
  };
  boolean: {
    operator: BooleanOperator;
    value: boolean;
  };
  array: {
    operator: ArrayOperator;
    value: any[];
  };
};

export type FilterRule = {
  [K in FieldType]: {
    id: string;
    fieldKey: string;
    type: K;
    operator: FilterValueMap[K]['operator'];
    value: FilterValueMap[K]['value'];
  };
}[FieldType];

export type MatchMode = 'AND' | 'OR';

export interface FilterPreset {
  id: string;
  name: string;
  schemaKey: string;
  rules: FilterRule[];
  matchMode: MatchMode;
}
