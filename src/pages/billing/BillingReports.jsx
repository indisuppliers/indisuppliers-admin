import { useState, useEffect } from 'react'
import API from '../../api/axios'
import { ShoppingCart, CreditCard, TrendingUp, Wallet } from 'lucide-react'

export default function BillingReports() {
  const [orders, setOrders] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([API.get('/orders/list'), API.get('/payments/list')]).then(([o, p]) => {
      if (o.data.success) setOrders(o.data.orders)
      if (p.data.success) setPayments(p.data.payments)
    }).finally(() => setLoading(false))
  }, [])

  const totalRevenue = orders.reduce((s, o) => s + (o.finalAmount || 0), 0)
  const totalPaid = payments.filter(p => p.status === 'clear').reduce((s, p) => s + (p.amount || 0), 0)
  const totalAdvance = payments.reduce((s, p) => s + (p.advanceAmount || 0), 0)
  const byStatus = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})

  const statCards = [
    { label: 'Total Order Value', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Collected', value: `₹${totalPaid.toLocaleString('en-IN')}`, icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Amount', value: `₹${Math.max(0, totalRevenue - totalPaid).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Advance', value: `₹${totalAdvance.toLocaleString('en-IN')}`, icon: Wallet, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Billing Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Financial overview and payment analytics</p>
      </div>
      {loading ? <div className="text-center py-16 text-gray-400">Loading...</div> : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((card, i) => {
              const Icon = card.icon
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className={`${card.bg} p-3 rounded-lg w-fit mb-3`}><Icon size={20} className={card.color} /></div>
                  <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                </div>
              )
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">Orders by Status</h2>
              <div className="space-y-3">
                {Object.entries(byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{status}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${orders.length ? (count/orders.length)*100 : 0}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-gray-800 w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
                {Object.keys(byStatus).length === 0 && <p className="text-gray-400 text-sm text-center py-4">No orders yet</p>}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">Payment Summary</h2>
              <div className="space-y-3">
                {[
                  { label: 'Cleared', count: payments.filter(p=>p.status==='clear').length, color: 'bg-green-500' },
                  { label: 'Partial', count: payments.filter(p=>p.status==='partial').length, color: 'bg-amber-500' },
                  { label: 'Pending', count: payments.filter(p=>p.status==='pending').length, color: 'bg-red-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-600">{item.label} Payments</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{item.count}</span>
                  </div>
                ))}
                {payments.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No payments yet</p>}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b"><h2 className="text-base font-bold text-gray-800">Recent Payments</h2></div>
            {payments.length === 0 ? <div className="text-center py-8 text-gray-400 text-sm">No payments recorded yet</div> : (
              <table className="w-full">
                <thead className="bg-gray-50"><tr>
                  {['Payment ID','Order','Amount','Type','Status','Date'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {payments.slice(0,10).map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 text-sm">
                      <td className="px-6 py-3 font-mono text-xs text-gray-500">{p.paymentId}</td>
                      <td className="px-6 py-3 text-gray-600 text-xs">{p.orderId}</td>
                      <td className="px-6 py-3 font-semibold text-gray-800">₹{(p.amount||0).toLocaleString('en-IN')}</td>
                      <td className="px-6 py-3"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{p.paymentType}</span></td>
                      <td className="px-6 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status==='clear'?'bg-green-100 text-green-700':p.status==='partial'?'bg-amber-100 text-amber-700':'bg-gray-100 text-gray-600'}`}>{p.status}</span></td>
                      <td className="px-6 py-3 text-gray-400 text-xs">{p.paymentDate?.seconds ? new Date(p.paymentDate.seconds*1000).toLocaleDateString('en-IN') : 'N/A'}</td>
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