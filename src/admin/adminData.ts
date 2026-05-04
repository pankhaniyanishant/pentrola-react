export const INITIAL_ACTIVITY = [
    { id: 'ACT-001', type: 'order', message: 'New order #ORD-7391 placed by Sufiyan', time: '5 mins ago', status: 'pending' },
    { id: 'ACT-002', type: 'customer', message: 'New customer registration: Jane Smith', time: '1 hour ago', status: 'completed' },
    { id: 'ACT-003', type: 'product', message: 'Product "Ergonomic Chair" out of stock', time: '2 hours ago', status: 'warning' },
    { id: 'ACT-004', type: 'order', message: 'Order #ORD-7388 shipped', time: '5 hours ago', status: 'completed' },
    { id: 'ACT-005', type: 'review', message: 'New 5-star review on "Wireless Mouse"', time: '1 day ago', status: 'completed' },
];

export const INITIAL_ORDERS = [
    { id: 'ORD-7391', customer: 'Sufiyan', total: '₹129.99', status: 'Pending', date: 'Oct 24, 2023' },
    { id: 'ORD-7390', customer: 'Alice Johnson', total: '₹45.00', status: 'Processing', date: 'Oct 24, 2023' },
    { id: 'ORD-7389', customer: 'Bob Smith', total: '₹899.00', status: 'Shipped', date: 'Oct 23, 2023' },
    { id: 'ORD-7388', customer: 'Emma Davis', total: '₹34.50', status: 'Delivered', date: 'Oct 23, 2023' },
];
