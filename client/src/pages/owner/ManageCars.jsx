import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { dummyCarData, assets } from '../../assets/assets'

const ManageCars = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCars = () => {
    axios.get('/api/owner/cars')
      .then(({ data }) => { if (data.success) setCars(data.cars) })
      .catch(() => setCars(dummyCarData))
  }

  useEffect(() => { fetchCars() }, [])

  const toggleAvailability = async (car) => {
    try {
      await axios.put(`/api/cars/${car._id}`, { isAvailable: !car.isAvailable })
      fetchCars()
    } catch { /* ignore */ }
  }

  const deleteCar = async (id) => {
    if (!window.confirm('Delete this car?')) return
    try {
      await axios.delete(`/api/cars/${id}`)
      setCars(prev => prev.filter(c => c._id !== id))
    } catch { /* ignore */ }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Manage Cars</h1>
          <p className="text-gray-400 text-sm">{cars.length} cars listed</p>
        </div>
        <Link to="/owner/add-car" className="px-5 py-2.5 bg-primary hover:bg-primary-dull text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2">
          <img src={assets.addIconColored} className="h-4 brightness-200" alt="" /> Add Car
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-borderColor overflow-hidden">
        {cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <img src={assets.carIcon} className="h-14 opacity-20 mb-3" alt="" />
            <p>No cars listed yet</p>
            <Link to="/owner/add-car" className="mt-4 text-primary text-sm hover:underline">Add your first car →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-light">
                <tr className="text-xs text-gray-400 uppercase">
                  <th className="text-left px-6 py-4">Car</th>
                  <th className="text-left px-6 py-4">Details</th>
                  <th className="text-left px-6 py-4">Price</th>
                  <th className="text-left px-6 py-4">Location</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <tr key={car._id} className="border-t border-borderColor hover:bg-light/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={car.image} alt="" className="w-14 h-10 object-cover rounded-lg shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800">{car.brand} {car.model}</p>
                          <p className="text-xs text-gray-400">{car.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <p>{car.category}</p>
                      <p className="text-xs">{car.fuel_type} · {car.transmission}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">${car.pricePerDay}/day</td>
                    <td className="px-6 py-4 text-gray-500">{car.location}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleAvailability(car)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                          car.isAvailable ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                        }`}>
                        {car.isAvailable ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => deleteCar(car._id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all" title="Delete">
                          <img src={assets.delete_icon} className="h-4" alt="delete" />
                        </button>
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

export default ManageCars
