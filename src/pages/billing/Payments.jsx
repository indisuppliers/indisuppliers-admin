import { useState, useEffect } from 'react'
import API from '../../api/axios'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showRecord, setShowRecord] = useState(false)
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ orderId: '', sellerId: '', amount: '', paymentType: 'cash', paymentMethod: 'cash', advanceAmount: '', remainingAmount: '', remarks: '' })

  useEffect(() => {
    fetchPayments()
    API.get('/orders/list').then(res => setOrders(res.data.orders || []))
  }, [])

  const fetchPayments = () => {
    API.get('/payments/list').then(res => {
      if (res.data.success) setPayments(res.data.payments)
    }).finally(() => setLoading(false))
  }

  const handleRecord = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/payments/record', form)
      if (res.data.success) { toast.success('✅ Payment recorded!'); setShowRecord(false); fetchPayments() }
    } catch (err) { toast.error(err.response?.data?.message || 'Something went wrong') }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h2 className="text-2xl font-bold text-gray-800">💰 Payments</h2><p className="text-gray-500">Payment history</p></div>
        <button onClick={() => setShowRecord(!showRecord)} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          <Plus size={20} /> Record Payment
        </button>
      </div>

      {showRecord && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">💳 Record Payment</h3>
          <form onSubmit={handleRecord}>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">🛒 Order</label>
                <select value={form.orderId} onChange={e => {
                  const order = orders.find(o => o.orderId === e.target.value)
                  setForm({...form, orderId: e.target.value, sellerId: order?.sellerId || '', amount: order?.finalAmount || ''})
                }} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" required>
                  <option value="">Select order</option>
                  {orders.map(o => <option key={o.id} value={o.orderId}>{o.orderId} — ₹{o.finalAmount}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">💰 Amount ₹</label>
                <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">📋 Payment Type</label>
                <select value={form.paymentType} onChange={e => setForm({...form, paymentType: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="cash">Cash</option>
                  <option value="online">Online (UPI/Bank)</option>
                  <option value="advance">Advance</option>
                  <option value="partial">Partial</option>
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">🏦 Method</label>
                <select value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select></div>
              {(form.paymentType === 'advance' || form.paymentType === 'partial') && (<>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">⬆️ Advance ₹</label>
                  <input type="number" value={form.advanceAmount} onChange={e => setForm({...form, advanceAmount: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">⏳ Remaining ₹</label>
                  <input type="number" value={form.remainingAmount} onChange={e => setForm({...form, remainingAmount: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" /></div>
              </>)}
              <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">📝 Remarks</label>
                <input type="text" value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500" placeholder="Any notes..." /></div>
            </div>
            <div className="flex gap-4 mt-4">
              <button type="submit" className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600">✅ Record</button>
              <button type="button" onClick={() => setShowRecord(false)} className="px-6 bg-gray-100 text-gray-700 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="text-center py-16 text-gray-400">⏳ Loading...</div> :
         payments.length === 0 ? <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-4">💰</p><p>No payments found</p></div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>{['Payment ID', 'Order', 'Amount', 'Type', 'Status'].map(h => (
                <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{p.paymentId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.orderId}</td>
                  <td className="px-6 py-4"><div className="font-bold text-green-600">₹{p.amount}</div>{p.remainingAmount > 0 && <div className="text-xs text-red-400">Remaining: ₹{p.remainingAmount}</div>}</td>
                  <td className="px-6 py-4"><span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{p.paymentType}</span></td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded font-medium ${p.status === 'clear' ? 'bg-green-100 text-green-700' : p.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}