import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function CreateBusinessForm({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    tax_id: '',
    default_currency: 'USD',
    default_payment_terms: '30 days',
    invoice_prefix: 'INV',
    admin_user_email: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create the business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          website: form.website,
          tax_id: form.tax_id,
          default_currency: form.default_currency,
          default_payment_terms: form.default_payment_terms,
          invoice_prefix: form.invoice_prefix,
        })
        .select()
        .single();
      if (businessError) throw businessError;

      // 2. Find the user by email
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', form.admin_user_email)
        .single();
      if (userError) throw new Error('Admin user not found');

      // 3. Link the user to the business
      const { error: linkError } = await supabase
        .from('business_users')
        .insert({
          business_id: business.id,
          user_id: user.id,
          role: 'admin',
        });
      if (linkError) throw linkError;

      toast.success('Business created and admin linked!');
      setForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        tax_id: '',
        default_currency: 'USD',
        default_payment_terms: '30 days',
        invoice_prefix: 'INV',
        admin_user_email: '',
      });
      if (onCreated) onCreated();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create business');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Onboard a New Business</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Business Email *</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" value={form.website} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax_id">Tax ID</Label>
              <Input id="tax_id" name="tax_id" value={form.tax_id} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice_prefix">Invoice Prefix</Label>
              <Input id="invoice_prefix" name="invoice_prefix" value={form.invoice_prefix} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_currency">Default Currency</Label>
              <Input id="default_currency" name="default_currency" value={form.default_currency} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_payment_terms">Default Payment Terms</Label>
              <Input id="default_payment_terms" name="default_payment_terms" value={form.default_payment_terms} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin_user_email">Admin User Email *</Label>
            <Input id="admin_user_email" name="admin_user_email" type="email" value={form.admin_user_email} onChange={handleChange} required />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Business'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 