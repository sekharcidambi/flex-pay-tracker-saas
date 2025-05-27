
import { Card } from '@/components/ui/card';
import { FileText, DollarSign, User, Mail } from 'lucide-react';

export const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'invoice',
      message: 'Invoice INV-001 paid by Acme Corp',
      time: '2 hours ago',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      id: 2,
      type: 'invoice',
      message: 'Created invoice INV-004 for StartupXYZ',
      time: '4 hours ago',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      id: 3,
      type: 'client',
      message: 'Added new client: Design Studio',
      time: '1 day ago',
      icon: User,
      color: 'text-purple-600',
    },
    {
      id: 4,
      type: 'reminder',
      message: 'Payment reminder sent to Tech Solutions',
      time: '2 days ago',
      icon: Mail,
      color: 'text-orange-600',
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`${activity.color} bg-gray-50 p-2 rounded-lg`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
