
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, CreditCard, Settings as SettingsIcon, Bell } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and business settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" placeholder="Your Company" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1 (555) 123-4567" />
            </div>
            <Button className="w-full">Save Changes</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 text-green-600 p-2 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Payment Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Input id="currency" placeholder="USD" />
            </div>
            <div>
              <Label htmlFor="tax">Tax Rate (%)</Label>
              <Input id="tax" placeholder="10" />
            </div>
            <div>
              <Label htmlFor="terms">Payment Terms (days)</Label>
              <Input id="terms" placeholder="30" />
            </div>
            <Button className="w-full">Update Settings</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email updates about invoices</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Payment Reminders</p>
                <p className="text-sm text-gray-500">Automatic payment reminders</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Business Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Business Address</Label>
              <Input id="address" placeholder="123 Business St, City, State" />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://yourwebsite.com" />
            </div>
            <div>
              <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
              <Input id="invoice-prefix" placeholder="INV-" />
            </div>
            <Button className="w-full">Save Settings</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
