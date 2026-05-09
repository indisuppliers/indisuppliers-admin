import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'

const MATERIAL_TYPES = ['Glass', 'Iron', 'Steel', 'Brass', 'Wooden', 'Plastic', 'Cloth', 'Other']
const CATEGORIES = ['Metal Products', 'Textile', 'Electronics', 'Food & Beverages', 'Chemical', 'Agricultural', 'Plastic & Rubber', 'Other']

const Field = ({ label, required, hint, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
    {children}
  </div>
)

export default function AddProduct() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [sellers, setSellers] = useState([])
  const [form, setForm] = useState({
    sellerId: '', name: '', category: '', description: '', materialType: '',
    specifications: {},
    pricing: { costPrice: '', sellingPrice: '', discount: 0 },
    stock: { totalStock: '', readyStock: '', orderBased: false }
  })

  useEffect(() => {
    API.get('/sellers/list', { params: { status: 'verified' } }).then(res => {
      if (res.data.success) setSellers(res.data.sellers)
    })
  }, [])

  const finalPrice = form.pricing.sellingPrice
    ? (Number(form.pricing.sellingPrice) * (1 - Number(form.pricing.discount) / 100)).toFixed(2)
    : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await API.post('/products/add', form)
      if (res.data.success) {
        toast.success('✅ Product added successfully!')
        navigate('/products')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upload Product</h1>
        <p className="text-gray-500 text-sm mt-1">Add a new product to the catalog</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl">
        <form onSubmit={handleSubmit}>

          <Field label="Select Seller" required hint="Choose the seller this product belongs to">
            <select value={form.sellerId} onChange={e => setForm({...form, sellerId: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none" required>
              <option value="">Select seller</option>
              {sellers.map(s => <option key={s.id} value={s.sellerId}>{s.name} — {s.city}</option>)}
            </select>
          </Field>

          <Field label="Product Name" required hint="Full product name with specifications">
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="e.g. Stainless Steel Pipe 1 Inch" required />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" required>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none" required>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Material Type" required>
              <select value={form.materialType} onChange={e => setForm({...form, materialType: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none" required>
                <option value="">Select material</option>
                {MATERIAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              rows={2} placeholder="Product description..." />
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Cost Price (₹)" required hint="Purchase price">
              <input type="number" value={form.pricing.costPrice}
                onChange={e => setForm({...form, pricing: {...form.pricing, costPrice: e.target.value}})}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="0" required />
            </Field>
            <Field label="Selling Price (₹)" required hint="Market price">
              <input type="number" value={form.pricing.sellingPrice}
                onChange={e => setForm({...form, pricing: {...form.pricing, sellingPrice: e.target.value}})}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="0" required />
            </Field>
            <Field label="Discount %" hint="0 to 100">
              <input type="number" value={form.pricing.discount} min="0" max="100"
                onChange={e => setForm({...form, pricing: {...form.pricing, discount: e.target.value}})}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="0" />
            </Field>
          </div>

          {finalPrice && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex justify-between items-center">
              <span className="text-sm text-green-700">Final Price after discount:</span>
              <span className="text-lg font-bold text-green-700">₹{finalPrice}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Total Stock" hint="Total inventory available">
              <input type="number" value={form.stock.totalStock}
                onChange={e => setForm({...form, stock: {...form.stock, totalStock: e.target.value}})}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="0" />
            </Field>
            <Field label="Ready Stock" hint="Immediately available">
              <input type="number" value={form.stock.readyStock}
                onChange={e => setForm({...form, stock: {...form.stock, readyStock: e.target.value}})}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="0" />
            </Field>
          </div>

          <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
            <input type="checkbox" id="orderBased" checked={form.stock.orderBased}
              onChange={e => setForm({...form, stock: {...form.stock, orderBased: e.target.checked}})}
              className="w-4 h-4 accent-orange-500" />
            <label htmlFor="orderBased" className="text-sm text-gray-700 cursor-pointer">
              Order-based production (Made on order)
            </label>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50">
              {loading ? '⏳ Uploading...' : '📦 Upload Product'}
            </button>
            <button type="button" onClick={() => navigate('/products')}
              className="px-6 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}