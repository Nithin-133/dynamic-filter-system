import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  TextField,
  Grid,
  Chip
} from '@mui/material';
import { Plus, X, Save, Trash } from 'lucide-react';
import type { FieldSchema, FilterRule, MatchMode, FilterPreset } from '../../../config/types';
import { OperatorRegistry } from '../../../config/operatorRegistry';
import { FilterRuleRow } from './FilterRuleRow';

interface FilterBuilderProps {
  rules: FilterRule[];
  onChangeRules: (rules: FilterRule[]) => void;
  matchMode: MatchMode;
  onChangeMatchMode: (mode: MatchMode) => void;
  schemas: FieldSchema[];
  dataset: any[];
  presets: FilterPreset[];
  onSavePreset: (name: string) => void;
  onLoadPreset: (preset: FilterPreset) => void;
  onDeletePreset: (id: string) => void;
}

export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  rules,
  onChangeRules,
  matchMode,
  onChangeMatchMode,
  schemas,
  dataset,
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset
}) => {
  const [presetName, setPresetName] = useState('');

  const handleAddRule = () => {
    // Choose the first schema as default
    const defaultSchema = schemas[0];
    const typeConfig = OperatorRegistry[defaultSchema.type];
    const defaultOp = Object.keys(typeConfig.operators)[0];
    const defaultVal = typeConfig.defaultValue();

    const newRule: FilterRule = {
      id: crypto.randomUUID(),
      fieldKey: defaultSchema.key,
      type: defaultSchema.type as any,
      operator: defaultOp as any,
      value: defaultVal
    };

    onChangeRules([...rules, newRule]);
  };

  const handleRemoveRule = (id: string) => {
    onChangeRules(rules.filter((r) => r.id !== id));
  };

  const handleUpdateRule = (updatedRule: FilterRule) => {
    onChangeRules(rules.map((r) => (r.id === updatedRule.id ? updatedRule : r)));
  };

  const handleClearAll = () => {
    onChangeRules([]);
  };

  const handleSaveClick = () => {
    if (!presetName.trim()) return;
    onSavePreset(presetName.trim());
    setPresetName('');
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
              Active Filters
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={matchMode === 'OR'}
                    onChange={(e) => onChangeMatchMode(e.target.checked ? 'OR' : 'AND')}
                    color="primary"
                  />
                }
                label={
                  <Box component="span" display="inline-flex" alignItems="center" gap={1} sx={{ typography: 'body2', fontWeight: 600 }}>
                    Match Mode: <Chip label={matchMode} size="small" color={matchMode === 'AND' ? 'primary' : 'secondary'} component="span" />
                  </Box>
                }
              />
            </Box>
          </Box>
        }
      />
      <Divider />
      <CardContent>
        {/* Render List of Rows */}
        {rules.length === 0 ? (
          <Box
            py={4}
            textAlign="center"
            sx={{
              backgroundColor: 'action.hover',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider'
            }}
          >
            <Typography color="text.secondary" variant="body2">
              No filters applied yet. Click "+ Add Filter" to build your query.
            </Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={1.5} mb={2}>
            {rules.map((rule) => (
              <FilterRuleRow
                key={rule.id}
                rule={rule}
                schemas={schemas}
                dataset={dataset}
                onUpdate={handleUpdateRule}
                onRemove={() => handleRemoveRule(rule.id)}
              />
            ))}
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} flexWrap="wrap" gap={2}>
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Plus size={16} />}
              onClick={handleAddRule}
            >
              Add Filter
            </Button>
            {rules.length > 0 && (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<X size={16} />}
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            )}
          </Box>
        </Box>

        {/* Presets and Saving Panel */}
        <Divider sx={{ my: 3 }} />
        <Box>
          <Typography variant="subtitle2" fontWeight={600} mb={2} color="text.secondary">
            Filter Presets
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <Box display="flex" gap={1}>
                <TextField
                  label="Preset Name"
                  size="small"
                  fullWidth
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="e.g. Active Engineers"
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleSaveClick}
                  disabled={!presetName.trim() || rules.length === 0}
                  startIcon={<Save size={16} />}
                >
                  Save
                </Button>
              </Box>
            </Grid>

            {presets.length > 0 && (
              <Grid item xs={12} sm={7}>
                <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Load:
                  </Typography>
                  {presets.map((preset) => (
                    <Chip
                      key={preset.id}
                      label={preset.name}
                      onClick={() => onLoadPreset(preset)}
                      onDelete={() => onDeletePreset(preset.id)}
                      deleteIcon={<Trash size={12} />}
                      variant="outlined"
                      color="primary"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(99, 102, 241, 0.08)'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
