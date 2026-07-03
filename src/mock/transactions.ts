import type { FieldSchema } from '../config/types';

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  paymentMethod: string;
  date: string;
  isRefunded: boolean;
  tags: string[];
  metadata: {
    deviceId: string;
    ipAddress: string;
  };
}

export const transactionSchema: FieldSchema[] = [
  { key: 'id', label: 'Transaction ID', type: 'text' },
  { key: 'merchant', label: 'Merchant', type: 'text' },
  { key: 'amount', label: 'Amount ($)', type: 'amount' },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { label: 'Travel', value: 'Travel' },
      { label: 'Food & Dining', value: 'Food & Dining' },
      { label: 'Software & SaaS', value: 'Software & SaaS' },
      { label: 'Office Supplies', value: 'Office Supplies' },
      { label: 'Entertainment', value: 'Entertainment' },
      { label: 'Marketing Spend', value: 'Marketing Spend' }
    ]
  },
  {
    key: 'paymentMethod',
    label: 'Payment Method',
    type: 'select',
    options: [
      { label: 'Credit Card', value: 'Credit Card' },
      { label: 'Bank Transfer', value: 'Bank Transfer' },
      { label: 'UPI / Wallet', value: 'UPI / Wallet' },
      { label: 'PayPal', value: 'PayPal' }
    ]
  },
  { key: 'date', label: 'Transaction Date', type: 'date' },
  { key: 'isRefunded', label: 'Refunded Status', type: 'boolean' },
  { key: 'tags', label: 'Tags', type: 'array' },
  { key: 'metadata.deviceId', label: 'Device ID', type: 'text' },
  { key: 'metadata.ipAddress', label: 'IP Address', type: 'text' }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'TXN-1001',
    merchant: 'AWS Cloud Services',
    amount: 1450.75,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-03-01',
    isRefunded: false,
    tags: ['infrastructure', 'cloud', 'recurring'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1002',
    merchant: 'Uber Technologies',
    amount: 32.40,
    category: 'Travel',
    paymentMethod: 'UPI / Wallet',
    date: '2024-03-02',
    isRefunded: false,
    tags: ['commute', 'business-trip'],
    metadata: { deviceId: 'DEV-3200', ipAddress: '10.0.0.12' }
  },
  {
    id: 'TXN-1003',
    merchant: 'GitHub Enterprise',
    amount: 250.00,
    category: 'Software & SaaS',
    paymentMethod: 'PayPal',
    date: '2024-02-28',
    isRefunded: false,
    tags: ['dev-tools', 'subscription'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1004',
    merchant: 'Staples Business Depot',
    amount: 189.50,
    category: 'Office Supplies',
    paymentMethod: 'Credit Card',
    date: '2024-02-15',
    isRefunded: true,
    tags: ['supplies', 'returned'],
    metadata: { deviceId: 'DEV-9912', ipAddress: '172.16.2.8' }
  },
  {
    id: 'TXN-1005',
    merchant: 'Slack Technologies',
    amount: 720.00,
    category: 'Software & SaaS',
    paymentMethod: 'Bank Transfer',
    date: '2024-03-04',
    isRefunded: false,
    tags: ['collaboration', 'yearly'],
    metadata: { deviceId: 'DEV-1044', ipAddress: '192.168.2.11' }
  },
  {
    id: 'TXN-1006',
    merchant: 'Starbucks Coffee',
    amount: 15.65,
    category: 'Food & Dining',
    paymentMethod: 'UPI / Wallet',
    date: '2024-03-05',
    isRefunded: false,
    tags: ['meals', 'client-meeting'],
    metadata: { deviceId: 'DEV-3200', ipAddress: '10.0.0.12' }
  },
  {
    id: 'TXN-1007',
    merchant: 'Google Workspace',
    amount: 120.00,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-02-20',
    isRefunded: false,
    tags: ['email', 'office-suite'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1008',
    merchant: 'Delta Air Lines',
    amount: 650.00,
    category: 'Travel',
    paymentMethod: 'Credit Card',
    date: '2024-01-15',
    isRefunded: false,
    tags: ['flight', 'conference'],
    metadata: { deviceId: 'DEV-4422', ipAddress: '192.168.1.99' }
  },
  {
    id: 'TXN-1009',
    merchant: 'Facebook Ads',
    amount: 1800.00,
    category: 'Marketing Spend',
    paymentMethod: 'Bank Transfer',
    date: '2024-03-01',
    isRefunded: false,
    tags: ['ad-campaign', 'marketing'],
    metadata: { deviceId: 'DEV-5511', ipAddress: '192.168.5.10' }
  },
  {
    id: 'TXN-1010',
    merchant: 'Mailchimp',
    amount: 150.00,
    category: 'Marketing Spend',
    paymentMethod: 'Credit Card',
    date: '2024-02-28',
    isRefunded: false,
    tags: ['email-marketing', 'newsletter'],
    metadata: { deviceId: 'DEV-5511', ipAddress: '192.168.5.10' }
  },
  {
    id: 'TXN-1011',
    merchant: 'Zoom Video Comm',
    amount: 45.00,
    category: 'Software & SaaS',
    paymentMethod: 'PayPal',
    date: '2024-03-03',
    isRefunded: false,
    tags: ['video-conferencing', 'monthly'],
    metadata: { deviceId: 'DEV-1044', ipAddress: '192.168.2.11' }
  },
  {
    id: 'TXN-1012',
    merchant: 'Figma Inc',
    amount: 360.00,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-02-01',
    isRefunded: false,
    tags: ['design-tools', 'yearly'],
    metadata: { deviceId: 'DEV-0091', ipAddress: '192.168.3.15' }
  },
  {
    id: 'TXN-1013',
    merchant: 'Whole Foods Market',
    amount: 125.40,
    category: 'Food & Dining',
    paymentMethod: 'Credit Card',
    date: '2024-03-02',
    isRefunded: false,
    tags: ['office-catering', 'pantry'],
    metadata: { deviceId: 'DEV-9912', ipAddress: '172.16.2.8' }
  },
  {
    id: 'TXN-1014',
    merchant: 'Hilton Hotels',
    amount: 420.00,
    category: 'Travel',
    paymentMethod: 'Credit Card',
    date: '2024-01-18',
    isRefunded: false,
    tags: ['lodging', 'conference'],
    metadata: { deviceId: 'DEV-4422', ipAddress: '192.168.1.99' }
  },
  {
    id: 'TXN-1015',
    merchant: 'Screencast-O-Matic',
    amount: 29.00,
    category: 'Software & SaaS',
    paymentMethod: 'PayPal',
    date: '2024-02-10',
    isRefunded: false,
    tags: ['recording', 'utility'],
    metadata: { deviceId: 'DEV-1044', ipAddress: '192.168.2.11' }
  },
  {
    id: 'TXN-1016',
    merchant: 'Adobe Creative Cloud',
    amount: 85.00,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-02-25',
    isRefunded: false,
    tags: ['design-tools', 'monthly'],
    metadata: { deviceId: 'DEV-0091', ipAddress: '192.168.3.15' }
  },
  {
    id: 'TXN-1017',
    merchant: 'JetBrains IntelliJ',
    amount: 499.00,
    category: 'Software & SaaS',
    paymentMethod: 'Bank Transfer',
    date: '2024-01-20',
    isRefunded: false,
    tags: ['dev-tools', 'ide'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1018',
    merchant: 'Catered Lunch Services',
    amount: 350.00,
    category: 'Food & Dining',
    paymentMethod: 'Bank Transfer',
    date: '2024-02-20',
    isRefunded: false,
    tags: ['meals', 'office-event'],
    metadata: { deviceId: 'DEV-9912', ipAddress: '172.16.2.8' }
  },
  {
    id: 'TXN-1019',
    merchant: 'Postman API Client',
    amount: 144.00,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-02-05',
    isRefunded: false,
    tags: ['dev-tools', 'api'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1020',
    merchant: 'Apple Store',
    amount: 2499.00,
    category: 'Office Supplies',
    paymentMethod: 'Credit Card',
    date: '2024-01-10',
    isRefunded: false,
    tags: ['hardware', 'laptop'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1021',
    merchant: 'Netlify Cloud Hosting',
    amount: 45.00,
    category: 'Software & SaaS',
    paymentMethod: 'PayPal',
    date: '2024-03-01',
    isRefunded: false,
    tags: ['infrastructure', 'hosting'],
    metadata: { deviceId: 'DEV-1044', ipAddress: '192.168.2.11' }
  },
  {
    id: 'TXN-1022',
    merchant: 'DigitalOcean Services',
    amount: 85.20,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-03-03',
    isRefunded: false,
    tags: ['infrastructure', 'cloud-vps'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1023',
    merchant: 'Asana Inc',
    amount: 480.00,
    category: 'Software & SaaS',
    paymentMethod: 'Bank Transfer',
    date: '2024-02-15',
    isRefunded: false,
    tags: ['project-management', 'yearly'],
    metadata: { deviceId: 'DEV-1044', ipAddress: '192.168.2.11' }
  },
  {
    id: 'TXN-1024',
    merchant: 'Salesforce CRM',
    amount: 1500.00,
    category: 'Software & SaaS',
    paymentMethod: 'Bank Transfer',
    date: '2024-01-05',
    isRefunded: false,
    tags: ['crm', 'sales-tools'],
    metadata: { deviceId: 'DEV-5511', ipAddress: '192.168.5.10' }
  },
  {
    id: 'TXN-1025',
    merchant: 'Gusto Payroll',
    amount: 220.00,
    category: 'Software & SaaS',
    paymentMethod: 'Bank Transfer',
    date: '2024-02-28',
    isRefunded: false,
    tags: ['hr-software', 'finance-tools'],
    metadata: { deviceId: 'DEV-9912', ipAddress: '172.16.2.8' }
  },
  {
    id: 'TXN-1026',
    merchant: 'New Relic APM',
    amount: 320.00,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-02-27',
    isRefunded: false,
    tags: ['monitoring', 'observability'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1027',
    merchant: 'Datadog Inc',
    amount: 600.00,
    category: 'Software & SaaS',
    paymentMethod: 'Bank Transfer',
    date: '2024-03-01',
    isRefunded: false,
    tags: ['monitoring', 'cloud-metrics'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1028',
    merchant: 'LinkedIn Ads',
    amount: 950.00,
    category: 'Marketing Spend',
    paymentMethod: 'Credit Card',
    date: '2024-02-20',
    isRefunded: false,
    tags: ['recruitment-ads', 'marketing'],
    metadata: { deviceId: 'DEV-5511', ipAddress: '192.168.5.10' }
  },
  {
    id: 'TXN-1029',
    merchant: 'Canva Pro Design',
    amount: 30.00,
    category: 'Software & SaaS',
    paymentMethod: 'UPI / Wallet',
    date: '2024-03-04',
    isRefunded: false,
    tags: ['design-tools', 'marketing-templates'],
    metadata: { deviceId: 'DEV-5511', ipAddress: '192.168.5.10' }
  },
  {
    id: 'TXN-1030',
    merchant: 'Sentry Error Tracking',
    amount: 80.00,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-02-25',
    isRefunded: false,
    tags: ['monitoring', 'errors'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1031',
    merchant: 'Heroku Hosting',
    amount: 150.00,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-03-01',
    isRefunded: false,
    tags: ['hosting', 'paas'],
    metadata: { deviceId: 'DEV-1044', ipAddress: '192.168.2.11' }
  },
  {
    id: 'TXN-1032',
    merchant: 'Vercel Pro',
    amount: 40.00,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-03-02',
    isRefunded: false,
    tags: ['hosting', 'frontend'],
    metadata: { deviceId: 'DEV-1044', ipAddress: '192.168.2.11' }
  },
  {
    id: 'TXN-1033',
    merchant: 'Auth0 Identity',
    amount: 180.00,
    category: 'Software & SaaS',
    paymentMethod: 'Bank Transfer',
    date: '2024-02-15',
    isRefunded: false,
    tags: ['identity', 'security'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1034',
    merchant: 'SendGrid Emails',
    amount: 89.95,
    category: 'Software & SaaS',
    paymentMethod: 'PayPal',
    date: '2024-02-28',
    isRefunded: false,
    tags: ['email-api', 'transactional'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1035',
    merchant: 'Twilio SMS API',
    amount: 215.30,
    category: 'Software & SaaS',
    paymentMethod: 'Bank Transfer',
    date: '2024-03-01',
    isRefunded: false,
    tags: ['sms-api', 'notifications'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1036',
    merchant: 'Atlassian Jira',
    amount: 320.00,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-02-10',
    isRefunded: false,
    tags: ['project-management', 'collaboration'],
    metadata: { deviceId: 'DEV-1044', ipAddress: '192.168.2.11' }
  },
  {
    id: 'TXN-1037',
    merchant: 'Slack App Store',
    amount: 45.00,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-02-12',
    isRefunded: false,
    tags: ['collaboration', 'plugins'],
    metadata: { deviceId: 'DEV-1044', ipAddress: '192.168.2.11' }
  },
  {
    id: 'TXN-1038',
    merchant: 'Intercom Messaging',
    amount: 490.00,
    category: 'Software & SaaS',
    paymentMethod: 'Bank Transfer',
    date: '2024-02-28',
    isRefunded: false,
    tags: ['customer-support', 'chat'],
    metadata: { deviceId: 'DEV-1044', ipAddress: '192.168.2.11' }
  },
  {
    id: 'TXN-1039',
    merchant: 'Microsoft Office 365',
    amount: 240.00,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-01-15',
    isRefunded: false,
    tags: ['office-suite', 'productivity'],
    metadata: { deviceId: 'DEV-9912', ipAddress: '172.16.2.8' }
  },
  {
    id: 'TXN-1040',
    merchant: 'DocuSign Inc',
    amount: 180.00,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-02-05',
    isRefunded: false,
    tags: ['legal', 'e-signature'],
    metadata: { deviceId: 'DEV-9912', ipAddress: '172.16.2.8' }
  },
  {
    id: 'TXN-1041',
    merchant: 'Apple Developer Program',
    amount: 99.00,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-01-02',
    isRefunded: false,
    tags: ['membership', 'ios-app'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1042',
    merchant: '1Password Teams',
    amount: 72.00,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-02-28',
    isRefunded: false,
    tags: ['security', 'passwords'],
    metadata: { deviceId: 'DEV-9912', ipAddress: '172.16.2.8' }
  },
  {
    id: 'TXN-1043',
    merchant: 'HubSpot Marketing',
    amount: 800.00,
    category: 'Software & SaaS',
    paymentMethod: 'Bank Transfer',
    date: '2024-02-15',
    isRefunded: false,
    tags: ['crm', 'marketing-automation'],
    metadata: { deviceId: 'DEV-5511', ipAddress: '192.168.5.10' }
  },
  {
    id: 'TXN-1044',
    merchant: 'Amazon Web Services',
    amount: 1350.20,
    category: 'Software & SaaS',
    paymentMethod: 'Credit Card',
    date: '2024-02-01',
    isRefunded: false,
    tags: ['infrastructure', 'cloud'],
    metadata: { deviceId: 'DEV-8821', ipAddress: '192.168.1.50' }
  },
  {
    id: 'TXN-1045',
    merchant: 'Fly Emirates',
    amount: 1120.00,
    category: 'Travel',
    paymentMethod: 'Credit Card',
    date: '2024-02-18',
    isRefunded: false,
    tags: ['flight', 'executive-travel'],
    metadata: { deviceId: 'DEV-4422', ipAddress: '192.168.1.99' }
  },
  {
    id: 'TXN-1046',
    merchant: 'Grand Hyatt Seattle',
    amount: 580.00,
    category: 'Travel',
    paymentMethod: 'Credit Card',
    date: '2024-02-21',
    isRefunded: false,
    tags: ['lodging', 'business-trip'],
    metadata: { deviceId: 'DEV-4422', ipAddress: '192.168.1.99' }
  },
  {
    id: 'TXN-1047',
    merchant: 'Subway Restaurants',
    amount: 22.50,
    category: 'Food & Dining',
    paymentMethod: 'UPI / Wallet',
    date: '2024-03-01',
    isRefunded: false,
    tags: ['meals', 'lunch'],
    metadata: { deviceId: 'DEV-3200', ipAddress: '10.0.0.12' }
  },
  {
    id: 'TXN-1048',
    merchant: 'Spotify for Business',
    amount: 14.99,
    category: 'Entertainment',
    paymentMethod: 'PayPal',
    date: '2024-02-10',
    isRefunded: false,
    tags: ['music', 'office-ambience'],
    metadata: { deviceId: 'DEV-9912', ipAddress: '172.16.2.8' }
  },
  {
    id: 'TXN-1049',
    merchant: 'Netflix Pro Premium',
    amount: 22.99,
    category: 'Entertainment',
    paymentMethod: 'Credit Card',
    date: '2024-02-14',
    isRefunded: false,
    tags: ['streaming', 'office-lounge'],
    metadata: { deviceId: 'DEV-9912', ipAddress: '172.16.2.8' }
  },
  {
    id: 'TXN-1050',
    merchant: 'IKEA Furniture',
    amount: 850.00,
    category: 'Office Supplies',
    paymentMethod: 'Bank Transfer',
    date: '2024-01-25',
    isRefunded: false,
    tags: ['furniture', 'office-setup'],
    metadata: { deviceId: 'DEV-9912', ipAddress: '172.16.2.8' }
  }
];
