import { useState, useEffect } from 'react'
import API from '../../api/axios'
import toast from 'react-hot-toast'
import { UserCheck, Search } from 'lucide-react'

export default function BlockedSellers() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchBlocked = () => {
    setLoading(true)
    API.get('/sellers/list', { params: { status: 'blocked' } })
      .then(res => { if (res.data.success) setSellers(res.data.sellers) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBlocked() }, [])

  const handleUnblock = async (sellerId, name) => {
    try {
      await API.put(`/sellers/${sellerId}/block`)
      toast.success(`${name} unblocked successfully!`)
      fetchBlocked()
    } catch { toast.error('Error occurred') }
  }

  const filtered = sellers.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) || s.phone?.includes(search)
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blocked Sellers</h1>
        <p className="text-gray-500 text-sm mt-1">Sellers blocked from the platform</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input type="text" placeholder="Search by name or phone..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="text-center py-16 text-gray-400">Loading...</div> :
         filtered.length === 0 ? (
          <div className="text-center py-16">
            <UserCheck size={48} className="mx-auto mb-3 text-green-300" />
            <p className="font-medium text-gray-500">No blocked sellers</p>
            <p className="text-sm text-gray-400 mt-1">All sellers are currently active</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Seller', 'Phone', 'Business Type', 'City', 'Action'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(seller => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{seller.name}</div>
                    <div className="text-xs text-gray-400 font-mono">{seller.sellerId}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{seller.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{seller.businessType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{seller.city}, {seller.state}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleUnblock(seller.sellerId, seller.name)}
                      className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
                      <UserCheck size={14} /> Unblock
                    </button>
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