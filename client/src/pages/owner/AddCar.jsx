import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { assets, cityList } from '../../assets/assets'

const categories = ['SUV', 'Sedan', 'Hatchback', 'Coupe', 'Truck']
const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
const transmissions = ['Automatic', 'Manual', 'Semi-Automatic']

const AddCar = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    brand: '', model: '', year: '', category: 'SUV',
    seating_capacity: '', fuel_type: 'Petrol', transmission: 'Automatic',
    pricePerDay: '', location: cityList[0], description: '', image: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      let imageUrl = form.image
      // Upload image if file selected
      if (imageFile) {
        const fd = new FormData()
        fd.append('image', imageFile)
        const { data: upData } = await axios.post('/api/upload', fd)
        if (upData.success) imageUrl = upData.url
      }
      const { data } = await axios.post('/api/cars', { ...form, image: imageUrl })
      if (data.success) {
        setMsg('Car added successfully!')
        setTimeout(() => navigate('/owner/manage-cars'), 1200)
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to add car')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full border border-borderColor rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-white"

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Add New Car</h1>
      <p className="text-gray-400 text-sm mb-8">Fill in the details to list your car for rent</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-borderColor p-8 max-w-3xl">
        {/* Image Upload */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600 block mb-2">Car Image</label>
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-borderColor rounded-2xl cursor-pointer hover:border-primary transition-colors overflow-hidden">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" alt="preview" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <img src={assets.upload_icon} className="h-10 opacity-50" alt="" />
                <span className="text-sm">Click to upload image</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
          {!imageFile && (
            <input
              type="url" placeholder="Or paste image URL"
              value={form.image} onChange={e => set('image', e.target.value)}
              className={`${inputCls} mt-2`}
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Brand</label>
            <input required type="text" placeholder="e.g. BMW" value={form.brand}
              onChange={e => set('brand', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Model</label>
            <input required type="text" placeholder="e.g. X5" value={form.model}
              onChange={e => set('model', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Year</label>
            <input required type="number" placeholder="e.g. 2022" min="1990" max="2030"
              value={form.year} onChange={e => set('year', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Seating Capacity</label>
            <input required type="number" placeholder="e.g. 5" min="1" max="15"
              value={form.seating_capacity} onChange={e => set('seating_capacity', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Fuel Type</label>
            <select value={form.fuel_type} onChange={e => set('fuel_type', e.target.value)} className={inputCls}>
              {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Transmission</label>
            <select value={form.transmission} onChange={e => set('transmission', e.target.value)} className={inputCls}>
              {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Price Per Day ($)</label>
            <input required type="number" placeholder="e.g. 150" min="1"
              value={form.pricePerDay} onChange={e => set('pricePerDay', e.target.value)} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-600 block mb-1">Location</label>
            <select value={form.location} onChange={e => set('location', e.target.value)} className={inputCls}>
              {cityList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-600 block mb-1">Description</label>
            <textarea rows={4} placeholder="Describe your car..."
              value={form.description} onChange={e => set('description', e.target.value)}
              className={inputCls + ' resize-none'} />
          </div>
        </div>

        {msg && (
          <p className={`mt-4 text-sm px-4 py-2 rounded-lg ${msg.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {msg}
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <button type="submit" disabled={loading}
            className="px-8 py-3 bg-primary hover:bg-primary-dull text-white font-medium rounded-xl transition-all disabled:opacity-60">
            {loading ? 'Adding...' : 'Add Car'}
          </button>
          <button type="button" onClick={() => navigate('/owner/manage-cars')}
            className="px-8 py-3 border border-borderColor text-gray-600 rounded-xl hover:bg-light transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCar
