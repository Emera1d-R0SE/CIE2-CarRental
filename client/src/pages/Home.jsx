import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { assets, cityList, dummyCarData } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useApp } from '../context/AppContext'

const Home = () => {
  const navigate = useNavigate()
  const { } = useApp()
  const [displayCars, setDisplayCars] = useState(dummyCarData)
  const [search, setSearch] = useState({ location: '', pickupDate: '', returnDate: '' })

  useEffect(() => {
    axios.get('/api/cars')
      .then(({ data }) => {
        if (data.success && data.cars.length > 0) setDisplayCars(data.cars.slice(0, 4))
      })
      .catch(() => {}) // keep dummy data on error
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.location) params.set('location', search.location)
    if (search.pickupDate) params.set('pickupDate', search.pickupDate)
    if (search.returnDate) params.set('returnDate', search.returnDate)
    navigate(`/cars?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-light min-h-[88vh] flex flex-col items-center justify-center px-6 pt-16 pb-0 relative overflow-hidden">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-10">
          Luxury cars on Rent
        </h1>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="bg-white rounded-full shadow-md px-6 py-4 flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl mb-0">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary mb-0.5 flex items-center gap-1">
              Pickup Location <span className="text-gray-400">▾</span>
            </p>
            <select
              value={search.location}
              onChange={e => setSearch({ ...search, location: e.target.value })}
              className="w-full text-sm outline-none text-gray-500 bg-transparent cursor-pointer"
            >
              <option value="">Please select location</option>
              {cityList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="w-px h-10 bg-borderColor hidden sm:block shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 mb-0.5">Pick-up Date</p>
            <input
              type="date"
              value={search.pickupDate}
              onChange={e => setSearch({ ...search, pickupDate: e.target.value })}
              className="w-full text-sm outline-none text-gray-500 bg-transparent"
            />
          </div>
          <div className="w-px h-10 bg-borderColor hidden sm:block shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 mb-0.5">Return Date</p>
            <input
              type="date"
              value={search.returnDate}
              onChange={e => setSearch({ ...search, returnDate: e.target.value })}
              className="w-full text-sm outline-none text-gray-500 bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull text-white px-7 py-3 rounded-full text-sm font-medium transition-all shrink-0 flex items-center gap-2"
          >
            <img src={assets.search_icon} alt="" className="h-4 w-4 brightness-200" />
            Search
          </button>
        </form>

        {/* Car image centered below */}
        <div className="w-full max-w-2xl flex justify-center mt-6">
          <img src={assets.main_car} alt="luxury car" className="w-full max-w-xl object-contain drop-shadow-lg" />
        </div>
      </section>

      {/* Featured Cars */}
      <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Featured Cars</h2>
              <p className="text-gray-400 mt-1">Hand-picked cars just for you</p>
            </div>
            <button onClick={() => navigate('/cars')} className="flex items-center gap-2 text-primary text-sm font-medium hover:underline">
              View all <img src={assets.arrow_icon} className="h-4" alt="" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCars.map(car => <CarCard key={car._id} car={car} />)}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-light px-6 md:px-16 lg:px-24 xl:px-32 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Choose Us</h2>
          <p className="text-gray-400 mb-12">We make car rental simple, affordable and reliable</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: assets.car_icon, title: 'Wide Selection', desc: 'From economy to luxury, we have the perfect car for every need and budget.' },
              { icon: assets.star_icon, title: 'Best Prices', desc: 'Competitive pricing with no hidden fees. Get more value for your money.' },
              { icon: assets.check_icon, title: '24/7 Support', desc: 'Our dedicated support team is always available to assist you anytime.' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-borderColor">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <img src={f.icon} className="h-7" alt="" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">What Our Customers Say</h2>
          <p className="text-gray-400 text-center mb-12">Trusted by thousands of happy renters</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { img: assets.testimonial_image_1, name: 'Sarah Johnson', role: 'Business Traveler', text: 'Amazing service! The car was in perfect condition and the booking process was super smooth. Will definitely use again.' },
              { img: assets.testimonial_image_2, name: 'Michael Chen', role: 'Family Traveler', text: 'Best car rental experience I\'ve had. Great prices, huge selection, and the customer support team was incredibly helpful.' },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-borderColor shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {Array(5).fill(0).map((_, j) => <img key={j} src={assets.star_icon} className="h-4" alt="" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="bg-primary px-6 md:px-16 lg:px-24 xl:px-32 py-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Ready to hit the road?</h2>
            <p className="text-blue-100">Book your car in minutes and drive away today.</p>
          </div>
          <div className="flex items-center gap-4">
            <img src={assets.banner_car_image} alt="car" className="h-24 hidden md:block" />
            <button onClick={() => navigate('/cars')} className="px-8 py-3 bg-white text-primary font-semibold rounded-full hover:bg-blue-50 transition-all shrink-0">
              Book Now
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
