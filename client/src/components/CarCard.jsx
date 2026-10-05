import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const CarCard = ({ car }) => {
  return (
    <div className="bg-white rounded-2xl border border-borderColor shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative">
        <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover" />
        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
          {car.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg">{car.brand} {car.model}</h3>
        <p className="text-sm text-gray-400 mb-3">{car.year}</p>
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <img src={assets.location_icon} className="h-3.5" alt="" />
            {car.location}
          </span>
          <span className="flex items-center gap-1">
            <img src={assets.fuel_icon} className="h-3.5" alt="" />
            {car.fuel_type}
          </span>
          <span className="flex items-center gap-1">
            <img src={assets.users_icon} className="h-3.5" alt="" />
            {car.seating_capacity} Seats
          </span>
          <span className="flex items-center gap-1">
            <img src={assets.car_icon} className="h-3.5" alt="" />
            {car.transmission}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-primary font-bold text-xl">${car.pricePerDay}</span>
            <span className="text-gray-400 text-sm">/day</span>
          </div>
          <Link
            to={`/cars/${car._id}`}
            className="px-5 py-2 bg-primary hover:bg-primary-dull text-white text-sm font-medium rounded-full transition-all"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CarCard
