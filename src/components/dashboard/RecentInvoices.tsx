import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBusiness } from '@/hooks/useBusiness';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from 'next-themes';

export const RecentInvoices = () => {
  const { currentBusiness } = useBusiness();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!currentBusiness) return;
    setLoading(true);
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, invoice_number, total_amount, status, due_date, clients(name)')
        .eq('business_id', currentBusiness.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (!error) setInvoices(data || []);
      setLoading(false);
    };
    fetchInvoices();
  }, [currentBusiness]);

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
    <Card className={`p-6 ${resolvedTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Invoices</h3>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="text-gray-500">No recent invoices.</div>
        ) : (
          invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{invoice.invoice_number || invoice.id}</p>
                <p className="text-sm text-gray-600">{invoice.clients?.name || 'Unknown Client'}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium text-gray-900">${invoice.total_amount?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Due: {invoice.due_date}</p>
                </div>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
