import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Users, UserCheck, UserX, Package,
  ShoppingCart, CreditCard, BookOpen, MessageSquare,
  Phone, Bell, Settings, Shield, ChevronDown, ChevronRight,
  BarChart3, UserPlus, Activity, FileText, Wallet,
  Receipt, Tags, AlertCircle, Mail
} from 'lucide-react'

const menuConfig = [
  {
    section: 'HOME',
    items: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/activity', icon: Activity, label: 'Recent Activity' },
    ]
  },
  {
    section: 'TEAM MANAGEMENT',
    items: [
      { path: '/team', icon: Users, label: 'Staff List' },
      { path: '/team/add', icon: UserPlus, label: 'Add New Staff' },
      { path: '/team/roles', icon: Shield, label: 'Role Management' },
    ]
  },
  {
    section: 'SELLERS',
    items: [
      { path: '/sellers', icon: Users, label: 'All Sellers' },
      { path: '/sellers/add', icon: UserPlus, label: 'Add New Seller' },
      { path: '/sellers/verification', icon: UserCheck, label: 'Verification Queue' },
      { path: '/sellers/blocked', icon: UserX, label: 'Blocked Sellers' },
      { path: '/sellers/reports', icon: BarChart3, label: 'Seller Reports' },
    ]
  },
  {
    section: 'PRODUCTS',
    items: [
      { path: '/products', icon: Package, label: 'All Products' },
      { path: '/products/add', icon: Tags, label: 'Upload Product' },
      { path: '/products/stock', icon: AlertCircle, label: 'Stock Status' },
    ]
  },
  {
    section: 'BILLING',
    items: [
      { path: '/orders', icon: ShoppingCart, label: 'Orders' },
      { path: '/payments', icon: CreditCard, label: 'Payments' },
      { path: '/payments/advance', icon: Wallet, label: 'Advance Ledger' },
      { path: '/invoices', icon: Receipt, label: 'Invoices' },
      { path: '/billing/reports', icon: BarChart3, label: 'Reports' },
    ]
  },
  {
    section: 'COMMUNICATIONS',
    items: [
      { path: '/messages', icon: MessageSquare, label: 'Direct Chat' },
      { path: '/notifications', icon: Bell, label: 'Notifications' },
      { path: '/bulk-messages', icon: Mail, label: 'Bulk Messages' },
    ]
  },
  {
    section: 'SETTINGS',
    items: [
      { path: '/settings/profile', icon: Settings, label: 'Profile' },
      { path: '/settings/roles', icon: Shield, label: 'Create Roles' },
      { path: '/settings/permissions', icon: FileText, label: 'Permissions' },
      { path: '/settings/notifications', icon: Bell, label: 'Notifications' },
    ]
  },
]

export default function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState({})

  const toggleSection = (section) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const isActive = (path) => location.pathname === path
  const isSectionActive = (items) => items.some(item => location.pathname.startsWith(item.path))

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen overflow-hidden">
      {/* Logo */}
      <div className="p-5 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">IS</div>
          <div>
            <h2 className="text-base font-bold text-white">IndiSuppliers</h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-orange-400 capitalize">
  {user?.customRole || (user?.role === 'super_admin' ? 'Super Admin' : user?.role?.replace('_', ' '))}
</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {menuConfig.map((group) => {
          const isOpen = !collapsed[group.section]
          const sectionActive = isSectionActive(group.items)

          return (
            <div key={group.section} className="mb-1">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(group.section)}
                className={`w-full flex items-center justify-between px-4 py-2 text-xs font-semibold tracking-wider transition-colors ${
                  sectionActive ? 'text-orange-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span>{group.section}</span>
                {isOpen
                  ? <ChevronDown size={12} />
                  : <ChevronRight size={12} />
                }
              </button>

              {/* Section Items */}
              {isOpen && (
                <div className="mb-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.path)
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 mx-2 px-3 py-2 rounded-lg mb-0.5 transition-all text-sm ${
                          active
                            ? 'bg-orange-500 text-white font-medium'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <Icon size={16} className="flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Firebase Spark (Free)</span>
          <span className="text-xs text-green-400 font-medium">● Live</span>
        </div>
        <div className="mt-1">
          <span className="text-xs text-gray-600">v1.0.0 — IndiSuppliers</span>
        </div>
      </div>
    </aside>
  )
}