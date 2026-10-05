import { useState, useEffect } from 'react'
import axios from 'axios'
import { dummyMyBookingsData, assets } from '../../assets/assets'

const statusStyles = {
  pending: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  confirmed: 'bg-green-50 text-green-600 border-green-200',
  cancelled: 'bg-red-50 text-red-500 border-red-200',
}

const fmt = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

const ManageBookings = () => {
  const [bookings, setBookings] = useState([])

  const fetchBookings = () => {
    axios.get('/api/owner/bookings')
      .then(({ data }) => { if (data.success) setBookings(data.bookings) })
      .catch(() => setBookings(dummyMyBookingsData))
  }

  useEffect(() => { fetchBookings() }, [])

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/owner/bookings/${id}`, { status })
      fetchBookings()
    } catch { /* ignore */ }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Manage Bookings</h1>
      <p className="text-gray-400 text-sm mb-8">{bookings.length} total bookings</p>

      <div className="bg-white rounded-2xl border border-borderColor overflow-hidden">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <img src={assets.listIcon} className="h-14 opacity-20 mb-3" alt="" />
            <p>No bookings yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-light">
                <tr className="text-xs text-gray-400 uppercase">
                  <th className="text-left px-6 py-4">Car</th>
                  <th className="text-left px-6 py-4">Customer</th>
                  <th className="text-left px-6 py-4">Dates</th>
                  <th className="text-left px-6 py-4">Price</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id} className="border-t border-borderColor hover:bg-light/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={b.car?.image} alt="" className="w-14 h-10 object-cover rounded-lg shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800">{b.car?.brand} {b.car?.model}</p>
                          <p className="text-xs text-gray-400">{b.car?.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img src={b.user?.image || assets.user_profile} className="w-7 h-7 rounded-full object-cover" alt="" />
                        <span className="text-gray-700">{b.user?.name || 'User'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <p>{fmt(b.pickupDate)}</p>
                      <p className="text-xs">→ {fmt(b.returnDate)}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">${b.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${statusStyles[b.status] || statusStyles.pending}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(b._id, 'confirmed')}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-all">
                              Confirm
                            </button>
                            <button onClick={() => updateStatus(b._id, 'cancelled')}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-all">
                              Cancel
                            </button>
                          </>
                        )}
                        {b.status !== 'pending' && (
                          <span className="text-xs text-gray-400 italic">No actions</span>
                        )}
                      </div>
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

export default ManageBookings
