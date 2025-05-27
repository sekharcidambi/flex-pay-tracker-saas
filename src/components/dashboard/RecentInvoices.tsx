
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const RecentInvoices = () => {
  const invoices = [
    {
      id: 'INV-001',
      client: 'Acme Corp',
      amount: '$2,500',
      status: 'paid',
      dueDate: '2024-01-15',
    },
    {
      id: 'INV-002',
      client: 'Tech Solutions',
      amount: '$1,800',
      status: 'pending',
      dueDate: '2024-01-20',
    },
    {
      id: 'INV-003',
      client: 'Design Studio',
      amount: '$3,200',
      status: 'overdue',
      dueDate: '2024-01-10',
    },
    {
      id: 'INV-004',
      client: 'StartupXYZ',
      amount: '$950',
      status: 'draft',
      dueDate: '2024-01-25',
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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-medium text-gray-900">{invoice.id}</p>
                <p className="text-sm text-gray-600">{invoice.client}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">{invoice.amount}</p>
                <p className="text-sm text-gray-600">Due: {invoice.dueDate}</p>
              </div>
              <Badge className={getStatusColor(invoice.status)}>
                {invoice.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
