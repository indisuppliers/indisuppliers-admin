import { useAuth } from '../context/AuthContext'
import { LogOut, Bell, Search, Menu } from 'lucide-react'

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-3 lg:px-6 py-3 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={22} />
        </button>

        {/* Search - hidden on mobile */}
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search sellers, products..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-72"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-4 border-l border-gray-200">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.customRole || (user?.role === 'super_admin' ? 'Super Admin' : user?.role?.replace('_', ' '))}
            </p>
          </div>
          <div className="w-8 h-8 lg:w-9 lg:h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}