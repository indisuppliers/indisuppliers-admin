import { useState, useEffect } from 'react'
import API from '../../api/axios'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle } from 'lucide-react'

export default function VerificationQueue() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    API.get('/sellers/verification/queue').then(res => {
      if (res.data.success) setSellers(res.data.sellers)
    }).finally(() => setLoading(false))
  }, [])

  const handleApprove = async (sellerId, sellerName) => {
    try {
      const res = await API.put(`/sellers/${sellerId}/approve`)
      if (res.data.success) {
        toast.success(`✅ ${sellerName} approved!\n🔑 Key: ${res.data.uniqueKey}`, { duration: 8000 })
        setSellers(sellers.filter(s => s.sellerId !== sellerId))
      }
    } catch { toast.error('Something went wrong') }
  }

  const handleReject = async (sellerId) => {
    if (!rejectReason) { toast.error('Please provide a reason for rejection'); return }
    try {
      await API.put(`/sellers/${sellerId}/reject`, { reason: rejectReason })
      toast.success('Seller rejected')
      setSellers(sellers.filter(s => s.sellerId !== sellerId))
      setSelectedSeller(null); setRejectReason('')
    } catch { toast.error('Something went wrong') }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">✅ Verification Queue</h2>
        <p className="text-gray-500">Waiting for approval ({sellers.length})</p>
      </div>
      {loading ? <div className="text-center py-16 text-gray-400">⏳ Loading...</div> :
       sellers.length === 0 ? <div className="bg-white rounded-xl p-16 text-center text-gray-400"><p className="text-4xl mb-4">✅</p><p>No pending verifications</p></div> : (
        <div className="space-y-4">
          {sellers.map(seller => (
            <div key={seller.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{seller.name}</h3>
                  <p className="text-gray-500">{seller.phone} • {seller.businessType}</p>
                  <p className="text-sm text-gray-400">{seller.city}, {seller.state}</p>
                  <p className="text-xs text-gray-400 mt-1 font-mono">ID: {seller.sellerId}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleApprove(seller.sellerId, seller.name)}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button onClick={() => setSelectedSeller(seller.sellerId)}
                    className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200">
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              </div>
              {selectedSeller === seller.sellerId && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-700 mb-2">Reason for rejection:</p>
                  <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                    className="w-full border border-red-300 rounded-lg p-3 text-sm outline-none" rows={2}
                    placeholder="Invalid document / Photo not clear..." />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleReject(seller.sellerId)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm">Reject</button>
                    <button onClick={() => setSelectedSeller(null)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}