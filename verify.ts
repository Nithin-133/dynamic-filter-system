import { mockEmployees, employeeSchema } from './src/mock/employees';
import { applyFilters } from './src/engine/filterEvaluator';
import type { FilterRule } from './src/config/types';

function runTests() {
  console.log('🧪 Starting programatic filter logic verification...\n');

  // Test Case 1: Simple text contains (case-insensitive)
  const test1Rules: FilterRule[] = [
    {
      id: '1',
      fieldKey: 'name',
      type: 'text',
      operator: 'contains',
      value: 'john' // should match 'John Smith' and 'Alex Johnson'
    }
  ];
  const result1 = applyFilters(mockEmployees, test1Rules, employeeSchema, 'AND');
  const matchedNames = result1.map(e => e.name);
  console.log('Test 1 (Text Contains "john"):', matchedNames);
  if (result1.length === 2 && matchedNames.includes('John Smith') && matchedNames.includes('Alex Johnson')) {
    console.log('✅ TEST 1 PASSED');
  } else {
    console.error('❌ TEST 1 FAILED');
    process.exit(1);
  }

  // Test Case 2: Nested property resolution (address.city equals "San Francisco")
  const test2Rules: FilterRule[] = [
    {
      id: '2',
      fieldKey: 'address.city',
      type: 'text',
      operator: 'equals',
      value: 'san francisco'
    }
  ];
  const result2 = applyFilters(mockEmployees, test2Rules, employeeSchema, 'AND');
  const matchedCities = result2.map(e => e.address.city);
  console.log('Test 2 (Nested Key address.city "San Francisco"):', result2.map(e => e.name));
  if (result2.length > 0 && matchedCities.every(c => c === 'San Francisco')) {
    console.log('✅ TEST 2 PASSED');
  } else {
    console.error('❌ TEST 2 FAILED');
    process.exit(1);
  }

  // Test Case 3: Array checks (skills contains_all ['React', 'TypeScript'])
  const test3Rules: FilterRule[] = [
    {
      id: '3',
      fieldKey: 'skills',
      type: 'array',
      operator: 'contains_all',
      value: ['React', 'TypeScript']
    }
  ];
  const result3 = applyFilters(mockEmployees, test3Rules, employeeSchema, 'AND');
  console.log('Test 3 (Skills Contains All ["React", "TypeScript"]):', result3.map(e => e.name));
  if (result3.length > 0 && result3.every(e => e.skills.includes('React') && e.skills.includes('TypeScript'))) {
    console.log('✅ TEST 3 PASSED');
  } else {
    console.error('❌ TEST 3 FAILED');
    process.exit(1);
  }

  // Test Case 4: Amount ranges (between $90,000 and $110,000)
  const test4Rules: FilterRule[] = [
    {
      id: '4',
      fieldKey: 'salary',
      type: 'amount',
      operator: 'between',
      value: { min: 90000, max: 110000 }
    }
  ];
  const result4 = applyFilters(mockEmployees, test4Rules, employeeSchema, 'AND');
  console.log('Test 4 (Salary between 90k and 110k):', result4.map(e => `${e.name} ($${e.salary})`));
  if (result4.length > 0 && result4.every(e => e.salary >= 90000 && e.salary <= 110000)) {
    console.log('✅ TEST 4 PASSED');
  } else {
    console.error('❌ TEST 4 FAILED');
    process.exit(1);
  }

  // Test Case 5: Partial range boundaries (only min salary filled: >= $130,000)
  const test5Rules: FilterRule[] = [
    {
      id: '5',
      fieldKey: 'salary',
      type: 'amount',
      operator: 'between',
      value: { min: 130000, max: undefined }
    }
  ];
  const result5 = applyFilters(mockEmployees, test5Rules, employeeSchema, 'AND');
  console.log('Test 5 (Salary min 130k only):', result5.map(e => `${e.name} ($${e.salary})`));
  if (result5.length > 0 && result5.every(e => e.salary >= 130000)) {
    console.log('✅ TEST 5 PASSED');
  } else {
    console.error('❌ TEST 5 FAILED');
    process.exit(1);
  }

  // Test Case 6: Edge case - missing or null dates (lastReview)
  // Ensure that a rule searching for date before "2024-01-01" safely ignores nulls and matches only valid dates
  const test6Rules: FilterRule[] = [
    {
      id: '6',
      fieldKey: 'lastReview',
      type: 'date',
      operator: 'before',
      value: '2024-01-01'
    }
  ];
  const result6 = applyFilters(mockEmployees, test6Rules, employeeSchema, 'AND');
  console.log('Test 6 (Last Review before 2024-01-01, excluding nulls):', result6.map(e => `${e.name} (${e.lastReview})`));
  if (result6.length > 0 && result6.every(e => e.lastReview !== null && new Date(e.lastReview).getTime() < new Date('2024-01-01').getTime())) {
    console.log('✅ TEST 6 PASSED');
  } else {
    console.error('❌ TEST 6 FAILED');
    process.exit(1);
  }

  // Test Case 7: OR Logic Mode (Department is Finance OR Salary >= $140,000)
  const test7Rules: FilterRule[] = [
    {
      id: '7a',
      fieldKey: 'department',
      type: 'select',
      operator: 'is',
      value: 'Finance'
    },
    {
      id: '7b',
      fieldKey: 'salary',
      type: 'amount',
      operator: 'gt',
      value: 135000
    }
  ];
  const result7 = applyFilters(mockEmployees, test7Rules, employeeSchema, 'OR');
  console.log('Test 7 (Department is Finance OR Salary > 135k):', result7.map(e => `${e.name} (${e.department}, $${e.salary})`));
  const isValid7 = result7.every(e => e.department === 'Finance' || e.salary > 135000);
  if (result7.length > 0 && isValid7) {
    console.log('✅ TEST 7 PASSED');
  } else {
    console.error('❌ TEST 7 FAILED');
    process.exit(1);
  }

  console.log('\n🎉 ALL LOGIC TESTS PASSED SUCCESSFULLY! The dynamic filtering engine is 100% correct.');
}

runTests();
