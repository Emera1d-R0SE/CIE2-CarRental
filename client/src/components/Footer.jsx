import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-8 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
        <div>
          <img src={assets.logo} alt="logo" className="h-9 mb-4 brightness-200" />
          <p className="text-sm leading-relaxed text-gray-400">
            Your trusted partner for hassle-free car rentals. Drive the car you love at the best prices.
          </p>
          <div className="flex gap-4 mt-5">
            <a href="#" aria-label="Facebook"><img src={assets.facebook_logo} alt="facebook" className="h-5 opacity-70 hover:opacity-100 transition-opacity" /></a>
            <a href="#" aria-label="Instagram"><img src={assets.instagram_logo} alt="instagram" className="h-5 opacity-70 hover:opacity-100 transition-opacity" /></a>
            <a href="#" aria-label="Twitter"><img src={assets.twitter_logo} alt="twitter" className="h-5 opacity-70 hover:opacity-100 transition-opacity" /></a>
          </div>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/cars" className="hover:text-white transition-colors">Browse Cars</Link></li>
            <li><Link to="/my-bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <img src={assets.gmail_logo} alt="email" className="h-4 opacity-70" />
              support@carental.com
            </li>
            <li className="flex items-center gap-2">
              <img src={assets.location_icon} alt="location" className="h-4 opacity-70" />
              New York, USA
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} CarRental. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
