import { useState } from 'react'
import toast from 'react-hot-toast'
import { Shield, Plus } from 'lucide-react'

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

export default function CreateRoles() {
  const [roles, setRoles] = useState([
    { name: 'Admin', permissions: { view_sellers: true, add_seller: true, edit_seller: true, approve_verification: true, manage_team: true, view_products: true, upload_products: true, view_orders: true, create_orders: true, record_payment: true, view_financials: true, export_reports: true } },
    { name: 'Team Leader', permissions: { view_sellers: true, add_seller: false, edit_seller: false, approve_verification: false, manage_team: true, view_products: true, upload_products: false, view_orders: true, create_orders: false, record_payment: false, view_financials: true, export_reports: true } },
    { name: 'Executive', permissions: { view_sellers: true, add_seller: true, edit_seller: true, approve_verification: false, manage_team: false, view_products: true, upload_products: true, view_orders: true, create_orders: true, record_payment: true, view_financials: false, export_reports: false } },
  ])
  const [showAdd, setShowAdd] = useState(false)
  const [newRole, setNewRole] = useState({ name: '', permissions: Object.fromEntries(ALL_PERMISSIONS.map(p => [p.key, false])) })

  const togglePermission = (roleIdx, permKey) => {
    const updated = [...roles]
    updated[roleIdx].permissions[permKey] = !updated[roleIdx].permissions[permKey]
    setRoles(updated)
    toast.success('Permission updated!')
  }

  const toggleNewRolePerm = (permKey) => {
    setNewRole(prev => ({ ...prev, permissions: { ...prev.permissions, [permKey]: !prev.permissions[permKey] } }))
  }

  const handleAddRole = () => {
    if (!newRole.name.trim()) { toast.error('Role name required'); return }
    setRoles([...roles, { ...newRole }])
    setNewRole({ name: '', permissions: Object.fromEntries(ALL_PERMISSIONS.map(p => [p.key, false])) })
    setShowAdd(false)
    toast.success(`Role "${newRole.name}" created!`)
  }

  const countPerms = (permissions) => Object.values(permissions).filter(Boolean).length

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Roles</h1>
          <p className="text-gray-500 text-sm mt-1">Define custom roles and set their permissions</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-all">
          <Plus size={16} /> New Role
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-6 mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-4">Create New Role</h3>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role Name <span className="text-red-500">*</span></label>
            <input type="text" value={newRole.name}
              onChange={e => setNewRole({...newRole, name: e.target.value})}
              className="w-full max-w-sm border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="e.g. Billing Staff, Field Agent..." />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Permissions</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ALL_PERMISSIONS.map(perm => (
                <label key={perm.key} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-all text-sm ${newRole.permissions[perm.key] ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="checkbox" checked={newRole.permissions[perm.key]}
                    onChange={() => toggleNewRolePerm(perm.key)}
                    className="accent-green-500" />
                  <span className={newRole.permissions[perm.key] ? 'text-green-700' : 'text-gray-600'}>{perm.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAddRole} className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
              Create Role
            </button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {roles.map((role, roleIdx) => (
          <div key={roleIdx} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-orange-500" />
                <h3 className="text-base font-bold text-gray-800">{role.name}</h3>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                  {countPerms(role.permissions)}/{ALL_PERMISSIONS.length} permissions
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {ALL_PERMISSIONS.map(perm => (
                  <label key={perm.key}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-all text-xs ${role.permissions[perm.key] ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="checkbox"
                      checked={role.permissions[perm.key]}
                      onChange={() => togglePermission(roleIdx, perm.key)}
                      className="accent-green-500 flex-shrink-0" />
                    <span className={role.permissions[perm.key] ? 'text-green-700' : 'text-gray-400'}>
                      {perm.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}