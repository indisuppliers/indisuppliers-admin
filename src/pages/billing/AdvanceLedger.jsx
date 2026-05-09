import { useState, useEffect } from 'react'
import API from '../../api/axios'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'

export default function AdvanceLedger() {
  const [sellers, setSellers] = useState([])
  const [ledgers, setLedgers] = useState({})
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    API.get('/sellers/list', { params: { status: 'verified' } })
      .then(res => { if (res.data.success) setSellers(res.data.sellers) })
      .finally(() => setLoading(false))
  }, [])

  const loadLedger = async (sellerId) => {
    if (ledgers[sellerId]) { setSelected(sellerId); return }
    try {
      const res = await API.get(`/payments/advance/${sellerId}`)
      if (res.data.success) {
        setLedgers(prev => ({ ...prev, [sellerId]: res.data.ledger }))
        setSelected(sellerId)
      }
    } catch {}
  }

  const sel = selected ? ledgers[selected] : null
  const sellerInfo = sellers.find(s => s.sellerId === selected)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Advance Ledger</h1>
        <p className="text-gray-500 text-sm mt-1">Track advance payments given to sellers</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Select Seller</h2>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {loading ? <div className="text-center py-8 text-gray-400 text-sm">Loading...</div> :
             sellers.length === 0 ? <div className="text-center py-8 text-gray-400 text-sm">No verified sellers</div> :
             sellers.map(s => (
              <button key={s.id} onClick={() => loadLedger(s.sellerId)}
                className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors ${selected === s.sellerId ? 'bg-orange-50 border-r-2 border-orange-500' : ''}`}>
                <p className="text-sm font-medium text-gray-800">{s.name}</p>
                <p className="text-xs text-gray-400">{s.city} • {s.businessType}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          {!selected ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center h-64">
              <div className="text-center text-gray-400">
                <Wallet size={40} className="mx-auto mb-3" />
                <p>Select a seller to view their ledger</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Given', value: sel?.advanceGiven || 0, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Total Used', value: sel?.advanceUsed || 0, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
                  { label: 'Balance', value: sel?.advanceBalance || 0, icon: Wallet, color: 'text-green-600', bg: 'bg-green-50' },
                ].map((card, i) => {
                  const Icon = card.icon
                  return (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                      <div className={`${card.bg} p-2 rounded-lg w-fit mb-2`}><Icon size={18} className={card.color} /></div>
                      <p className={`text-xl font-bold ${card.color}`}>₹{(card.value || 0).toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                    </div>
                  )
                })}
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-800 mb-4">{sellerInfo?.name} — Transaction History</h3>
                {!sel?.history?.length ? (
                  <p className="text-gray-400 text-sm text-center py-4">No transactions yet</p>
                ) : (
                  <div className="space-y-2">
                    {sel.history.map((h, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${h.type === 'given' ? 'bg-blue-100' : 'bg-red-100'}`}>
                            {h.type === 'given' ? <TrendingUp size={14} className="text-blue-600" /> : <TrendingDown size={14} className="text-red-600" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 capitalize">{h.type}</p>
                            <p className="text-xs text-gray-400">{h.date?.seconds ? new Date(h.date.seconds * 1000).toLocaleDateString('en-IN') : 'N/A'}</p>
                          </div>
                        </div>
                        <span className={`font-semibold ${h.type === 'given' ? 'text-blue-600' : 'text-red-600'}`}>
                          {h.type === 'given' ? '+' : '-'}₹{(h.amount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}