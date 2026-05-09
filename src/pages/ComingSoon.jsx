import { Link } from 'react-router-dom'
import { Clock, Zap, MessageSquare, Bell, Mail, Shield, Activity } from 'lucide-react'

const PAGE_INFO = {
  'Direct Chat — Phase 2': {
    icon: MessageSquare,
    reason: 'Requires real-time WebSocket server',
    needs: ['Firebase Realtime Database', 'Socket.io setup', 'Chat UI development'],
    eta: '2-3 weeks'
  },
  'Notifications — Phase 2': {
    icon: Bell,
    reason: 'Requires push notification infrastructure',
    needs: ['Firebase Cloud Messaging (FCM)', 'Service Worker', 'Notification API'],
    eta: '1-2 weeks'
  },
  'Bulk Messages — Phase 2': {
    icon: Mail,
    reason: 'Requires SMS/WhatsApp API integration',
    needs: ['Fast2SMS or MSG91 account', 'WhatsApp Business API', 'Template approval'],
    eta: '3-4 weeks'
  },
  'Recent Activity': {
    icon: Activity,
    reason: 'Loading activity logs...',
    needs: [],
    eta: ''
  },
}

export default function ComingSoon({ title }) {
  const info = PAGE_INFO[title]
  const Icon = info?.icon || Clock

  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Icon size={36} className="text-orange-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>

        {info?.reason && (
          <p className="text-gray-500 text-sm mb-4">{info.reason}</p>
        )}

        {info?.needs?.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 mb-5 text-left">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">What's needed:</p>
            <ul className="space-y-1.5">
              {info.needs.map((need, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap size={12} className="text-orange-400 flex-shrink-0" />
                  {need}
                </li>
              ))}
            </ul>
            {info.eta && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-400">Estimated development time: <strong className="text-gray-600">{info.eta}</strong></p>
              </div>
            )}
          </div>
        )}

        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-medium">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          Planned for Phase 2
        </div>

        <div className="mt-5">
          <Link to="/dashboard" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}