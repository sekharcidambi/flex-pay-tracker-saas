'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { CreateBusinessForm } from '@/components/business/CreateBusinessForm';

interface BusinessStats {
  id: string;
  name: string;
  email: string;
  created_at: string;
  client_count: number;
  invoice_count: number;
  total_revenue: number;
}

interface Invoice {
  total_amount: number;
}

interface Business {
  id: string;
  name: string;
  email: string;
  created_at: string;
  clients: { count: number }[];
  invoices: Invoice[];
}

export default function AdminPage() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<BusinessStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      console.log('AdminPage: No user found.');
      setLoading(false);
      return;
    }

    console.log('AdminPage: Checking admin status for user ID:', user.id);

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_system_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('AdminPage: Error fetching profile:', error);
        throw error;
      }
      
      console.log('AdminPage: Fetched profile data:', profile);
      console.log('AdminPage: is_system_admin value:', profile?.is_system_admin);

      if (profile?.is_system_admin) {
        console.log('AdminPage: User is system admin.');
        setIsAdmin(true);
        await fetchBusinessStats();
      } else {
        console.log('AdminPage: User is NOT system admin.');
        setLoading(false);
      }
    } catch (error) {
      console.error('AdminPage: Error checking admin status (caught):', error);
      setLoading(false);
    }
  };

  const fetchBusinessStats = async () => {
    try {
      // Fetch businesses with client and invoice counts
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select(`
          id,
          name,
          email,
          created_at,
          clients!businesses_business_id_fkey(count),
          invoices!businesses_business_id_fkey(count, total_amount)
        `);

      if (businessError) throw businessError;

      // Transform the data to calculate stats
      const businessStats: BusinessStats[] = (businessData as any[] || []).map(business => {
        const clientCount = Array.isArray(business.clients) ? business.clients.length : 0;
        const invoices = Array.isArray(business.invoices) ? business.invoices : [];
        const invoiceCount = invoices.length;
        const totalRevenue = Array.isArray(invoices)
          ? invoices.reduce((sum: number, invoice: Invoice) => sum + (invoice.total_amount || 0), 0)
          : 0;

        return {
          id: business.id,
          name: business.name,
          email: business.email,
          created_at: business.created_at,
          client_count: clientCount,
          invoice_count: invoiceCount,
          total_revenue: totalRevenue,
        };
      });

      setBusinesses(businessStats);
    } catch (error) {
      console.error('Error fetching business stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              You don't have permission to access the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <CreateBusinessForm />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Admin Panel</h1>
          <p className="text-gray-600 mt-2">Overview of all businesses and their statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Businesses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{businesses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {businesses.reduce((sum, b) => sum + b.client_count, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {businesses.reduce((sum, b) => sum + b.invoice_count, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${businesses.reduce((sum, b) => sum + b.total_revenue, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-center">Clients</TableHead>
                  <TableHead className="text-center">Invoices</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell className="font-medium">{business.name}</TableCell>
                    <TableCell>{business.email}</TableCell>
                    <TableCell>
                      {format(new Date(business.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{business.client_count}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{business.invoice_count}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${business.total_revenue.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 