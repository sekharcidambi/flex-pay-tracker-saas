
import { BusinessSettings } from './BusinessSettings';

export const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your business settings and preferences.</p>
      </div>

      <BusinessSettings />
    </div>
  );
};
