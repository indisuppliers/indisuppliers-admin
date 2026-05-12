import { useState, useEffect } from "react"
import API from "../../api/axios"
import { Database, Phone, Image } from "lucide-react"

export default function SyncedData() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    API.get("/sync/overview").then(res => {
      if (res.data.success) setData(res.data.data)
    }).finally(() => setLoading(false))
  }, [])

  const contactsData = data.filter(d => d.dataType === "contacts")
  const galleryData = data.filter(d => d.dataType === "gallery_metadata")

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Synced Data</h1>
        <p className="text-gray-500 text-sm mt-1">Seller app se collected data</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Synced", value: data.length, icon: Database, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "With Contacts", value: contactsData.length, icon: Phone, color: "text-green-600", bg: "bg-green-50" },
          { label: "With Gallery", value: galleryData.length, icon: Image, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className={`${card.bg} p-3 rounded-lg w-fit mb-3`}><Icon size={20} className={card.color} /></div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
            <Phone size={16} className="text-green-600" />
            <h2 className="text-sm font-bold text-gray-800">Contacts ({contactsData.length})</h2>
          </div>
          <div className="divide-y max-h-80 overflow-y-auto">
            {loading ? <div className="text-center py-8 text-gray-400 text-sm">Loading...</div> :
             contactsData.length === 0 ? <div className="text-center py-8 text-gray-400 text-sm">No contacts synced yet</div> :
             contactsData.map((item, i) => (
              <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(item)}>
                <p className="text-sm font-medium text-gray-800">{item.sellerId}</p>
                <p className="text-xs text-gray-400">{item.totalContacts} contacts</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
            <Image size={16} className="text-purple-600" />
            <h2 className="text-sm font-bold text-gray-800">Gallery ({galleryData.length})</h2>
          </div>
          <div className="divide-y max-h-80 overflow-y-auto">
            {loading ? <div className="text-center py-8 text-gray-400 text-sm">Loading...</div> :
             galleryData.length === 0 ? <div className="text-center py-8 text-gray-400 text-sm">No gallery data yet</div> :
             galleryData.map((item, i) => (
              <div key={i} className="px-4 py-3 hover:bg-gray-50">
                <p className="text-sm font-medium text-gray-800">{item.sellerId}</p>
                <p className="text-xs text-gray-400">{item.totalPhotos} photos</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-96 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-gray-800">Contacts — {selected.sellerId}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">x</button>
            </div>
            <div className="space-y-2">
              {selected.contacts?.slice(0, 50).map((c, i) => (
                <div key={i} className="flex justify-between text-sm py-1 border-b">
                  <span className="text-gray-700">{c.name || "Unknown"}</span>
                  <span className="text-gray-500 font-mono">{c.number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
