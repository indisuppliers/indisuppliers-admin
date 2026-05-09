import { useState, useEffect } from 'react'
import API from '../../api/axios'
import { Users, UserCheck, Clock, UserX, BarChart3 } from 'lucide-react'

export default function SellerReports() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/sellers/list').then(res => {
      if (res.data.success) setSellers(res.data.sellers)
    }).finally(() => setLoading(false))
  }, [])

  const stats = {
    total: sellers.length,
    verified: sellers.filter(s => s.status === 'verified').length,
    pending: sellers.filter(s => s.status === 'pending').length,
    blocked: sellers.filter(s => s.status === 'blocked').length,
  }

  const byBusiness = sellers.reduce((acc, s) => {
    if (s.businessType) acc[s.businessType] = (acc[s.businessType] || 0) + 1
    return acc
  }, {})

  const byState = sellers.reduce((acc, s) => {
    if (s.state) acc[s.state] = (acc[s.state] || 0) + 1
    return acc
  }, {})

  const statCards = [
    { label: 'Total Sellers', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Verified', value: stats.verified, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Blocked', value: stats.blocked, icon: UserX, color: 'text-red-600', bg: 'bg-red-50' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Seller Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Analytics and insights about sellers</p>
      </div>
      {loading ? <div className="text-center py-16 text-gray-400">Loading...</div> : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((card, i) => {
              const Icon = card.icon
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className={`${card.bg} p-3 rounded-lg w-fit mb-3`}><Icon size={20} className={card.color} /></div>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                </div>
              )
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-orange-500" /> By Business Type
              </h2>
              <div className="space-y-3">
                {Object.entries(byBusiness).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{type}</span>
                      <span className="font-semibold text-gray-800">{count}</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${stats.total ? (count / stats.total) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
                {Object.keys(byBusiness).length === 0 && <p className="text-gray-400 text-sm text-center py-4">No data yet</p>}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-500" /> By State
              </h2>
              <div className="space-y-3">
                {Object.entries(byState).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([state, count]) => (
                  <div key={state}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{state}</span>
                      <span className="font-semibold text-gray-800">{count}</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.total ? (count / stats.total) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
                {Object.keys(byState).length === 0 && <p className="text-gray-400 text-sm text-center py-4">No data yet</p>}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b"><h2 className="text-base font-bold text-gray-800">All Sellers</h2></div>
            {sellers.length === 0 ? <div className="text-center py-8 text-gray-400 text-sm">No sellers yet</div> : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>{['Name', 'Phone', 'Business', 'City', 'Status', 'Joined'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sellers.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 text-sm">
                      <td className="px-6 py-3 font-medium text-gray-800">{s.name}</td>
                      <td className="px-6 py-3 text-gray-600">{s.phone}</td>
                      <td className="px-6 py-3 text-gray-600">{s.businessType}</td>
                      <td className="px-6 py-3 text-gray-600">{s.city}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.status === 'verified' ? 'bg-green-100 text-green-700' : s.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-400 text-xs">{s.createdAt?.seconds ? new Date(s.createdAt.seconds * 1000).toLocaleDateString('en-IN') : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}