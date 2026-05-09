import { useState, useEffect } from 'react'
import API from '../../api/axios'
import { Download, FileText } from 'lucide-react'

export default function Invoices() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/orders/list').then(res => {
      if (res.data.success) setOrders(res.data.orders)
    }).finally(() => setLoading(false))
  }, [])

  const printInvoice = (order) => {
    const w = window.open('', '_blank')
    w.document.write(`
      <html><head><title>Invoice - ${order.orderId}</title>
      <style>
        body{font-family:Arial,sans-serif;padding:40px;color:#333}
        .header{display:flex;justify-content:space-between;border-bottom:2px solid #f97316;padding-bottom:20px;margin-bottom:20px}
        .company{font-size:24px;font-weight:bold;color:#f97316}
        .invoice-title{font-size:28px;color:#333;text-align:right}
        table{width:100%;border-collapse:collapse;margin:20px 0}
        th{background:#f97316;color:white;padding:10px;text-align:left}
        td{padding:10px;border-bottom:1px solid #eee}
        .total{font-size:20px;font-weight:bold;color:#f97316;text-align:right;padding:10px}
        .footer{margin-top:40px;text-align:center;color:#999;font-size:12px}
      </style></head><body>
      <div class="header">
        <div><div class="company">IndiSuppliers</div><div style="color:#666;font-size:14px">B2B Marketplace Platform</div></div>
        <div><div class="invoice-title">INVOICE</div><div style="color:#666;font-size:14px;text-align:right">#${order.orderId}</div></div>
      </div>
      <table>
        <tr><td><b>Seller ID:</b> ${order.sellerId}</td><td><b>Order Date:</b> ${order.orderDate?.seconds ? new Date(order.orderDate.seconds*1000).toLocaleDateString('en-IN') : 'N/A'}</td></tr>
        <tr><td><b>Order Status:</b> ${order.status}</td><td><b>Payment Status:</b> ${order.paymentStatus||'pending'}</td></tr>
      </table>
      <table>
        <thead><tr><th>Product</th><th>Quantity</th><th>Unit Price</th><th>Discount</th><th>Final Amount</th></tr></thead>
        <tbody><tr>
          <td>${order.productId}</td><td>${order.quantity}</td>
          <td>₹${order.unitPrice}</td><td>₹${(order.discount||0).toFixed(2)}</td>
          <td><b>₹${(order.finalAmount||0).toFixed(2)}</b></td>
        </tr></tbody>
      </table>
      <div class="total">Total Amount: ₹${(order.finalAmount||0).toFixed(2)}</div>
      <div class="footer">Thank you for doing business with IndiSuppliers<br>Connecting Indian Suppliers</div>
      </body></html>`)
    w.document.close()
    w.print()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="text-gray-500 text-sm mt-1">Generate and print invoices for all orders</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <div className="text-center py-16 text-gray-400">Loading...</div> :
         orders.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={48} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1">Invoices will appear here once orders are created</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>{['Invoice #', 'Seller', 'Amount', 'Date', 'Status', 'Payment', 'Action'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{order.orderId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.sellerId}</td>
                  <td className="px-6 py-4 font-bold text-green-600">₹{(order.finalAmount||0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{order.orderDate?.seconds ? new Date(order.orderDate.seconds*1000).toLocaleDateString('en-IN') : 'N/A'}</td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${order.status==='delivered'?'bg-green-100 text-green-700':order.status==='confirmed'?'bg-blue-100 text-blue-700':'bg-amber-100 text-amber-700'}`}>{order.status}</span></td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${order.paymentStatus==='clear'?'bg-green-100 text-green-700':order.paymentStatus==='partial'?'bg-amber-100 text-amber-700':'bg-gray-100 text-gray-600'}`}>{order.paymentStatus||'pending'}</span></td>
                  <td className="px-6 py-4">
                    <button onClick={() => printInvoice(order)} className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors">
                      <Download size={14} /> Print
                    </button>
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
