
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Send, Users, FileText } from 'lucide-react';

export const QuickActions = () => {
  const actions = [
    {
      title: 'Create Invoice',
      description: 'Generate a new invoice',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Send Reminder',
      description: 'Send payment reminder',
      icon: Send,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      title: 'Add Client',
      description: 'Add new client',
      icon: Users,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'View Reports',
      description: 'Financial reports',
      icon: FileText,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 text-center"
            >
              <div className={`${action.color} text-white p-2 rounded-lg`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};
