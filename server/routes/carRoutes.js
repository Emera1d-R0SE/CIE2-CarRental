import express from 'express';
import Car from '../models/Car.js';
import { protect, ownerOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all available cars (with optional filters)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.location) filter.location = req.query.location;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.fuel_type) filter.fuel_type = req.query.fuel_type;
    if (req.query.brand) filter.brand = new RegExp(req.query.brand, 'i');
    const cars = await Car.find(filter).populate('owner', 'name email image');
    res.json({ success: true, cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single car
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('owner', 'name email image');
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create car (owner only)
router.post('/', protect, ownerOnly, async (req, res) => {
  try {
    const car = await Car.create({ ...req.body, owner: req.user._id });
    res.json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update car (owner only)
router.put('/:id', protect, ownerOnly, async (req, res) => {
  try {
    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete car (owner only)
router.delete('/:id', protect, ownerOnly, async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
