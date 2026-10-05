import express from 'express';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import { protect, ownerOnly } from '../middleware/auth.js';

const router = express.Router();

// Get owner's bookings — find by owner field OR by cars owned
router.get('/bookings', protect, ownerOnly, async (req, res) => {
  try {
    // Get all cars owned by this user
    const ownedCars = await Car.find({ owner: req.user._id }).select('_id');
    const ownedCarIds = ownedCars.map(c => c._id);

    // Find bookings where owner matches OR car is one of their cars
    const bookings = await Booking.find({
      $or: [
        { owner: req.user._id },
        { car: { $in: ownedCarIds } }
      ]
    })
      .populate('car')
      .populate('user', 'name email image')
      .sort({ createdAt: -1 });

    // Fix any bookings that have wrong/missing owner field
    await Booking.updateMany(
      { car: { $in: ownedCarIds }, owner: { $ne: req.user._id } },
      { $set: { owner: req.user._id } }
    );

    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update booking status
router.put('/bookings/:id', protect, ownerOnly, async (req, res) => {
  try {
    // Allow update if owner field matches OR if car belongs to this owner
    const ownedCars = await Car.find({ owner: req.user._id }).select('_id');
    const ownedCarIds = ownedCars.map(c => c._id);

    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [{ owner: req.user._id }, { car: { $in: ownedCarIds } }]
      },
      { status: req.body.status, owner: req.user._id },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Dashboard stats
router.get('/dashboard', protect, ownerOnly, async (req, res) => {
  try {
    const ownerId = req.user._id;
    const ownedCars = await Car.find({ owner: ownerId }).select('_id');
    const ownedCarIds = ownedCars.map(c => c._id);

    const [totalCars, bookings] = await Promise.all([
      Car.countDocuments({ owner: ownerId }),
      Booking.find({
        $or: [{ owner: ownerId }, { car: { $in: ownedCarIds } }]
      }).populate('car').populate('user', 'name email image').sort({ createdAt: -1 })
    ]);

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const completedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const monthlyRevenue = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.price, 0);

    res.json({
      success: true,
      data: {
        totalCars, totalBookings, pendingBookings, completedBookings,
        monthlyRevenue, recentBookings: bookings.slice(0, 5)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get owner's cars
router.get('/cars', protect, ownerOnly, async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
