import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { DollarSign, FileText, Clock, Users } from 'lucide-react';
import { useBusiness } from '@/hooks/useBusiness';
import { supabase } from '@/integrations/supabase/client';

export const DashboardStats = () => {
  const { currentBusiness } = useBusiness();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    outstanding: 0,
    totalInvoices: 0,
    activeClients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentBusiness) return;
    setLoading(true);
    const fetchStats = async () => {
      // Fetch invoices
      const { data: invoices, error: invoiceError } = await supabase
        .from('invoices')
        .select('total_amount, status, business_id')
        .eq('business_id', currentBusiness.id);
      // Fetch clients
      const { data: clients, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('business_id', currentBusiness.id);
      if (invoiceError || clientError) {
        setLoading(false);
        return;
      }
      const totalRevenue = (invoices || []).reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
      const outstanding = (invoices || []).filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
      setStats({
        totalRevenue,
        outstanding,
        totalInvoices: invoices?.length || 0,
        activeClients: clients?.length || 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, [currentBusiness]);

  const statCards = [
    {
      title: 'Total Revenue',
      value: loading ? '...' : `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Outstanding',
      value: loading ? '...' : `$${stats.outstanding.toLocaleString()}`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Invoices',
      value: loading ? '...' : stats.totalInvoices,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Clients',
      value: loading ? '...' : stats.activeClients,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
