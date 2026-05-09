import { useState, useEffect } from 'react'
import API from '../../api/axios'
import toast from 'react-hot-toast'
import { Shield, Save } from 'lucide-react'

const ALL_PERMISSIONS = [
  { key: 'view_sellers', label: 'View Sellers' },
  { key: 'add_seller', label: 'Add Seller' },
  { key: 'edit_seller', label: 'Edit Seller' },
  { key: 'approve_verification', label: 'Approve Verification' },
  { key: 'manage_team', label: 'Manage Team' },
  { key: 'view_products', label: 'View Products' },
  { key: 'upload_products', label: 'Upload Products' },
  { key: 'view_orders', label: 'View Orders' },
  { key: 'create_orders', label: 'Create Orders' },
  { key: 'record_payment', label: 'Record Payment' },
  { key: 'view_financials', label: 'View Financials' },
  { key: 'export_reports', label: 'Export Reports' },
]

const ROLE_COLORS = {
  admin: 'bg-purple-100 text-purple-700',
  team_leader: 'bg-blue-100 text-blue-700',
  executive: 'bg-green-100 text-green-700',
}

export default function PermissionsPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [permissions, setPermissions] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    API.get('/team/list').then(res => {
      if (res.data.success) {
        const nonSuper = res.data.members.filter(m => m.role !== 'super_admin')
        setMembers(nonSuper)
      }
    }).finally(() => setLoading(false))
  }, [])

  const selectMember = (member) => {
    setSelected(member)
    setPermissions({ ...member.permissions })
  }

  const togglePerm = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const savePermissions = async () => {
    if (!selected) return
    setSaving(true)
    try {
      await API.put(`/team/${selected.id}/role`, { role: selected.role, permissions })
      toast.success(`Permissions updated for ${selected.name}!`)
      setMembers(prev => prev.map(m => m.id === selected.id ? { ...m, permissions } : m))
      setSelected(prev => ({ ...prev, permissions }))
    } catch { toast.error('Failed to save permissions') }
    finally { setSaving(false) }
  }

  const countAllowed = () => Object.values(permissions).filter(Boolean).length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Permissions Manager</h1>
        <p className="text-gray-500 text-sm mt-1">Fine-tune individual permissions for each team member</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Member List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Select Team Member</h2>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {loading ? <div className="text-center py-8 text-gray-400 text-sm">Loading...</div> :
             members.length === 0 ? <div className="text-center py-8 text-gray-400 text-sm">No team members</div> :
             members.map(m => (
              <button key={m.id} onClick={() => selectMember(m)}
                className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors ${selected?.id === m.id ? 'bg-orange-50 border-r-2 border-orange-500' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs">
                    {m.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{m.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${ROLE_COLORS[m.role] || 'bg-gray-100 text-gray-600'}`}>
                      {m.role?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Permission Toggles */}
        <div className="md:col-span-2">
          {!selected ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center h-64">
              <div className="text-center text-gray-400">
                <Shield size={40} className="mx-auto mb-3" />
                <p>Select a team member to edit permissions</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-800">{selected.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{countAllowed()}/{ALL_PERMISSIONS.length} permissions enabled</p>
                </div>
                <button onClick={savePermissions} disabled={saving}
                  className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ALL_PERMISSIONS.map(perm => (
                    <label key={perm.key}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${permissions[perm.key] ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <span className={`text-sm font-medium ${permissions[perm.key] ? 'text-green-700' : 'text-gray-500'}`}>
                        {perm.label}
                      </span>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={permissions[perm.key] || false}
                          onChange={() => togglePerm(perm.key)} />
                        <div onClick={() => togglePerm(perm.key)}
                          className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${permissions[perm.key] ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mt-1 ${permissions[perm.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}