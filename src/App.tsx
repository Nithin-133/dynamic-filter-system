import { useState, useMemo, useEffect, useRef } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Sun,
  Moon,
  Download,
  Database,
  Cpu,
  Sparkles,
  Layers,
  FileJson
} from 'lucide-react';

import { lightTheme, darkTheme } from './presentation/theme/theme';
import { mockEmployees, employeeSchema } from './mock/employees';
import { mockTransactions, transactionSchema } from './mock/transactions';
import type { FilterRule, MatchMode, FilterPreset } from './config/types';
import { applyFilters } from './engine/filterEvaluator';
import { getNestedValue, isEmptyValue } from './engine/utils';
import { FilterBuilder } from './presentation/components/FilterBuilder/FilterBuilder';
import { DataTable } from './presentation/components/DataTable/DataTable';

export default function App() {
  // 1. Schema Selection (Employees vs Transactions)
  const [schemaKey, setSchemaKey] = useState<'employees' | 'transactions'>('employees');

  // 2. Theme State (Dark vs Light)
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  // 3. Filter Rules & Match Mode States
  const [rules, setRules] = useState<FilterRule[]>([]);
  const [matchMode, setMatchMode] = useState<MatchMode>('AND');

  // 4. Presets state loaded/saved to localStorage
  const [presets, setPresets] = useState<FilterPreset[]>([]);

  // 5. Diagnostics / Performance Telemetry
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  // Active dataset and schema configurations
  const activeDataset = useMemo(() => {
    return schemaKey === 'employees' ? mockEmployees : mockTransactions;
  }, [schemaKey]);

  const activeSchema = useMemo(() => {
    return schemaKey === 'employees' ? employeeSchema : transactionSchema;
  }, [schemaKey]);

  // Load presets on startup or when schema changes
  useEffect(() => {
    const saved = localStorage.getItem(`presets_${schemaKey}`);
    if (saved) {
      try {
        setPresets(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse saved presets:', err);
      }
    } else {
      setPresets([]);
    }
    // Clear rules on schema switch to prevent type mismatches
    setRules([]);
  }, [schemaKey]);

  // Save presets back to localStorage
  const savePresetsToStorage = (updatedPresets: FilterPreset[]) => {
    setPresets(updatedPresets);
    localStorage.setItem(`presets_${schemaKey}`, JSON.stringify(updatedPresets));
  };

  const handleSavePreset = (name: string) => {
    const newPreset: FilterPreset = {
      id: crypto.randomUUID(),
      name,
      schemaKey,
      rules,
      matchMode
    };
    savePresetsToStorage([...presets, newPreset]);
  };

  const handleLoadPreset = (preset: FilterPreset) => {
    setRules(preset.rules);
    setMatchMode(preset.matchMode);
  };

  const handleDeletePreset = (id: string) => {
    const filtered = presets.filter((p) => p.id !== id);
    savePresetsToStorage(filtered);
  };

  // 6. Execute filtering with Telemetry measurement
  const { filteredData, filterDuration } = useMemo(() => {
    const start = performance.now();
    const result = applyFilters(activeDataset as any[], rules, activeSchema, matchMode);
    const end = performance.now();
    return {
      filteredData: result,
      filterDuration: end - start
    };
  }, [activeDataset, rules, activeSchema, matchMode]);

  // 7. Render Query DSL Codeblock
  const queryDSLString = useMemo(() => {
    const activeRules = rules.filter((r) => !isEmptyValue(r.value));
    if (activeRules.length === 0) {
      return '// No active filters. Retrieving full dataset.';
    }

    const conditions = activeRules.map((rule) => {
      const valStr = typeof rule.value === 'object' ? JSON.stringify(rule.value) : `"${rule.value}"`;
      return `  { field: "${rule.fieldKey}", operator: "${rule.operator}", value: ${valStr} }`;
    });

    return `// Database Query DSL Codeblock\nconst query = {\n  match: "${matchMode}",\n  conditions: [\n${conditions.join(',\n')}\n  ]\n};`;
  }, [rules, matchMode]);

  // 8. CSV Export Helper
  const handleExportCSV = () => {
    const headers = activeSchema.map((s) => s.label).join(',');
    const rows = filteredData.map((item) => {
      return activeSchema
        .map((schema) => {
          const val = getNestedValue(item, schema.key);
          if (val === null || val === undefined) return '""';
          let strVal = '';
          if (Array.isArray(val)) {
            strVal = val.join('; ');
          } else if (typeof val === 'object') {
            strVal = JSON.stringify(val);
          } else {
            strVal = String(val);
          }
          // Escape quotes
          return `"${strVal.replace(/"/g, '""')}"`;
        })
        .join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${schemaKey}_filtered_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 9. JSON Export Helper
  const handleExportJSON = () => {
    const jsonString = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${schemaKey}_filtered_export.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedTheme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={selectedTheme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          pb: 6,
          transition: 'background-color 0.2s ease-in-out'
        }}
      >
        {/* Header Navigation */}
        <Box
          component="header"
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            py: 2,
            mb: 4,
            backgroundColor: 'background.paper',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Container maxWidth="xl">
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Layers size={28} color={selectedTheme.palette.primary.main} />
                <Box>
                  <Typography variant="h5" fontWeight={800} letterSpacing="-0.02em" color="text.primary">
                    Dynamic Filter Component System
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Reusable Configuration-Driven Architecture
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                {/* Schema Selection Selector */}
                <ToggleButtonGroup
                  value={schemaKey}
                  exclusive
                  onChange={(_, value) => value && setSchemaKey(value)}
                  size="small"
                  aria-label="schema selector"
                >
                  <ToggleButton value="employees" aria-label="employees dataset">
                    <Database size={14} style={{ marginRight: 6 }} />
                    Employees
                  </ToggleButton>
                  <ToggleButton value="transactions" aria-label="transactions dataset">
                    <Database size={14} style={{ marginRight: 6 }} />
                    Ledger Spend
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* Dark/Light Mode toggle */}
                <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                  <IconButton
                    onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                    color="inherit"
                    size="small"
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                  >
                    {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl">
          <Box display="flex" flexDirection="column" gap={3}>
            {/* 1. Filter Panel Builder (Full Width) */}
            <FilterBuilder
              rules={rules}
              onChangeRules={setRules}
              matchMode={matchMode}
              onChangeMatchMode={setMatchMode}
              schemas={activeSchema}
              dataset={activeDataset}
              presets={presets}
              onSavePreset={handleSavePreset}
              onLoadPreset={handleLoadPreset}
              onDeletePreset={handleDeletePreset}
            />

            {/* 2. Performance & Counts Telemetry Cards */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ py: 2, px: 3, '&:last-child': { pb: 2 } }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                      Active Matches
                    </Typography>
                    <Typography variant="h3" fontWeight={800} color="primary.main" my={0.5}>
                      {filteredData.length}
                      <Typography component="span" variant="subtitle2" color="text.secondary" sx={{ ml: 1 }}>
                        / {activeDataset.length} rows
                      </Typography>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {((filteredData.length / activeDataset.length) * 100).toFixed(0)}% of total records matched
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ py: 2, px: 3, '&:last-child': { pb: 2 } }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                      Engine Latency
                    </Typography>
                    <Typography variant="h3" fontWeight={800} color="secondary.main" my={0.5}>
                      {filterDuration.toFixed(3)} ms
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                      <Cpu size={12} />
                      Pure client-side execution
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ py: 2, px: 3, '&:last-child': { pb: 2 } }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                      React Renders
                    </Typography>
                    <Typography variant="h3" fontWeight={800} color="text.primary" my={0.5}>
                      {renderCountRef.current}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Optimized with debounced input bounds
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* 3. Bottom Row: Query Inspector & Results Table split */}
            <Grid container spacing={3}>
              {/* Left Side: Query Inspector */}
              <Grid item xs={12} md={4} lg={3}>
                <Card sx={{ height: '100%', minHeight: 200 }}>
                  <CardHeader
                    title={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Sparkles size={16} />
                        <Typography variant="subtitle2" fontWeight={700}>
                          Query Inspector (JSON DSL)
                        </Typography>
                      </Box>
                    }
                  />
                  <Divider />
                  <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, height: 'calc(100% - 50px)' }}>
                    <Box
                      component="pre"
                      sx={{
                        m: 0,
                        p: 2,
                        backgroundColor: mode === 'dark' ? '#0F172A' : '#F1F5F9',
                        overflowX: 'auto',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        color: mode === 'dark' ? '#38BDF8' : '#0369A1',
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12
                      }}
                    >
                      {queryDSLString}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Side: Explorer Grid & Table */}
              <Grid item xs={12} md={8} lg={9}>
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1.5}>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      Dataset Explorer ({schemaKey === 'employees' ? 'Employees' : 'Transactions'})
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        color="inherit"
                        startIcon={<Download size={14} />}
                        onClick={handleExportCSV}
                        disabled={filteredData.length === 0}
                      >
                        Export CSV
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="inherit"
                        startIcon={<FileJson size={14} />}
                        onClick={handleExportJSON}
                        disabled={filteredData.length === 0}
                      >
                        Export JSON
                      </Button>
                    </Box>
                  </Box>

                  {/* Render Table */}
                  <DataTable data={filteredData} schemas={activeSchema} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
