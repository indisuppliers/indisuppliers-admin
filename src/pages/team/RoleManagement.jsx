import { useState, useEffect } from 'react'
import API from '../../api/axios'
import toast from 'react-hot-toast'
import { Shield, ChevronDown } from 'lucide-react'

const ROLES = ['admin', 'team_leader', 'executive']
const ROLE_COLORS = {
  super_admin: 'bg-red-100 text-red-700',
  admin: 'bg-purple-100 text-purple-700',
  team_leader: 'bg-blue-100 text-blue-700',
  executive: 'bg-green-100 text-green-700',
}

export default function RoleManagement() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [changing, setChanging] = useState(null)

  const fetchMembers = () => {
    API.get('/team/list').then(res => {
      if (res.data.success) setMembers(res.data.members.filter(m => m.role !== 'super_admin'))
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchMembers() }, [])

  const handleRoleChange = async (memberId, newRole, name) => {
    setChanging(memberId)
    try {
      await API.put(`/team/${memberId}/role`, { role: newRole })
      toast.success(`${name}'s role updated to ${newRole}`)
      fetchMembers()
    } catch { toast.error('Failed to update role') }
    finally { setChanging(null) }
  }

  const PERMISSIONS_BY_ROLE = {
    admin: { view_sellers: true, add_seller: true, edit_seller: true, approve_verification: true, manage_team: true, view_products: true, upload_products: true, view_orders: true, create_orders: true, record_payment: true, view_financials: true, export_reports: true },
    team_leader: { view_sellers: true, add_seller: false, edit_seller: false, approve_verification: false, manage_team: true, view_products: true, upload_products: false, view_orders: true, create_orders: false, record_payment: false, view_financials: true, export_reports: true },
    executive: { view_sellers: true, add_seller: true, edit_seller: true, approve_verification: false, manage_team: false, view_products: true, upload_products: true, view_orders: true, create_orders: true, record_payment: true, view_financials: false, export_reports: false },
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
        <p className="text-gray-500 text-sm mt-1">Manage team member roles and view their permissions</p>
      </div>

      {/* Role Permissions Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {ROLES.map(role => (
          <div key={role} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={18} className="text-orange-500" />
              <h3 className="text-sm font-bold text-gray-800 capitalize">{role.replace('_', ' ')}</h3>
            </div>
            <div className="space-y-1.5">
              {Object.entries(PERMISSIONS_BY_ROLE[role]).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <span className={val ? 'text-green-500' : 'text-red-400'}>{val ? '✓' : '✗'}</span>
                  <span className={val ? 'text-gray-600' : 'text-gray-300 line-through'}>
                    {key.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-base font-bold text-gray-800">Team Members — Change Roles</h2>
        </div>
        {loading ? <div className="text-center py-16 text-gray-400">Loading...</div> :
         members.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Shield size={40} className="mx-auto mb-3 text-gray-200" />
            <p>No team members yet</p>
            <p className="text-sm mt-1">Add staff members from Team Management</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Member', 'Contact', 'Current Role', 'Change Role', 'Status'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                        {m.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{m.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{m.email}</p>
                    <p className="text-xs text-gray-400">{m.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${ROLE_COLORS[m.role]}`}>
                      {m.role?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <select
                        value={m.role}
                        disabled={changing === m.id}
                        onChange={e => handleRoleChange(m.id, e.target.value, m.name)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-white disabled:opacity-50 pr-8 appearance-none">
                        {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}