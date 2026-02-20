'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  createdAt: string;
  items: OrderItem[];
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  paymentMethod?: string;
  transactionId?: string;
  totalAmount: number;
}

export function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.orders.getAll();
        const rawData = response.data.data;
        const fetchedOrders = Array.isArray(rawData) ? rawData : (rawData?.orders || []);
        
        // Transform the API data to match our expected structure
        const transformedOrders = fetchedOrders.map((order: any) => {
          const normalizedStatus = order.status === 'completed'
            ? 'Paid'
            : order.status.charAt(0).toUpperCase() + order.status.slice(1);
          const status = (['Paid', 'Pending', 'Failed', 'Refunded'] as const).includes(normalizedStatus as any)
            ? (normalizedStatus as Order['status'])
            : 'Pending';

          return {
          id: order.id,
          orderNumber: order.orderNumber,
          date: new Date(order.createdAt).toLocaleDateString(),
          createdAt: order.createdAt,
          items: order.items.map((item: any) => ({
            id: item.id,
            name: item.course.title,
            price: `₹${item.price}`,
            quantity: item.quantity
          })),
          amount: `₹${order.totalAmount}`,
          status,
          paymentMethod: order.paymentMethod,
          transactionId: order.paymentId,
          totalAmount: order.totalAmount
        };
        });
        
        setOrders(transformedOrders);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  // Calculate summary data
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrder = orders.length > 0 ? totalSpent / orders.length : 0;
  const refundCount = orders.filter(order => order.status === 'Refunded').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

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
              {orders.length > 0 ? (
                orders.map((order) => [
                  <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      <span className="text-blue-600" style={{ fontWeight: 500 }}>
                        {order.orderNumber}
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
                            <p>└─ Order Date: {new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                ])
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
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
                ₹{totalSpent.toLocaleString()}
              </p>
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Orders:</span>
                <span style={{ color: '#2c3e50', fontWeight: 600 }}>{orders.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Order:</span>
                <span style={{ color: '#2c3e50', fontWeight: 600 }}>₹{avgOrder.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Refunds:</span>
                <span style={{ color: '#2c3e50', fontWeight: 600 }}>{refundCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
