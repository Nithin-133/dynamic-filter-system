import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Switch,
  FormControlLabel,
  Box,
  InputAdornment
} from '@mui/material';
import type { FieldSchema, Operator } from '../../../config/types';

// Reusable local component for a debounced input field to prevent excessive re-renders during typing
const DebouncedTextField = ({
  value,
  onChange,
  label,
  type = 'text',
  placeholder = '',
  InputProps = {},
  fullWidth = true,
  size = 'small' as const,
  ...rest
}: any) => {
  const [localValue, setLocalValue] = useState(value ?? '');
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    setLocalValue(value ?? '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(type === 'number' ? (val === '' ? undefined : Number(val)) : val);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <TextField
      {...rest}
      label={label}
      type={type}
      size={size}
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      InputProps={InputProps}
      fullWidth={fullWidth}
    />
  );
};

interface FilterValueInputProps {
  schema: FieldSchema;
  operator: Operator;
  value: any;
  onChange: (value: any) => void;
  dataset: any[]; // Used to harvest dynamic values for arrays/multi-select
}

export const FilterValueInput: React.FC<FilterValueInputProps> = ({
  schema,
  operator,
  value,
  onChange,
  dataset
}) => {
  const isRangeOperator = operator === 'between';

  // Extract dynamic list options for autocomplete/multi-select based on dataset
  const getDynamicOptions = (): string[] => {
    if (!dataset || dataset.length === 0) return [];
    
    // Helper to resolve nested values
    const resolveValue = (obj: any, path: string): any => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const uniqueValues = new Set<string>();

    dataset.forEach((item) => {
      const val = resolveValue(item, schema.key);
      if (Array.isArray(val)) {
        val.forEach((v) => {
          if (v !== null && v !== undefined) uniqueValues.add(String(v));
        });
      } else if (val !== null && val !== undefined && val !== '') {
        uniqueValues.add(String(val));
      }
    });

    return Array.from(uniqueValues).sort();
  };

  switch (schema.type) {
    case 'text':
      return (
        <DebouncedTextField
          label="Value"
          value={value || ''}
          onChange={onChange}
          placeholder="Enter text search..."
        />
      );

    case 'number':
      if (isRangeOperator) {
        const val = (value as { min?: number; max?: number }) || {};
        return (
          <Box display="flex" gap={1}>
            <DebouncedTextField
              label="Min"
              type="number"
              value={val.min ?? ''}
              onChange={(v: number) => onChange({ ...val, min: v })}
            />
            <DebouncedTextField
              label="Max"
              type="number"
              value={val.max ?? ''}
              onChange={(v: number) => onChange({ ...val, max: v })}
            />
          </Box>
        );
      }
      return (
        <DebouncedTextField
          label="Value"
          type="number"
          value={value ?? ''}
          onChange={onChange}
        />
      );

    case 'amount':
      if (isRangeOperator) {
        const val = (value as { min?: number; max?: number }) || {};
        return (
          <Box display="flex" gap={1}>
            <DebouncedTextField
              label="Min Amount"
              type="number"
              value={val.min ?? ''}
              onChange={(v: number) => onChange({ ...val, min: v })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
            />
            <DebouncedTextField
              label="Max Amount"
              type="number"
              value={val.max ?? ''}
              onChange={(v: number) => onChange({ ...val, max: v })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
            />
          </Box>
        );
      }
      return (
        <DebouncedTextField
          label="Amount"
          type="number"
          value={value ?? ''}
          onChange={onChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>
          }}
        />
      );

    case 'date':
      if (isRangeOperator) {
        const val = (value as { start?: string; end?: string }) || {};
        return (
          <Box display="flex" gap={1} width="100%">
            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={val.start || ''}
              onChange={(e) => onChange({ ...val, start: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              value={val.end || ''}
              onChange={(e) => onChange({ ...val, end: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        );
      }
      return (
        <TextField
          label="Date"
          type="date"
          size="small"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      );

    case 'select':
      return (
        <FormControl fullWidth size="small">
          <InputLabel id={`select-label-${schema.key}`}>Select Option</InputLabel>
          <Select
            labelId={`select-label-${schema.key}`}
            value={value || ''}
            label="Select Option"
            onChange={(e) => onChange(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {schema.options?.map((opt) => (
              <MenuItem key={String(opt.value)} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );

    case 'multi-select':
    case 'array': {
      const selected = Array.isArray(value) ? value : [];
      const options = schema.type === 'multi-select' 
        ? (schema.options?.map((o) => String(o.value)) || [])
        : getDynamicOptions();

      return (
        <FormControl fullWidth size="small">
          <InputLabel id={`multi-label-${schema.key}`}>Select values</InputLabel>
          <Select
            labelId={`multi-label-${schema.key}`}
            multiple
            value={selected}
            onChange={(e) => {
              const val = e.target.value;
              onChange(typeof val === 'string' ? val.split(',') : val);
            }}
            input={<OutlinedInput label="Select values" />}
            renderValue={(selectedArr) => selectedArr.join(', ')}
          >
            {options.map((opt) => (
              <MenuItem key={opt} value={opt}>
                <Checkbox checked={selected.indexOf(opt) > -1} />
                <ListItemText primary={opt} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    case 'boolean':
      return (
        <FormControlLabel
          control={
            <Switch
              checked={value === true}
              onChange={(e) => onChange(e.target.checked)}
            />
          }
          label={value === true ? 'True' : 'False'}
          sx={{ ml: 1 }}
        />
      );

    default:
      return null;
  }
};
