import { useState } from 'react'
import toast from 'react-hot-toast'
import { Bell, Mail, Smartphone, Save } from 'lucide-react'

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState({
    // Email notifications
    email_new_seller: true,
    email_verification_submitted: true,
    email_seller_approved: false,
    email_new_order: true,
    email_payment_received: true,
    email_low_stock: false,
    // In-app notifications
    app_new_seller: true,
    app_verification: true,
    app_order_status: true,
    app_payment: true,
    app_team_activity: false,
    // Browser
    browser_alerts: false,
  })

  const toggle = (key) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }))

  const handleSave = () => {
    localStorage.setItem('notif_prefs', JSON.stringify(prefs))
    toast.success('Notification preferences saved!')
  }

  const Toggle = ({ prefKey, label, desc }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <div onClick={() => toggle(prefKey)}
        className={`w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${prefs[prefKey] ? 'bg-orange-500' : 'bg-gray-200'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform mt-1 ${prefs[prefKey] ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Control when and how you receive notifications</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Email */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b">
            <Mail size={18} className="text-orange-500" />
            <h2 className="text-base font-bold text-gray-800">Email Notifications</h2>
          </div>
          <Toggle prefKey="email_new_seller" label="New Seller Registered" desc="When a new seller submits their details" />
          <Toggle prefKey="email_verification_submitted" label="Verification Submitted" desc="When a seller submits verification documents" />
          <Toggle prefKey="email_seller_approved" label="Seller Approved/Rejected" desc="After you process a verification" />
          <Toggle prefKey="email_new_order" label="New Order Created" desc="When an order is placed in the system" />
          <Toggle prefKey="email_payment_received" label="Payment Recorded" desc="When a payment is logged" />
          <Toggle prefKey="email_low_stock" label="Low Stock Alert" desc="When product stock falls below 10 units" />
        </div>

        {/* In-App */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b">
            <Bell size={18} className="text-orange-500" />
            <h2 className="text-base font-bold text-gray-800">In-App Notifications</h2>
          </div>
          <Toggle prefKey="app_new_seller" label="New Seller Added" />
          <Toggle prefKey="app_verification" label="Verification Updates" />
          <Toggle prefKey="app_order_status" label="Order Status Changes" />
          <Toggle prefKey="app_payment" label="Payment Updates" />
          <Toggle prefKey="app_team_activity" label="Team Activity" desc="Actions performed by your team members" />
        </div>

        {/* Browser */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b">
            <Smartphone size={18} className="text-orange-500" />
            <h2 className="text-base font-bold text-gray-800">Browser Notifications</h2>
          </div>
          <Toggle prefKey="browser_alerts" label="Enable Browser Alerts"
            desc="Get desktop popup notifications when the browser is open" />
          {prefs.browser_alerts && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700">
                ⚠️ You'll need to allow browser notifications when prompted. Check your browser's notification settings if you don't see the prompt.
              </p>
            </div>
          )}
        </div>

        <button onClick={handleSave}
          className="flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-all">
          <Save size={18} /> Save Notification Preferences
        </button>
      </div>
    </div>
  )
}