
import { Card } from '@/components/ui/card';
import { DollarSign, FileText, Clock, Users } from 'lucide-react';

export const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: '+12%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Outstanding',
      value: '$3,200',
      change: '-8%',
      changeType: 'negative',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Invoices',
      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Clients',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className={`text-sm mt-1 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
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
