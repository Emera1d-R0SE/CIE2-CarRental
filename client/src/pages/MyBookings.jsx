import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios'
import { useApp } from '../context/AppContext'
import { dummyMyBookingsData, assets } from '../assets/assets'

const statusStyles = {
  pending: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  confirmed: 'bg-green-50 text-green-600 border-green-200',
  cancelled: 'bg-red-50 text-red-500 border-red-200',
}

const MyBookings = () => {
  const { user } = useApp()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [cancelling, setCancelling] = useState(null) // id of booking being cancelled

  const fetchBookings = () => {
    axios.get('/api/bookings/my')
      .then(({ data }) => { if (data.success) setBookings(data.bookings) })
      .catch(() => setBookings(dummyMyBookingsData))
  }

  useEffect(() => { fetchBookings() }, [])

  if (!user) return <Navigate to="/" replace />

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    setCancelling(id)
    try {
      const { data } = await axios.put(`/api/bookings/${id}/cancel`)
      if (data.success) {
        // Update status locally without refetching
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b))
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setCancelling(null)
    }
  }

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
        <p className="text-gray-400 text-sm mb-8">Track all your car rental bookings</p>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <img src={assets.car_icon} className="h-16 opacity-20 mb-4" alt="" />
            <p className="text-lg font-medium">No bookings yet</p>
            <button onClick={() => navigate('/cars')} className="mt-4 px-6 py-2 bg-primary text-white rounded-full text-sm">Browse Cars</button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b._id} className="bg-white border border-borderColor rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <img src={b.car?.image} alt="car" className="w-full sm:w-32 h-24 object-cover rounded-xl shrink-0" />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800">{b.car?.brand} {b.car?.model}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">{b.car?.category} · {b.car?.location}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <img src={assets.calendar_icon_colored} className="h-4" alt="" />
                      {fmt(b.pickupDate)} → {fmt(b.returnDate)}
                    </span>
                    <span className="font-semibold text-gray-800">${b.price}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border capitalize ${statusStyles[b.status] || statusStyles.pending}`}>
                    {b.status}
                  </span>
                  {b.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      disabled={cancelling === b._id}
                      className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      {cancelling === b._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings
