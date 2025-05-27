
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Mail, User } from 'lucide-react';

export const ClientList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const clients = [
    {
      id: 1,
      name: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '+1 (555) 123-4567',
      totalInvoices: 5,
      totalRevenue: '$12,500',
      status: 'active',
    },
    {
      id: 2,
      name: 'Tech Solutions',
      email: 'hello@techsolutions.com',
      phone: '+1 (555) 987-6543',
      totalInvoices: 3,
      totalRevenue: '$8,200',
      status: 'active',
    },
    {
      id: 3,
      name: 'Design Studio',
      email: 'info@designstudio.com',
      phone: '+1 (555) 456-7890',
      totalInvoices: 7,
      totalRevenue: '$15,800',
      status: 'active',
    },
    {
      id: 4,
      name: 'StartupXYZ',
      email: 'team@startupxyz.com',
      phone: '+1 (555) 321-0987',
      totalInvoices: 2,
      totalRevenue: '$3,400',
      status: 'inactive',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">Manage your client relationships.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-500">{client.status}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  {client.email}
                </div>
                <p className="text-sm text-gray-600">{client.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Invoices</p>
                  <p className="font-medium text-gray-900">{client.totalInvoices}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="font-medium text-gray-900">{client.totalRevenue}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  New Invoice
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
