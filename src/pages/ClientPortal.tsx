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

          {/* Invoice Details */}
          {selectedInvoice && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{selectedInvoice.title}</h3>
                    <p className="text-gray-600">{selectedInvoice.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Invoice Number:</span>
                      <p className="font-medium">{selectedInvoice.invoice_number}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Issue Date:</span>
                      <p className="font-medium">
                        {format(new Date(selectedInvoice.issue_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <p className="font-medium">
                        {format(new Date(selectedInvoice.due_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <p className="font-medium text-lg">
                        ${selectedInvoice.total_amount.toFixed(2)} {selectedInvoice.currency}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Section */}
              {selectedInvoice.status !== 'paid' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mark as Paid</CardTitle>
                    <CardDescription>
                      Record your payment for this invoice
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Input
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        placeholder="e.g., Bank Transfer, Credit Card, PayPal"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentComment">Comment (Optional)</Label>
                      <Textarea
                        id="paymentComment"
                        value={paymentComment}
                        onChange={(e) => setPaymentComment(e.target.value)}
                        placeholder="Add any notes about the payment..."
                        rows={3}
                      />
                    </div>
                    
                    <Button onClick={markAsPaid} className="w-full">
                      Mark as Paid - ${selectedInvoice.total_amount.toFixed(2)}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Payment History */}
              {payments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">${payment.amount.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">{payment.payment_method}</p>
                              {payment.client_comment && (
                                <p className="text-sm text-gray-600 mt-1">
                                  "{payment.client_comment}"
                                </p>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
