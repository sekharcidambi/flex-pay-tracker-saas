import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  CreditCard, 
  BarChart3,
  Plus,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBusiness } from '@/hooks/useBusiness';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { user } = useAuth();
  const { currentBusiness, loading: businessLoading } = useBusiness();
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_system_admin')
        .eq('id', user.id)
        .single();

      setIsSystemAdmin(profile?.is_system_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">InvoiceTracker</h1>
        <p className="text-sm text-gray-500 mt-1">
          {businessLoading ? 'Loading...' : currentBusiness?.name || 'Business'}
        </p>
      </div>
      
      <div className="p-4">
        <button 
          onClick={() => onTabChange('invoices')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </button>
      </div>

      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors",
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            );
          })}
          
          {isSystemAdmin && (
            <li className="pt-4 border-t border-gray-200">
              <a
                href="/admin"
                className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Shield className="w-5 h-5" />
                Admin Panel
              </a>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};
