import { useState, useEffect } from 'react'
import API from '../../api/axios'
import { AlertTriangle, CheckCircle, Package } from 'lucide-react'

export default function StockStatus() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    API.get('/products/list').then(res => {
      if (res.data.success) setProducts(res.data.products)
    }).finally(() => setLoading(false))
  }, [])

  const lowStock = products.filter(p => (p.stock?.readyStock || 0) > 0 && (p.stock?.readyStock || 0) < 10)
  const outOfStock = products.filter(p => (p.stock?.readyStock || 0) === 0)
  const inStock = products.filter(p => (p.stock?.readyStock || 0) >= 10)
  const filtered = filter === 'low' ? lowStock : filter === 'out' ? outOfStock : filter === 'in' ? inStock : products

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock Status</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor inventory levels across all products</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'In Stock', count: inStock.length, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', val: 'in', icon: CheckCircle },
          { label: 'Low Stock', count: lowStock.length, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', val: 'low', icon: AlertTriangle },
          { label: 'Out of Stock', count: outOfStock.length, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', val: 'out', icon: Package },
        ].map(card => {
          const Icon = card.icon
          return (
            <button key={card.val} onClick={() => setFilter(filter === card.val ? 'all' : card.val)}
              className={`${card.bg} border ${card.border} rounded-xl p-5 text-left transition-all ${filter === card.val ? 'ring-2 ring-orange-500' : ''}`}>
              <Icon size={22} className={`${card.color} mb-2`} />
              <p className={`text-2xl font-bold ${card.color}`}>{card.count}</p>
              <p className="text-sm text-gray-600 mt-1">{card.label}</p>
            </button>
          )
        })}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="text-center py-16 text-gray-400">Loading...</div> :
         filtered.length === 0 ? <div className="text-center py-16 text-gray-400">No products found</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>{['Product', 'Category', 'Ready Stock', 'Total Stock', 'Status'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => {
                const ready = p.stock?.readyStock || 0
                const s = ready === 0 ? { label: 'Out of Stock', cls: 'bg-red-100 text-red-700' } :
                           ready < 10 ? { label: 'Low Stock', cls: 'bg-amber-100 text-amber-700' } :
                           { label: 'In Stock', cls: 'bg-green-100 text-green-700' }
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4"><div className="font-medium text-gray-800">{p.name}</div><div className="text-xs text-gray-400">{p.materialType}</div></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.category}</td>
                    <td className="px-6 py-4 text-lg font-bold" style={{color: ready === 0 ? '#dc2626' : ready < 10 ? '#d97706' : '#16a34a'}}>{ready}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.stock?.totalStock || 0}</td>
                    <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${s.cls}`}>{s.label}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}