import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'
import { Search, Plus, UserCheck, UserX } from 'lucide-react'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  verified: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  blocked: 'bg-gray-100 text-gray-700'
}

export default function SellerList() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchSellers = async () => {
    setLoading(true)
    try {
      const params = {}
      if (statusFilter) params.status = statusFilter
      if (search) params.search = search
      const res = await API.get('/sellers/list', { params })
      if (res.data.success) setSellers(res.data.sellers)
    } catch { toast.error('Failed to load sellers') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSellers() }, [statusFilter])

  const handleBlock = async (sellerId, currentStatus) => {
    try {
      await API.put(`/sellers/${sellerId}/block`)
      toast.success(currentStatus === 'blocked' ? 'Seller unblocked' : 'Seller blocked')
      fetchSellers()
    } catch { toast.error('Something went wrong') }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900">Sellers</h2><p className="text-gray-500 text-sm">All registered sellers</p></div>
        <Link to="/sellers/add" className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          <Plus size={20} /> Add Seller
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search by name or phone..." value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && fetchSellers()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="text-center py-16 text-gray-400">⏳ Loading...</div> :
         sellers.length === 0 ? <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-4">👤</p><p>No sellers found</p></div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Seller', 'Phone', 'Business', 'City', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sellers.map(seller => (
                <tr key={seller.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4"><div className="font-medium text-gray-800">{seller.name}</div><div className="text-xs text-gray-400">{seller.sellerId}</div></td>
                  <td className="px-6 py-4 text-gray-600">{seller.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{seller.businessType}</td>
                  <td className="px-6 py-4 text-gray-600">{seller.city}</td>
                  <td className="px-6 py-4"><span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[seller.status]}`}>{seller.status}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleBlock(seller.sellerId, seller.status)}
                        className={`p-1 rounded ${seller.status === 'blocked' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'}`}>
                        {seller.status === 'blocked' ? <UserCheck size={18} /> : <UserX size={18} />}
                      </button>
                    </div>
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