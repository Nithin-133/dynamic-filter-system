import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Box,
  Typography,
  Chip
} from '@mui/material';
import type { FieldSchema } from '../../../config/types';
import { getNestedValue } from '../../../engine/utils';

interface DataTableProps {
  data: any[];
  schemas: FieldSchema[];
}

export const DataTable: React.FC<DataTableProps> = ({ data, schemas }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // Handle request for sorting
  const handleSortRequest = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Perform sorting on data
  const sortedData = useMemo(() => {
    if (!orderBy) return data;

    return [...data].sort((a, b) => {
      const aVal = getNestedValue(a, orderBy);
      const bVal = getNestedValue(b, orderBy);

      // Handle null/undefined values
      if (aVal === null || aVal === undefined) return order === 'asc' ? -1 : 1;
      if (bVal === null || bVal === undefined) return order === 'asc' ? 1 : -1;

      // Handle arrays
      if (Array.isArray(aVal) && Array.isArray(bVal)) {
        return order === 'asc'
          ? aVal.length - bVal.length
          : bVal.length - aVal.length;
      }

      // Handle strings
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      // Handle booleans/numbers
      return order === 'asc'
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    });
  }, [data, orderBy, order]);

  // Handle page changes
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginated chunk of data
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  // Helper to render customized cells based on type
  const renderCellContent = (row: any, schema: FieldSchema) => {
    const rawValue = getNestedValue(row, schema.key);

    if (rawValue === null || rawValue === undefined) {
      return <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>—</Typography>;
    }

    switch (schema.type) {
      case 'amount':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2
        }).format(Number(rawValue));

      case 'boolean':
        return (
          <Chip
            label={rawValue ? 'Yes' : 'No'}
            size="small"
            color={rawValue ? 'success' : 'error'}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        );

      case 'array':
        return (
          <Box display="flex" gap={0.5} flexWrap="wrap" maxWidth={300}>
            {(rawValue as any[]).map((val, idx) => (
              <Chip key={idx} label={String(val)} size="small" variant="filled" />
            ))}
          </Box>
        );

      case 'date':
        return rawValue; // Format standard date string directly

      default:
        return String(rawValue);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="filtered data table" size="medium">
          <TableHead>
            <TableRow>
              {schemas.map((schema) => (
                <TableCell
                  key={schema.key}
                  align="left"
                  sortDirection={orderBy === schema.key ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === schema.key}
                    direction={orderBy === schema.key ? order : 'asc'}
                    onClick={() => handleSortRequest(schema.key)}
                  >
                    {schema.label}
                    {orderBy === schema.key ? (
                      <Box component="span" sx={{ display: 'none' }}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={schemas.length} align="center" sx={{ py: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Results Found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try loosening or removing some of your active filter rules to show records.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={row.id || index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {schemas.map((schema) => (
                    <TableCell key={schema.key} align="left">
                      {renderCellContent(row, schema)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
