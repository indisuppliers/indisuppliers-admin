import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'
import { UserPlus, Eye, EyeOff } from 'lucide-react'

const ROLES = [
  { value: 'admin', label: 'Admin', desc: 'Full access except super admin functions' },
  { value: 'team_leader', label: 'Team Leader', desc: 'Manage executives, view reports' },
  { value: 'executive', label: 'Executive', desc: 'Onboard sellers, upload products, create orders' },
]

export default function AddStaff() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'executive' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const res = await API.post('/team/add', form)
      if (res.data.success) {
        toast.success('✅ Team member added successfully!')
        navigate('/team')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred')
    } finally { setLoading(false) }
  }

  const Field = ({ label, required, children }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Staff</h1>
        <p className="text-gray-500 text-sm mt-1">Add a new team member to the platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name" required>
                  <input type="text" value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Staff member's full name" required />
                </Field>

                <Field label="Phone Number" required>
                  <input type="tel" value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value.replace(/\D/g,'').slice(0,10)})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="10 digit mobile number" required />
                </Field>
              </div>

              <Field label="Email Address" required>
                <input type="email" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="staff@email.com" required />
              </Field>

              <Field label="Password" required>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none pr-12"
                    placeholder="Minimum 8 characters" required />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Share this password with the staff member</p>
              </Field>

              <Field label="Assign Role" required>
                <div className="space-y-3">
                  {ROLES.map(role => (
                    <label key={role.value}
                      className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${form.role === role.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="role" value={role.value}
                        checked={form.role === role.value}
                        onChange={e => setForm({...form, role: e.target.value})}
                        className="mt-0.5 accent-orange-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{role.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{role.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </Field>

              <div className="flex gap-4 mt-6">
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50">
                  <UserPlus size={18} />
                  {loading ? 'Adding...' : 'Add Staff Member'}
                </button>
                <button type="button" onClick={() => navigate('/team')}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Role Permissions Guide</h3>
            <div className="space-y-3 text-xs text-gray-600">
              {[
                { role: 'Admin', perms: ['Add/Edit sellers', 'Approve verification', 'Manage team', 'View financials', 'Create orders'] },
                { role: 'Team Leader', perms: ['View sellers & products', 'View reports', 'Manage executives', 'Export data'] },
                { role: 'Executive', perms: ['Add sellers', 'Upload products', 'Create orders', 'Record payments'] },
              ].map(r => (
                <div key={r.role} className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-gray-700 mb-2">{r.role}</p>
                  <ul className="space-y-1">
                    {r.perms.map(p => <li key={p} className="flex items-center gap-1"><span className="text-green-500">✓</span> {p}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}