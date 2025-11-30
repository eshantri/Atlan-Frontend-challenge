import type { QueryResult, SavedQuery, Database } from '../types'

// Northwind Database structure from CSV files
export const mockDatabases: Database[] = [
  {
    id: 'db1',
    name: 'Northwind',
    tables: [
      { id: 'northwind_categories', name: 'categories', rowCount: 8, columns: 3, database: 'Northwind' },
      { id: 'northwind_customers', name: 'customers', rowCount: 91, columns: 11, database: 'Northwind' },
      { id: 'northwind_employees', name: 'employees', rowCount: 9, columns: 18, database: 'Northwind' },
      { id: 'northwind_employee_territories', name: 'employee_territories', rowCount: 49, columns: 2, database: 'Northwind' },
      { id: 'northwind_orders', name: 'orders', rowCount: 830, columns: 14, database: 'Northwind' },
      { id: 'northwind_order_details', name: 'order_details', rowCount: 2155, columns: 5, database: 'Northwind' },
      { id: 'northwind_products', name: 'products', rowCount: 77, columns: 10, database: 'Northwind' },
      { id: 'northwind_regions', name: 'regions', rowCount: 4, columns: 2, database: 'Northwind' },
      { id: 'northwind_shippers', name: 'shippers', rowCount: 3, columns: 3, database: 'Northwind' },
      { id: 'northwind_suppliers', name: 'suppliers', rowCount: 29, columns: 12, database: 'Northwind' },
      { id: 'northwind_territories', name: 'territories', rowCount: 53, columns: 3, database: 'Northwind' },
    ],
  },
  {
    id: 'db2',
    name: 'Analytics',
    tables: [
      { id: 'analytics_users', name: 'users', rowCount: 1250, columns: 8, database: 'Analytics' },
      { id: 'analytics_sessions', name: 'sessions', rowCount: 15432, columns: 7, database: 'Analytics' },
      { id: 'analytics_events', name: 'events', rowCount: 45892, columns: 6, database: 'Analytics' },
    ],
  },
]

// Flatten all tables for backwards compatibility
export const mockTables = mockDatabases.flatMap((db) => db.tables)

export const mockQueries: SavedQuery[] = [
  {
    id: '1',
    name: 'All Products',
    query: 'SELECT * FROM products;',
    description: 'Get all products from Northwind database',
  },
  {
    id: '2',
    name: 'Top Customers',
    query: 'SELECT c.company_name, COUNT(o.order_id) as order_count FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id ORDER BY order_count DESC LIMIT 10;',
    description: 'Top 10 customers by order count',
  },
  {
    id: '3',
    name: 'Employee Sales',
    query: 'SELECT e.first_name, e.last_name, COUNT(o.order_id) as total_orders FROM employees e LEFT JOIN orders o ON e.employee_id = o.employee_id GROUP BY e.employee_id;',
    description: 'Sales performance by employee',
  },
  {
    id: '4',
    name: 'Product Categories',
    query: 'SELECT c.category_name, COUNT(p.product_id) as product_count FROM categories c LEFT JOIN products p ON c.category_id = p.category_id GROUP BY c.category_id;',
    description: 'Products grouped by category',
  },
  {
    id: '5',
    name: 'Recent Orders',
    query: 'SELECT * FROM orders ORDER BY order_date DESC LIMIT 100;',
    description: 'Last 100 orders',
  },
]

// Mock data sets
const usersData: QueryResult = {
  columns: ['id', 'name', 'email', 'created_at'],
  rows: [
    { id: 1, name: 'John Doe', email: 'john@example.com', created_at: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', created_at: '2024-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', created_at: '2024-03-10' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', created_at: '2024-04-05' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', created_at: '2024-05-12' },
  ],
  rowCount: 5,
  executionTime: 12,
}

const ordersData: QueryResult = {
  columns: ['order_id', 'customer_name', 'status', 'total_amount', 'order_date'],
  rows: [
    { order_id: 101, customer_name: 'John Doe', status: 'active', total_amount: '$250.00', order_date: '2024-11-20' },
    { order_id: 102, customer_name: 'Jane Smith', status: 'active', total_amount: '$180.50', order_date: '2024-11-22' },
    { order_id: 103, customer_name: 'Bob Johnson', status: 'active', total_amount: '$420.75', order_date: '2024-11-23' },
    { order_id: 104, customer_name: 'Alice Williams', status: 'active', total_amount: '$95.20', order_date: '2024-11-25' },
  ],
  rowCount: 4,
  executionTime: 18,
}

const productsData: QueryResult = {
  columns: ['product_name', 'total_sold'],
  rows: [
    { product_name: 'Laptop Pro 15"', total_sold: 145 },
    { product_name: 'Wireless Mouse', total_sold: 523 },
    { product_name: 'USB-C Cable', total_sold: 892 },
    { product_name: 'Mechanical Keyboard', total_sold: 267 },
    { product_name: 'External SSD 1TB', total_sold: 189 },
    { product_name: 'Webcam HD', total_sold: 345 },
    { product_name: 'Monitor 27"', total_sold: 156 },
    { product_name: 'Desk Lamp', total_sold: 421 },
    { product_name: 'Phone Stand', total_sold: 678 },
    { product_name: 'Laptop Sleeve', total_sold: 234 },
  ],
  rowCount: 10,
  executionTime: 25,
}

const revenueData: QueryResult = {
  columns: ['month', 'revenue'],
  rows: [
    { month: '2024-01', revenue: '$45,230' },
    { month: '2024-02', revenue: '$52,180' },
    { month: '2024-03', revenue: '$48,920' },
    { month: '2024-04', revenue: '$61,450' },
    { month: '2024-05', revenue: '$58,330' },
    { month: '2024-06', revenue: '$67,890' },
  ],
  rowCount: 6,
  executionTime: 15,
}

const customersData: QueryResult = {
  columns: ['customer_id', 'name', 'email', 'signup_date', 'total_orders'],
  rows: [
    { customer_id: 501, name: 'Sarah Connor', email: 'sarah@example.com', signup_date: '2024-10-15', total_orders: 8 },
    { customer_id: 502, name: 'Michael Scott', email: 'michael@example.com', signup_date: '2024-10-18', total_orders: 5 },
    { customer_id: 503, name: 'Pam Beesly', email: 'pam@example.com', signup_date: '2024-10-22', total_orders: 12 },
  ],
  rowCount: 3,
  executionTime: 10,
}

// Generate mock users data with 1000 rows
function generateMockUsers(count: number): QueryResult {
  const rows = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    created_at: new Date(2024, 0, 1 + (i % 365)).toISOString().split('T')[0],
  }))

  return {
    columns: ['id', 'name', 'email', 'created_at'],
    rows: rows.slice(0, 1000), // Return max 1000 for display
    rowCount: Math.min(1000, rows.length),
    executionTime: 45,
    totalRows: count,
    isLimited: count > 1000,
    limitApplied: 1000,
  }
}

// Simple query parser and executor
export function executeQuery(query: string): QueryResult {
  const lowerQuery = query.toLowerCase().trim()

  // Check for specific mock queries
  if (lowerQuery.includes('from users') && !lowerQuery.includes('where')) {
    if (lowerQuery.includes('limit')) {
      return usersData
    }
    // Simulate large dataset
    return generateMockUsers(1250)
  }

  if (lowerQuery.includes('from orders')) {
    return ordersData
  }

  if (lowerQuery.includes('top') && lowerQuery.includes('products')) {
    return productsData
  }

  if (lowerQuery.includes('revenue')) {
    return revenueData
  }

  if (lowerQuery.includes('recent') && lowerQuery.includes('customers')) {
    return customersData
  }

  // Default to users data
  return usersData
}
