import { useState, useEffect } from 'react'
import axios from 'axios'
import { dummyDashboardData, assets } from '../../assets/assets'

const fmt = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

const statusStyles = {
  pending: 'bg-yellow-50 text-yellow-600',
  confirmed: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-500',
}

const Dashboard = () => {
  const [data, setData] = useState(dummyDashboardData)

  useEffect(() => {
    axios.get('/api/owner/dashboard')
      .then(({ data: res }) => { if (res.success) setData(res.data) })
      .catch(() => {})
  }, [])

  const stats = [
    { label: 'Total Cars', value: data.totalCars, icon: assets.carIconColored, bg: 'bg-blue-50' },
    { label: 'Total Bookings', value: data.totalBookings, icon: assets.listIconColored, bg: 'bg-purple-50' },
    { label: 'Pending', value: data.pendingBookings, icon: assets.cautionIconColored, bg: 'bg-yellow-50' },
    { label: 'Revenue', value: `$${data.monthlyRevenue}`, icon: assets.dashboardIconColored, bg: 'bg-green-50' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
      <p className="text-gray-400 text-sm mb-8">Overview of your rental business</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-borderColor p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
              <img src={s.icon} className="h-6" alt="" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-borderColor p-6">
        <h2 className="font-semibold text-gray-800 mb-5">Recent Bookings</h2>
        {data.recentBookings?.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b border-borderColor">
                  <th className="text-left py-3 pr-4">Car</th>
                  <th className="text-left py-3 pr-4">User</th>
                  <th className="text-left py-3 pr-4">Dates</th>
                  <th className="text-left py-3 pr-4">Price</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentBookings?.map(b => (
                  <tr key={b._id} className="border-b border-borderColor last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <img src={b.car?.image} className="w-10 h-8 object-cover rounded-lg" alt="" />
                        <span className="font-medium text-gray-700">{b.car?.brand} {b.car?.model}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{b.user?.name || 'User'}</td>
                    <td className="py-3 pr-4 text-gray-500">{fmt(b.pickupDate)} – {fmt(b.returnDate)}</td>
                    <td className="py-3 pr-4 font-medium text-gray-700">${b.price}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[b.status] || statusStyles.pending}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
