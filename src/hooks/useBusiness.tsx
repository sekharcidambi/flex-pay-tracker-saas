
import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Business {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  logo_url?: string;
  tax_id?: string;
  default_currency: string;
  default_payment_terms: string;
  invoice_prefix: string;
}

interface BusinessUser {
  id: string;
  business_id: string;
  user_id: string;
  role: string;
}

interface BusinessContextType {
  currentBusiness: Business | null;
  businesses: Business[];
  businessUsers: BusinessUser[];
  loading: boolean;
  switchBusiness: (businessId: string) => void;
  refreshBusinesses: () => Promise<void>;
  updateBusiness: (updates: Partial<Business>) => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessUsers, setBusinessUsers] = useState<BusinessUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = async () => {
    if (!user) return;

    try {
      const { data: businessUsersData, error: businessUsersError } = await supabase
        .from('business_users')
        .select('*')
        .eq('user_id', user.id);

      if (businessUsersError) throw businessUsersError;
      setBusinessUsers(businessUsersData || []);

      if (businessUsersData && businessUsersData.length > 0) {
        const businessIds = businessUsersData.map(bu => bu.business_id);
        
        const { data: businessesData, error: businessesError } = await supabase
          .from('businesses')
          .select('*')
          .in('id', businessIds);

        if (businessesError) throw businessesError;
        setBusinesses(businessesData || []);
        
        if (!currentBusiness && businessesData && businessesData.length > 0) {
          setCurrentBusiness(businessesData[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshBusinesses = async () => {
    await fetchBusinesses();
  };

  const switchBusiness = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (business) {
      setCurrentBusiness(business);
    }
  };

  const updateBusiness = async (updates: Partial<Business>) => {
    if (!currentBusiness) return;

    try {
      const { error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', currentBusiness.id);

      if (error) throw error;

      setCurrentBusiness({ ...currentBusiness, ...updates });
      await refreshBusinesses();
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchBusinesses();
    } else {
      setBusinesses([]);
      setCurrentBusiness(null);
      setBusinessUsers([]);
      setLoading(false);
    }
  }, [user]);

  return (
    <BusinessContext.Provider value={{
      currentBusiness,
      businesses,
      businessUsers,
      loading,
      switchBusiness,
      refreshBusinesses,
      updateBusiness
    }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
