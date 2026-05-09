import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api/axios'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = () => {
    API.get('/products/list').then(res => {
      if (res.data.success) setProducts(res.data.products)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await API.delete(`/products/${productId}`)
      toast.success('Product deleted')
      fetchProducts()
    } catch { toast.error('Something went wrong') }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h2 className="text-2xl font-bold text-gray-800">📦 Products</h2><p className="text-gray-500">All products list</p></div>
        <Link to="/products/add" className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          <Plus size={20} /> Add Product
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="text-center py-16 text-gray-400">⏳ Loading...</div> :
         products.length === 0 ? <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-4">📦</p><p>No products found</p></div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>{['Product', 'Category', 'Price', 'Stock', 'Status', 'Action'].map(h => (
                <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4"><div className="font-medium text-gray-800">{product.name}</div><div className="text-xs text-gray-400">{product.materialType}</div></td>
                  <td className="px-6 py-4 text-gray-600">{product.category}</td>
                  <td className="px-6 py-4"><div className="font-medium text-green-600">₹{product.pricing?.finalPrice?.toFixed(2)}</div><div className="text-xs text-gray-400">MRP: ₹{product.pricing?.sellingPrice}</div></td>
                  <td className="px-6 py-4"><div className="text-gray-600">{product.stock?.readyStock} ready</div><div className="text-xs text-gray-400">{product.stock?.totalStock} total</div></td>
                  <td className="px-6 py-4"><span className={`text-xs px-3 py-1 rounded-full font-medium ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{product.status}</span></td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(product.productId)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
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