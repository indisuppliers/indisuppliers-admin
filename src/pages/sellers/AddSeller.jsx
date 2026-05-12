import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'
import { Camera, MapPin } from 'lucide-react'

const BUSINESS_TYPES = ['Supplier & Trader', 'Manufacturer', 'Stockist', 'Shopkeeper', 'Bharatiya (Labour)']
const STATES = ['Uttar Pradesh', 'Delhi', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Punjab', 'Haryana', 'Bihar', 'Madhya Pradesh', 'Tamil Nadu', 'Karnataka', 'West Bengal', 'Andhra Pradesh', 'Telangana', 'Odisha', 'Assam']
const PHOTO_TYPES = [
  { key: 'face', label: "Seller's Face", desc: 'Clear frontal photo of seller' },
  { key: 'shop_entrance', label: 'Shop Entrance', desc: 'External view of shop/factory' },
  { key: 'shop_inside', label: 'Shop Inside', desc: 'Main working area' },
  { key: 'product_setup', label: 'Product/Equipment', desc: 'Evidence of business' },
  { key: 'seller_with_product', label: 'Seller with Product', desc: 'Proof of ownership' },
]

const Field = ({ label, required, children, hint }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
    {children}
  </div>
)

export default function AddSeller() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [photos, setPhotos] = useState({})
  const [form, setForm] = useState({
    name: '', phone: '', email: '', businessType: '',
    state: '', city: '', address: '',
    latitude: '', longitude: '', locationAddress: ''
  })

  const getLocation = () => {
    setLocationLoading(true)
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      setLocationLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setForm(prev => ({ ...prev, latitude: latitude.toFixed(6), longitude: longitude.toFixed(6) }))
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          const data = await res.json()
          setForm(prev => ({ ...prev, locationAddress: data.display_name || `${latitude}, ${longitude}` }))
        } catch {
          setForm(prev => ({ ...prev, locationAddress: `${latitude}, ${longitude}` }))
        }
        toast.success('Location captured!')
        setLocationLoading(false)
      },
      () => {
        toast.error('Location access denied')
        setLocationLoading(false)
      }
    )
  }

  const handlePhotoCapture = (type) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          setPhotos(prev => ({ ...prev, [type]: { file, preview: ev.target.result } }))
          toast.success(`${type.replace('_', ' ')} photo captured!`)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const removePhoto = (type) => {
    setPhotos(prev => { const n = {...prev}; delete n[type]; return n })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.businessType) {
      toast.error('Name, phone and business type are required!')
      return
    }
    setLoading(true)
    try {
      const submitData = {
        ...form,
        livePhotos: Object.keys(photos).map(key => ({
          type: key, fileName: photos[key].file.name, capturedAt: new Date().toISOString()
        }))
      }
      const res = await API.post('/sellers/add', submitData)
      if (res.data.success) {
        toast.success(`✅ Seller added! ID: ${res.data.sellerId}`)
        navigate('/sellers')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Seller</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in seller details to onboard them</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b">Basic Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Seller Name" required hint="Full business name">
                  <input type="text" value={form.name}
                    onChange={e => setForm(prev => ({...prev, name: e.target.value}))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="e.g. Rajesh Kumar Exports" required />
                </Field>

                <Field label="Phone Number" required hint="WhatsApp number preferred">
                  <input type="tel" value={form.phone}
                    onChange={e => setForm(prev => ({...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10)}))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="9876543210" required />
                </Field>
              </div>

              <Field label="Email Address" hint="Optional">
                <input type="email" value={form.email}
                  onChange={e => setForm(prev => ({...prev, email: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="seller@email.com" />
              </Field>

              <Field label="Business Type" required>
                <select value={form.businessType}
                  onChange={e => setForm(prev => ({...prev, businessType: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none" required>
                  <option value="">Select business type</option>
                  {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="State" required>
                  <select value={form.state}
                    onChange={e => setForm(prev => ({...prev, state: e.target.value}))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none" required>
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="City" required>
                  <input type="text" value={form.city}
                    onChange={e => setForm(prev => ({...prev, city: e.target.value}))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Noida, Delhi..." required />
                </Field>
              </div>

              <Field label="Full Address">
                <textarea value={form.address}
                  onChange={e => setForm(prev => ({...prev, address: e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  rows={2} placeholder="Shop/factory full address" />
              </Field>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
                <MapPin size={18} className="text-orange-500" /> Location Verification
              </h2>

              <button type="button" onClick={getLocation} disabled={locationLoading}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 mb-4">
                <MapPin size={16} />
                {locationLoading ? 'Getting Location...' : 'Capture Current Location'}
              </button>

              {form.latitude && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-700 mb-1">✅ Location Captured</p>
                  <p className="text-xs text-green-600">Lat: {form.latitude} | Long: {form.longitude}</p>
                  {form.locationAddress && (
                    <p className="text-xs text-green-600 mt-1 truncate">{form.locationAddress}</p>
                  )}
                  <a href={`https://maps.google.com/?q=${form.latitude},${form.longitude}`}
                    target="_blank" rel="noreferrer"
                    className="text-xs text-blue-600 underline mt-1 inline-block">
                    View on Google Maps →
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-800 mb-1 flex items-center gap-2">
                <Camera size={18} className="text-orange-500" /> Live Photo Verification
              </h2>
              <p className="text-xs text-gray-400 mb-4">5 photos required for verification</p>

              <div className="space-y-3">
                {PHOTO_TYPES.map((pt) => (
                  <div key={pt.key} className="border border-gray-200 rounded-lg overflow-hidden">
                    {photos[pt.key] ? (
                      <div className="relative">
                        <img src={photos[pt.key].preview} alt={pt.label}
                          className="w-full h-28 object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handlePhotoCapture(pt.key)}
                            className="bg-white text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
                            Retake
                          </button>
                          <button type="button" onClick={() => removePhoto(pt.key)}
                            className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                            Remove
                          </button>
                        </div>
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                          ✓ Captured
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => handlePhotoCapture(pt.key)}
                        className="w-full p-3 text-left hover:bg-orange-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Camera size={18} className="text-orange-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">{pt.label}</p>
                            <p className="text-xs text-gray-400">{pt.desc}</p>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 text-center">
                  {Object.keys(photos).length}/5 photos captured
                </p>
                <div className="flex justify-center gap-1 mt-2">
                  {PHOTO_TYPES.map(pt => (
                    <div key={pt.key}
                      className={`w-6 h-1.5 rounded-full ${photos[pt.key] ? 'bg-green-500' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" disabled={loading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 max-w-sm">
            {loading ? '⏳ Adding seller...' : '✅ Add Seller'}
          </button>
          <button type="button" onClick={() => navigate('/sellers')}
            className="px-6 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}