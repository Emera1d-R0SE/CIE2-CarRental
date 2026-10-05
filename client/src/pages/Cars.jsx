import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { dummyCarData, assets } from '../assets/assets'
import CarCard from '../components/CarCard'

const categories = ['All', 'SUV', 'Sedan', 'Hatchback', 'Coupe', 'Truck']
const fuelTypes = ['All', 'Petrol', 'Diesel', 'Hybrid', 'Electric']
const locations = ['All', 'New York', 'Los Angeles', 'Houston', 'Chicago']

const Cars = () => {
  const [searchParams] = useSearchParams()
  const [allCars, setAllCars] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [filters, setFilters] = useState({
    category: 'All',
    fuel_type: 'All',
    location: searchParams.get('location') || 'All',
    brand: '',
    maxPrice: 1000,
  })
  const [showFilter, setShowFilter] = useState(false)

  // Fetch directly from API every time this page mounts
  useEffect(() => {
    axios.get('/api/cars')
      .then(({ data }) => {
        if (data.success) setAllCars(data.cars)
        else setAllCars(dummyCarData)
      })
      .catch(() => setAllCars(dummyCarData))
      .finally(() => setLoaded(true))
  }, [])

  const filtered = allCars.filter(car => {
    if (filters.category !== 'All' && car.category !== filters.category) return false
    if (filters.fuel_type !== 'All' && car.fuel_type !== filters.fuel_type) return false
    if (filters.location !== 'All' && car.location !== filters.location) return false
    if (filters.brand && !car.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false
    if (car.pricePerDay > filters.maxPrice) return false
    return true
  })

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Available Cars</h1>
            <p className="text-gray-400 text-sm mt-1">{loaded ? `${filtered.length} cars found` : 'Loading...'}</p>
          </div>
          <button onClick={() => setShowFilter(!showFilter)} className="flex items-center gap-2 text-sm border border-borderColor px-4 py-2 rounded-xl hover:bg-light md:hidden">
            <img src={assets.filter_icon} className="h-4" alt="" /> Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`w-64 shrink-0 ${showFilter ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white rounded-2xl border border-borderColor p-6 sticky top-4">
              <h3 className="font-semibold text-gray-800 mb-5">Filters</h3>

              <div className="mb-5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Brand</label>
                <input
                  type="text" placeholder="e.g. BMW"
                  value={filters.brand}
                  onChange={e => setFilters({ ...filters, brand: e.target.value })}
                  className="w-full border border-borderColor rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="mb-5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Category</label>
                <div className="flex flex-col gap-1">
                  {categories.map(c => (
                    <button key={c} onClick={() => setFilters({ ...filters, category: c })}
                      className={`text-left text-sm px-3 py-1.5 rounded-lg transition-all ${filters.category === c ? 'bg-primary text-white' : 'hover:bg-light text-gray-600'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Fuel Type</label>
                <div className="flex flex-col gap-1">
                  {fuelTypes.map(f => (
                    <button key={f} onClick={() => setFilters({ ...filters, fuel_type: f })}
                      className={`text-left text-sm px-3 py-1.5 rounded-lg transition-all ${filters.fuel_type === f ? 'bg-primary text-white' : 'hover:bg-light text-gray-600'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Location</label>
                <select
                  value={filters.location}
                  onChange={e => setFilters({ ...filters, location: e.target.value })}
                  className="w-full border border-borderColor rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div className="mb-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                  Max Price: <span className="text-primary font-semibold">${filters.maxPrice}/day</span>
                </label>
                <input type="range" min={50} max={1000} step={10}
                  value={filters.maxPrice}
                  onChange={e => setFilters({ ...filters, maxPrice: +e.target.value })}
                  className="w-full accent-primary"
                />
              </div>

              <button
                onClick={() => setFilters({ category: 'All', fuel_type: 'All', location: 'All', brand: '', maxPrice: 1000 })}
                className="w-full mt-4 text-sm text-primary border border-primary rounded-lg py-2 hover:bg-primary hover:text-white transition-all"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Car grid */}
          <div className="flex-1">
            {!loaded ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <img src={assets.car_icon} className="h-16 opacity-30 mb-4" alt="" />
                <p className="text-lg font-medium">No cars match your filters</p>
                <p className="text-sm">Try adjusting or clearing the filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(car => <CarCard key={car._id} car={car} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cars
