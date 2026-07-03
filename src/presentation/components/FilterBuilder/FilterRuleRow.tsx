import React from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Box
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import type { FieldSchema, FilterRule } from '../../../config/types';
import { OperatorRegistry } from '../../../config/operatorRegistry';
import { FilterValueInput } from './FilterValueInput';

interface FilterRuleRowProps {
  rule: FilterRule;
  schemas: FieldSchema[];
  dataset: any[];
  onUpdate: (updatedRule: FilterRule) => void;
  onRemove: () => void;
}

export const FilterRuleRow: React.FC<FilterRuleRowProps> = ({
  rule,
  schemas,
  dataset,
  onUpdate,
  onRemove
}) => {
  // Find current schema
  const currentSchema = schemas.find((s) => s.key === rule.fieldKey) || schemas[0];

  // Lookup operators for this field type
  const typeConfig = OperatorRegistry[currentSchema.type];
  const operators = typeConfig ? Object.entries(typeConfig.operators) : [];

  const handleFieldChange = (newFieldKey: string) => {
    const nextSchema = schemas.find((s) => s.key === newFieldKey);
    if (!nextSchema) return;

    const nextTypeConfig = OperatorRegistry[nextSchema.type];
    const defaultOp = Object.keys(nextTypeConfig.operators)[0];
    const defaultVal = nextTypeConfig.defaultValue();

    onUpdate({
      id: rule.id,
      fieldKey: newFieldKey,
      type: nextSchema.type as any,
      operator: defaultOp as any,
      value: defaultVal
    });
  };

  const handleOperatorChange = (newOperator: string) => {
    // Keep value if possible, or reset to default if switching to/from a range
    const oldConfig = OperatorRegistry[rule.type];
    const defaultValue = oldConfig.defaultValue();
    const isNewBetween = newOperator === 'between';
    const isOldBetween = rule.operator === 'between';

    let newValue = rule.value;
    if (isNewBetween !== isOldBetween) {
      newValue = defaultValue;
    }

    onUpdate({
      ...rule,
      operator: newOperator as any,
      value: newValue
    });
  };

  const handleValueChange = (newValue: any) => {
    onUpdate({
      ...rule,
      value: newValue
    });
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      py={1}
      sx={{
        width: '100%',
        animation: 'fadeIn 0.2s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(-4px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* 1. Field Selection */}
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id={`field-label-${rule.id}`}>Field</InputLabel>
            <Select
              labelId={`field-label-${rule.id}`}
              value={rule.fieldKey}
              label="Field"
              onChange={(e) => handleFieldChange(e.target.value)}
            >
              {schemas.map((schema) => (
                <MenuItem key={schema.key} value={schema.key}>
                  {schema.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* 2. Operator Selection */}
        <Grid item xs={12} sm={3} md={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel id={`operator-label-${rule.id}`}>Operator</InputLabel>
            <Select
              labelId={`operator-label-${rule.id}`}
              value={rule.operator}
              label="Operator"
              onChange={(e) => handleOperatorChange(e.target.value)}
            >
              {operators.map(([opKey, opConfig]) => (
                <MenuItem key={opKey} value={opKey}>
                  {opConfig.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* 3. Value Input */}
        <Grid item xs={10} sm={4} md={5.5}>
          <FilterValueInput
            schema={currentSchema}
            operator={rule.operator}
            value={rule.value}
            onChange={handleValueChange}
            dataset={dataset}
          />
        </Grid>

        {/* 4. Delete Action */}
        <Grid item xs={2} sm={1} md={1} style={{ textAlign: 'right' }}>
          <Tooltip title="Remove filter row">
            <IconButton
              aria-label="Remove filter"
              color="error"
              onClick={onRemove}
              size="small"
              sx={{
                '&:hover': {
                  backgroundColor: 'error.lighter',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.15s ease-in-out'
              }}
            >
              <Trash2 size={18} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};
