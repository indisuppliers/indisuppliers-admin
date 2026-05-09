import { useState, useEffect } from 'react'
import API from '../api/axios'
import { Activity, UserPlus, Package, ShoppingCart, UserCheck, UserX, CreditCard } from 'lucide-react'

const ACTION_CONFIG = {
  add_seller: { label: 'Seller Added', icon: UserPlus, color: 'bg-blue-100 text-blue-600' },
  verify_seller: { label: 'Seller Verified', icon: UserCheck, color: 'bg-green-100 text-green-600' },
  approve_seller: { label: 'Seller Approved', icon: UserCheck, color: 'bg-green-100 text-green-600' },
  reject_seller: { label: 'Seller Rejected', icon: UserX, color: 'bg-red-100 text-red-600' },
  block_seller: { label: 'Seller Blocked', icon: UserX, color: 'bg-red-100 text-red-600' },
  upload_product: { label: 'Product Uploaded', icon: Package, color: 'bg-purple-100 text-purple-600' },
  create_order: { label: 'Order Created', icon: ShoppingCart, color: 'bg-amber-100 text-amber-600' },
  record_payment: { label: 'Payment Recorded', icon: CreditCard, color: 'bg-emerald-100 text-emerald-600' },
}

export default function RecentActivity() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // Fetch activity logs from backend
    API.get('/team/activity').then(res => {
      if (res.data.success) setLogs(res.data.logs)
    }).catch(() => {
      // If no activity endpoint, show empty state
      setLogs([])
    }).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? logs : logs.filter(l => l.action?.includes(filter))

  const getConfig = (action) => ACTION_CONFIG[action] || { label: action || 'Action', icon: Activity, color: 'bg-gray-100 text-gray-600' }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recent Activity</h1>
        <p className="text-gray-500 text-sm mt-1">Track all actions performed on the platform</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { val: 'all', label: 'All Activity' },
          { val: 'seller', label: 'Sellers' },
          { val: 'product', label: 'Products' },
          { val: 'order', label: 'Orders' },
          { val: 'payment', label: 'Payments' },
        ].map(f => (
          <button key={f.val} onClick={() => setFilter(f.val)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f.val ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <Activity size={32} className="mx-auto mb-3 animate-pulse" />
            <p>Loading activity...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Activity size={48} className="mx-auto mb-3 text-gray-200" />
            <p className="font-medium text-gray-500">No activity yet</p>
            <p className="text-sm text-gray-400 mt-1">Actions will appear here as your team works</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((log, i) => {
              const config = getConfig(log.action)
              const Icon = config.icon
              return (
                <div key={i} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{log.description || config.label}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>{config.label}</span>
                      {log.entityId && <span className="text-xs text-gray-400 font-mono">{log.entityId}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">
                      {log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      }) : 'Just now'}
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">{log.userId?.slice(0, 8)}...</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}