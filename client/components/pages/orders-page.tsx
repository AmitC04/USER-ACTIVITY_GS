import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  items: Array<{ name: string; price: string }>;
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  paymentMethod?: string;
  transactionId?: string;
}

export function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const orders: Order[] = [
    {
      id: '#10234',
      date: 'Jan 20, 2026',
      items: [
        { name: 'AWS Solutions Architect Associate', price: '₹2,000' },
        { name: 'Azure Fundamentals', price: '₹1,500' },
      ],
      amount: '₹3,500',
      status: 'Paid',
      paymentMethod: 'Razorpay (Card •••• 4242)',
      transactionId: 'txn_abc123xyz',
    },
    {
      id: '#10198',
      date: 'Jan 15, 2026',
      items: [
        { name: 'Google Cloud Professional', price: '₹2,500' },
      ],
      amount: '₹2,500',
      status: 'Refunded',
      paymentMethod: 'Razorpay (UPI)',
      transactionId: 'txn_def456uvw',
    },
    {
      id: '#10142',
      date: 'Jan 5, 2026',
      items: [
        { name: 'Kubernetes Administrator', price: '₹1,999' },
      ],
      amount: '₹1,999',
      status: 'Paid',
      paymentMethod: 'Razorpay (Card •••• 5678)',
      transactionId: 'txn_ghi789rst',
    },
    {
      id: '#10089',
      date: 'Dec 28, 2025',
      items: [
        { name: 'DevOps Foundation', price: '₹1,800' },
        { name: 'Docker Fundamentals', price: '₹1,200' },
      ],
      amount: '₹3,000',
      status: 'Paid',
      paymentMethod: 'Razorpay (Card •••• 9012)',
      transactionId: 'txn_jkl012mno',
    },
  ];

  const getStatusBadge = (status: Order['status']) => {
    const configs = {
      Paid: { icon: '✓', color: 'bg-green-100 text-green-800' },
      Pending: { icon: '⏳', color: 'bg-yellow-100 text-yellow-800' },
      Failed: { icon: '✗', color: 'bg-red-100 text-red-800' },
      Refunded: { icon: '↩', color: 'bg-gray-100 text-gray-800' },
    };
    const config = configs[status];
    return (
      <Badge variant="secondary" className={config.color}>
        {config.icon} {status}
      </Badge>
    );
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl mb-2" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
          Order History
        </h1>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Select defaultValue="30days">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1" />

        <Button variant="outline">
          <Download className="size-4 mr-2" /> Export CSV
        </Button>
        <Button variant="outline">
          <Download className="size-4 mr-2" /> Download Invoices
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => [
                <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <span className="text-blue-600" style={{ fontWeight: 500 }}>
                      {order.id}
                    </span>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.items.length} items</Badge>
                  </TableCell>
                  <TableCell style={{ fontWeight: 600 }}>{order.amount}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(order.id)}
                      >
                        {expandedOrder === order.id ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>,
                expandedOrder === order.id && (
                  <TableRow key={`${order.id}-details`}>
                    <TableCell colSpan={6} className="bg-gray-50">
                      <div className="p-4 space-y-2">
                        <p className="text-sm" style={{ color: '#2c3e50', fontWeight: 600 }}>
                          Order Details:
                        </p>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-gray-700 pl-4">
                            <span>├─ {item.name}</span>
                            <span>{item.price}</span>
                          </div>
                        ))}
                        <div className="text-sm text-gray-700 pl-4 pt-2 border-t mt-2">
                          <p>├─ Payment Method: {order.paymentMethod}</p>
                          <p>├─ Transaction ID: {order.transactionId}</p>
                          <p>└─ Order Date: {order.date} at 3:45 PM</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              ])}
            </TableBody>
          </Table>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg mb-4" style={{ color: '#2c3e50', fontWeight: 600 }}>
            Summary
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
                ₹12,999
              </p>
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Orders:</span>
                <span style={{ color: '#2c3e50', fontWeight: 600 }}>8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Order:</span>
                <span style={{ color: '#2c3e50', fontWeight: 600 }}>₹1,625</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Refunds:</span>
                <span style={{ color: '#2c3e50', fontWeight: 600 }}>1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
