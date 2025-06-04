'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  invoice_number: string;
  title: string;
  description: string;
  total_amount: number;
  currency: string;
  status: string;
  due_date: string;
  issue_date: string;
  client_id: string;
}

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  payment_comment: string;
  client_comment: string;
  payment_date: string;
  paid_by_client: boolean;
}

export default function ClientPortal() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentComment, setPaymentComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  useEffect(() => {
    if (selectedInvoice) {
      fetchPayments(selectedInvoice.id);
    }
  }, [selectedInvoice]);

  const fetchInvoices = async () => {
    try {
      // Fetch invoices that the user has portal access to
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients!inner (
            id,
            name,
            client_portal_access!inner (
              user_id
            )
          )
        `)
        .eq('clients.client_portal_access.user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch invoices');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (invoiceId: string) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      console.error('Failed to fetch payments:', error);
    }
  };

  const markAsPaid = async () => {
    if (!selectedInvoice || !paymentMethod) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          invoice_id: selectedInvoice.id,
          amount: selectedInvoice.total_amount,
          payment_method: paymentMethod,
          client_comment: paymentComment,
          paid_by_client: true,
        });

      if (paymentError) throw paymentError;

      // Update invoice status
      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', selectedInvoice.id);

      if (invoiceError) throw invoiceError;

      toast.success('Payment recorded successfully!');
      setPaymentMethod('');
      setPaymentComment('');
      fetchInvoices();
      fetchPayments(selectedInvoice.id);
    } catch (error: any) {
      toast.error('Failed to record payment');
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Portal</h1>
          <p className="text-gray-600 mt-2">View and manage your invoices</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invoice List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Invoices</h2>
            {invoices.map((invoice) => (
              <Card
                key={invoice.id}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedInvoice?.id === invoice.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedInvoice(invoice)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{invoice.invoice_number}</CardTitle>
                      <CardDescription>{invoice.title}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      ${invoice.total_amount.toFixed(2)} {invoice.currency}
                    </span>
                    <span className="text-sm text-gray-500">
                      Due: {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Invoice Details & Payment */}
          <div>
            {selectedInvoice ? (
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                  <CardDescription>{selectedInvoice.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">Amount:</span>
                      <span>${selectedInvoice.total_amount.toFixed(2)} {selectedInvoice.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Status:</span>
                      <Badge className={getStatusColor(selectedInvoice.status)}>
                        {selectedInvoice.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Due Date:</span>
                      <span>{format(new Date(selectedInvoice.due_date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Issued:</span>
                      <span>{format(new Date(selectedInvoice.issue_date), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>

                  {selectedInvoice.status !== 'paid' && (
                    <div className="space-y-4">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Input
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        placeholder="e.g. Bank Transfer, Credit Card"
                        required
                      />
                      <Label htmlFor="paymentComment">Comment (optional)</Label>
                      <Textarea
                        id="paymentComment"
                        value={paymentComment}
                        onChange={(e) => setPaymentComment(e.target.value)}
                        placeholder="Add a comment for the business..."
                      />
                      <Button onClick={markAsPaid} className="w-full">
                        Mark as Paid
                      </Button>
                    </div>
                  )}

                  <div className="mt-8">
                    <h3 className="font-semibold mb-2">Payment History</h3>
                    {payments.length === 0 ? (
                      <p className="text-gray-500">No payments recorded yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {payments.map((payment) => (
                          <li key={payment.id} className="flex justify-between items-center">
                            <span>
                              ${payment.amount.toFixed(2)} via {payment.payment_method}
                              {payment.client_comment && (
                                <span className="ml-2 text-xs text-gray-400">({payment.client_comment})</span>
                              )}
                            </span>
                            <span className="text-sm text-gray-500">
                              {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-gray-500">Select an invoice to view details</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 