import { useState, useEffect } from 'react'
import API from '../../api/axios'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'

const STATUS_COLORS = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', delivered: 'bg-green-100 text-green-700', returned: 'bg-red-100 text-red-700' }

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [sellers, setSellers] = useState([])
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ sellerId: '', productId: '', quantity: '', unitPrice: '', discount: 0, notes: '' })

  useEffect(() => {
    fetchOrders()
    API.get('/sellers/list', { params: { status: 'verified' } }).then(res => setSellers(res.data.sellers || []))
  }, [])

  const fetchOrders = () => {
    API.get('/orders/list').then(res => {
      if (res.data.success) setOrders(res.data.orders)
    }).finally(() => setLoading(false))
  }

  const handleSellerChange = (sellerId) => {
    setForm({...form, sellerId, productId: ''})
    if (sellerId) API.get('/products/list', { params: { sellerId } }).then(res => setProducts(res.data.products || []))
  }

  const totalAmount = Number(form.quantity) * Number(form.unitPrice)
  const discountAmt = totalAmount * Number(form.discount) / 100
  const finalAmount = totalAmount - discountAmt

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/orders/create', form)
      if (res.data.success) {
        toast.success(`✅ Order created! ID: ${res.data.orderId}`)
        setShowCreate(false); fetchOrders()
        setForm({ sellerId: '', productId: '', quantity: '', unitPrice: '', discount: 0, notes: '' })
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Something went wrong') }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h2 className="text-2xl font-bold text-gray-800">🛒 Orders</h2><p className="text-gray-500">Track all orders</p></div>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          <Plus size={20} /> New Order
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">➕ Create New Order</h3>
          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">👉 Select Seller</label>
                <select value={form.sellerId} onChange={e => handleSellerChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" required>
                  <option value="">Select seller</option>
                  {sellers.map(s => <option key={s.id} value={s.sellerId}>{s.name}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">📦 Select Product</label>
                <select value={form.productId} onChange={e => setForm({...form, productId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" required>
                  <option value="">Select product</option>
                  {products.map(p => <option key={p.id} value={p.productId}>{p.name} — ₹{p.pricing?.sellingPrice}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">📊 Quantity</label>
                <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter quantity" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">💰 Unit Price ₹</label>
                <input type="number" value={form.unitPrice} onChange={e => setForm({...form, unitPrice: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" placeholder="Price per unit" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">🏷️ Discount %</label>
                <input type="number" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" placeholder="0" min="0" max="100" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">📝 Notes</label>
                <input type="text" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" placeholder="Any special instructions" /></div>
            </div>
            {form.quantity && form.unitPrice && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4 grid grid-cols-3 gap-4 text-center">
                <div><p className="text-xs text-gray-500">Total</p><p className="font-bold">₹{totalAmount.toFixed(2)}</p></div>
                <div><p className="text-xs text-gray-500">Discount</p><p className="font-bold text-red-500">-₹{discountAmt.toFixed(2)}</p></div>
                <div><p className="text-xs text-gray-500">Final</p><p className="font-bold text-green-600 text-lg">₹{finalAmount.toFixed(2)}</p></div>
              </div>
            )}
            <div className="flex gap-4 mt-4">
              <button type="submit" className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600">✅ Create Order</button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-6 bg-gray-100 text-gray-700 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="text-center py-16 text-gray-400">⏳ Loading...</div> :
         orders.length === 0 ? <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-4">🛒</p><p>No orders found</p></div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>{['Order ID', 'Seller', 'Qty', 'Final Amount', 'Status', 'Date'].map(h => (
                <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{order.orderId}</td>
                  <td className="px-6 py-4 text-gray-800">{order.sellerId}</td>
                  <td className="px-6 py-4 text-gray-600">{order.quantity}</td>
                  <td className="px-6 py-4 font-bold text-green-600">₹{order.finalAmount?.toFixed(2)}</td>
                  <td className="px-6 py-4"><span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>{order.status}</span></td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{order.orderDate?.seconds ? new Date(order.orderDate.seconds * 1000).toLocaleDateString('en-IN') : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}