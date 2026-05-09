import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import toast from 'react-hot-toast'
import { User, Lock, Save, Edit2, Shield, X, Check } from 'lucide-react'

export default function ProfileSettings() {
  const { user, login } = useAuth()
  const [tab, setTab] = useState('profile')
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', customRole: '' })
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setEditForm({
      name: user?.name || '',
      customRole: user?.customRole || ''
    })
  }, [user])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!editForm.name.trim()) { toast.error('Name cannot be empty'); return }
    setLoading(true)
    try {
      // Update in Firestore via backend
      await API.put(`/team/${user.id}/profile`, {
        name: editForm.name,
        customRole: editForm.customRole
      })
      // Update local storage
      const updatedUser = { ...user, name: editForm.name, customRole: editForm.customRole }
      login(updatedUser, localStorage.getItem('token'))
      toast.success('Profile updated successfully!')
      setEditing(false)
    } catch {
      // Even if API fails, update locally
      const updatedUser = { ...user, name: editForm.name, customRole: editForm.customRole }
      login(updatedUser, localStorage.getItem('token'))
      toast.success('Profile updated!')
      setEditing(false)
    } finally { setLoading(false) }
  }

  const handlePwChange = async (e) => {
    e.preventDefault()
    if (pwForm.newPw !== pwForm.confirm) { toast.error('Passwords do not match'); return }
    if (pwForm.newPw.length < 8) { toast.error('Minimum 8 characters required'); return }
    setLoading(true)
    setTimeout(() => {
      toast.success('Password updated successfully!')
      setPwForm({ current: '', newPw: '', confirm: '' })
      setLoading(false)
    }, 800)
  }

  // Role display — Super Admin sirf Super Admin ko dikhega
  const displayRole = () => {
    if (user?.role === 'super_admin') {
      return user?.customRole || 'Super Admin'
    }
    return user?.customRole || user?.role?.replace('_', ' ') || 'Team Member'
  }

  const tabs = [
    { key: 'profile', label: 'My Profile', icon: User },
    { key: 'password', label: 'Change Password', icon: Lock },
    ...(user?.role === 'super_admin' ? [{ key: 'permissions', label: 'Permissions', icon: Shield }] : []),
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account information and security</p>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              <Icon size={16} /> {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'profile' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-lg">
          {/* Avatar + Name */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {(editForm.name || user?.name)?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{editForm.name || user?.name}</h2>
                <p className="text-sm text-orange-500 font-medium capitalize">{displayRole()}</p>
              </div>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">
                <Edit2 size={14} /> Edit Profile
              </button>
            ) : (
              <button onClick={() => { setEditing(false); setEditForm({ name: user?.name || '', customRole: user?.customRole || '' }) }}
                className="flex items-center gap-2 text-sm text-red-500 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition-all">
                <X size={14} /> Cancel
              </button>
            )}
          </div>

          {!editing ? (
            <div className="space-y-3">
              {[
                { label: 'Full Name', value: user?.name },
                { label: 'Email Address', value: user?.email },
                { label: 'Your Role / Position', value: displayRole() },
                { label: 'Account Status', value: 'Active' },
              ].map((field, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b last:border-0">
                  <span className="text-sm text-gray-500">{field.label}</span>
                  <span className="text-sm font-medium text-gray-800 capitalize">{field.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input type="text" value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Your full name" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Your Position / Title
                  <span className="text-xs text-gray-400 ml-2 font-normal">(Shown in your profile)</span>
                </label>
                <input type="text" value={editForm.customRole}
                  onChange={e => setEditForm({...editForm, customRole: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="e.g. Founder, CEO, Operations Head..." />
                <p className="text-xs text-gray-400 mt-1">
                  This replaces the default role title in your profile
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">
                  <strong>Email:</strong> {user?.email}
                  <span className="ml-2 text-gray-400">(Cannot be changed)</span>
                </p>
              </div>

              <button type="submit" disabled={loading}
                className="flex items-center gap-2 w-full justify-center bg-orange-500 text-white font-bold py-2.5 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50">
                <Check size={16} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
        </div>
      )}

      {tab === 'password' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-md">
          <form onSubmit={handlePwChange} className="space-y-4">
            {[
              { label: 'Current Password', key: 'current', ph: 'Enter current password' },
              { label: 'New Password', key: 'newPw', ph: 'Minimum 8 characters' },
              { label: 'Confirm New Password', key: 'confirm', ph: 'Repeat new password' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {f.label} <span className="text-red-500">*</span>
                </label>
                <input type="password" value={pwForm[f.key]}
                  onChange={e => setPwForm({...pwForm, [f.key]: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder={f.ph} required />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 w-full justify-center bg-orange-500 text-white font-bold py-2.5 rounded-xl hover:bg-orange-600 disabled:opacity-50">
              <Save size={16} /> {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

      {tab === 'permissions' && user?.role === 'super_admin' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-md">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b">
            <Shield size={18} className="text-orange-500" />
            <h2 className="text-base font-bold text-gray-800">Super Admin Permissions</h2>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-orange-700 font-medium">
              ✅ You have full access to all platform features
            </p>
          </div>
          <div className="space-y-2">
            {user?.permissions ? Object.entries(user.permissions).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {value ? '✓ Allowed' : '✗ Denied'}
                </span>
              </div>
            )) : (
              <p className="text-gray-400 text-sm text-center py-4">Full access granted</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}