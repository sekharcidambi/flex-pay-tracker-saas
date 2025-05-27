
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';

export const InvoiceList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const invoices = [
    {
      id: 'INV-001',
      client: 'Acme Corp',
      amount: '$2,500',
      status: 'paid',
      dueDate: '2024-01-15',
      createdDate: '2024-01-01',
    },
    {
      id: 'INV-002',
      client: 'Tech Solutions',
      amount: '$1,800',
      status: 'pending',
      dueDate: '2024-01-20',
      createdDate: '2024-01-05',
    },
    {
      id: 'INV-003',
      client: 'Design Studio',
      amount: '$3,200',
      status: 'overdue',
      dueDate: '2024-01-10',
      createdDate: '2023-12-20',
    },
    {
      id: 'INV-004',
      client: 'StartupXYZ',
      amount: '$950',
      status: 'draft',
      dueDate: '2024-01-25',
      createdDate: '2024-01-12',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage and track your invoices.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Invoice</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Client</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Due Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.id}</p>
                      <p className="text-sm text-gray-500">Created: {invoice.createdDate}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{invoice.client}</td>
                  <td className="py-4 px-4 font-medium text-gray-900">{invoice.amount}</td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{invoice.dueDate}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
