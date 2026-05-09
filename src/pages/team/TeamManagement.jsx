import { useState, useEffect } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'

export default function TeamManagement() {
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'executive' })

  const fetchMembers = () => {
    API.get('/team/list').then(res => {
      if (res.data.success) setMembers(res.data.members)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchMembers() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/team/add', form)
      if (res.data.success) {
        toast.success('✅ Team member added!')
        setShowAdd(false)
        fetchMembers()
        setForm({ name: '', email: '', phone: '', password: '', role: 'executive' })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  const ROLE_COLORS = {
    super_admin: 'bg-red-100 text-red-700',
    admin: 'bg-purple-100 text-purple-700',
    team_leader: 'bg-blue-100 text-blue-700',
    executive: 'bg-green-100 text-green-700'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👥 Team Management</h2>
          <p className="text-gray-500">Manage your team</p>
        </div>
        {user?.role === 'super_admin' && (
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
            <Plus size={20} /> Add Member
          </button>
        )}
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">➕ Add New Member</h3>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">👤 Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📧 Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📱 Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🔒 Password</label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">🛡️ Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="executive">Executive</option>
                  <option value="team_leader">Team Leader</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button type="submit" className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600">✅ Add</button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-6 bg-gray-100 text-gray-700 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="text-center py-16 text-gray-400">⏳ Loading...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>{['Member', 'Contact', 'Role', 'Status'].map(h => (
                <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{m.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{m.email}</div>
                    <div className="text-xs text-gray-400">{m.phone}</div>
                  </td>
                  <td className="px-6 py-4"><span className={`text-xs px-3 py-1 rounded-full font-medium ${ROLE_COLORS[m.role] || 'bg-gray-100 text-gray-700'}`}>{m.role}</span></td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}