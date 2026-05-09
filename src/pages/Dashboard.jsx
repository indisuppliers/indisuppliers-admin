import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import {
  Users, Package, ShoppingCart, Clock,
  UserPlus, UserCheck, TrendingUp, ArrowRight
} from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/team/dashboard/stats')
      .then(res => { if (res.data.success) setStats(res.data.stats) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    {
      title: 'Total Sellers',
      value: stats.totalSellers || 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      link: '/sellers'
    },
    {
      title: 'Pending Verification',
      value: stats.pendingVerification || 0,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      link: '/sellers/verification',
      urgent: true
    },
    {
      title: 'Active Products',
      value: stats.totalProducts || 0,
      icon: Package,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      link: '/products'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      link: '/orders'
    },
  ]

  const quickActions = [
    { label: 'Add New Seller', icon: UserPlus, link: '/sellers/add', color: 'bg-blue-500' },
    { label: 'Verify Sellers', icon: UserCheck, link: '/sellers/verification', color: 'bg-amber-500' },
    { label: 'Upload Product', icon: Package, link: '/products/add', color: 'bg-emerald-500' },
    { label: 'Create Order', icon: ShoppingCart, link: '/orders', color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Last updated</p>
          <p className="text-sm font-medium text-gray-600">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <Link key={i} to={card.link}
              className={`bg-white rounded-xl p-5 border ${card.border} shadow-sm hover:shadow-md transition-all group`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`${card.bg} p-3 rounded-lg`}>
                  <Icon size={22} className={card.color} />
                </div>
                {card.urgent && stats.pendingVerification > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium animate-pulse">
                    Action Needed
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : card.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{card.title}</p>
              <div className={`flex items-center gap-1 mt-3 text-xs ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                <span>View details</span>
                <ArrowRight size={12} />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800">Quick Actions</h2>
          <TrendingUp size={18} className="text-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon
            return (
              <Link key={i} to={action.link}
                className="flex flex-col items-center p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group">
                <div className={`${action.color} text-white p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">{action.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <h3 className="font-bold text-lg mb-1">Seller Onboarding</h3>
          <p className="text-orange-100 text-sm mb-4">Add and verify new sellers on the platform</p>
          <Link to="/sellers/add"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-colors">
            Add Seller <ArrowRight size={14} />
          </Link>
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white">
          <h3 className="font-bold text-lg mb-1">Platform Status</h3>
          <p className="text-gray-400 text-sm mb-4">All systems operational</p>
          <div className="space-y-2">
            {[
              { label: 'API Server', status: 'Operational' },
              { label: 'Database', status: 'Operational' },
              { label: 'Storage', status: 'Operational' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{item.label}</span>
                <span className="text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}