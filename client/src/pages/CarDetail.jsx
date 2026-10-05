import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useApp } from '../context/AppContext'
import { assets } from '../assets/assets'

const CarDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, setShowLogin } = useApp()
  const [car, setCar] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [form, setForm] = useState({ pickupDate: '', returnDate: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setCar(null)
    setNotFound(false)
    axios.get(`/api/cars/${id}`)
      .then(({ data }) => {
        if (data.success) setCar(data.car)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
  }, [id])

  if (notFound) return (
    <div className="flex flex-col items-center justify-center min-h-64 py-20 text-gray-400">
      <img src={assets.car_icon} className="h-16 opacity-20 mb-4" alt="" />
      <p className="text-lg font-medium">Car not found</p>
      <button onClick={() => navigate('/cars')} className="mt-4 text-primary text-sm hover:underline">Browse available cars</button>
    </div>
  )

  if (!car) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  )

  const days = form.pickupDate && form.returnDate
    ? Math.max(1, Math.ceil((new Date(form.returnDate) - new Date(form.pickupDate)) / 86400000))
    : 1
  const total = days * car.pricePerDay

  const handleBook = async (e) => {
    e.preventDefault()
    if (!user) { setShowLogin(true); return }
    if (!form.pickupDate || !form.returnDate) { setMsg('Please select both dates'); return }
    if (new Date(form.returnDate) < new Date(form.pickupDate)) { setMsg('Return date must be after pickup date'); return }
    setLoading(true)
    setMsg('')
    try {
      const { data } = await axios.post('/api/bookings', {
        carId: car._id, pickupDate: form.pickupDate, returnDate: form.returnDate
      })
      if (data.success) {
        setMsg('Booking confirmed! ✓')
        setTimeout(() => navigate('/my-bookings'), 1500)
      } else {
        setMsg(data.message || 'Booking failed')
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary text-sm mb-6 transition-colors">
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: car info */}
          <div>
            <div className="rounded-2xl overflow-hidden border border-borderColor mb-6">
              <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-72 object-cover" />
            </div>

            <div className="bg-white rounded-2xl border border-borderColor p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{car.brand} {car.model}</h1>
                  <p className="text-gray-400 text-sm mt-1">{car.year} · {car.category}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">${car.pricePerDay}</span>
                  <span className="text-gray-400 text-sm">/day</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: assets.location_icon, label: 'Location', val: car.location },
                  { icon: assets.fuel_icon, label: 'Fuel Type', val: car.fuel_type },
                  { icon: assets.users_icon, label: 'Seats', val: `${car.seating_capacity} Persons` },
                  { icon: assets.car_icon, label: 'Transmission', val: car.transmission },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 bg-light rounded-xl p-3">
                    <img src={s.icon} className="h-5 w-5 shrink-0" alt="" />
                    <div>
                      <p className="text-xs text-gray-400">{s.label}</p>
                      <p className="text-sm font-medium text-gray-700">{s.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {car.description && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{car.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: booking form */}
          <div>
            <div className="bg-white rounded-2xl border border-borderColor p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Book This Car</h2>
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Pickup Date</label>
                  <div className="flex items-center gap-2 border border-borderColor rounded-xl px-4 py-3">
                    <img src={assets.calendar_icon_colored} className="h-4" alt="" />
                    <input
                      type="date" required
                      min={new Date().toISOString().split('T')[0]}
                      value={form.pickupDate}
                      onChange={e => setForm({ ...form, pickupDate: e.target.value })}
                      className="flex-1 text-sm outline-none bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Return Date</label>
                  <div className="flex items-center gap-2 border border-borderColor rounded-xl px-4 py-3">
                    <img src={assets.calendar_icon_colored} className="h-4" alt="" />
                    <input
                      type="date" required
                      min={form.pickupDate || new Date().toISOString().split('T')[0]}
                      value={form.returnDate}
                      onChange={e => setForm({ ...form, returnDate: e.target.value })}
                      className="flex-1 text-sm outline-none bg-transparent"
                    />
                  </div>
                </div>

                {form.pickupDate && form.returnDate && (
                  <div className="bg-light rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${car.pricePerDay}/day × {days} day{days > 1 ? 's' : ''}</span>
                      <span>${total}</span>
                    </div>
                    <div className="border-t border-borderColor pt-2 flex justify-between font-semibold text-gray-800">
                      <span>Total</span>
                      <span className="text-primary">${total}</span>
                    </div>
                  </div>
                )}

                {msg && (
                  <p className={`text-sm px-3 py-2 rounded-lg ${msg.includes('✓') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {msg}
                  </p>
                )}

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 bg-primary hover:bg-primary-dull text-white font-semibold rounded-xl transition-all disabled:opacity-60"
                >
                  {loading ? 'Booking...' : user ? 'Book Now' : 'Login to Book'}
                </button>
              </form>

              <div className="mt-6 flex items-start gap-3 bg-blue-50 rounded-xl p-4">
                <img src={assets.check_icon} className="h-5 mt-0.5 shrink-0" alt="" />
                <div className="text-xs text-blue-700">
                  <p className="font-semibold mb-0.5">Free cancellation</p>
                  <p>Cancel up to 24 hours before pickup for a full refund.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetail
