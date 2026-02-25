import express from 'express';
import isAuth from '../middleware/isAuth.js';

import {
  getAllBookings,
  showNewBookingForm,
  createBooking,
  showEditBookingForm,
  updateBooking,
  deleteBooking
} from '../controllers/bookingController.js';


const router = express.Router();

// List all bookings
router.get('/', isAuth, getAllBookings);

// Show new booking form
router.get('/new', isAuth, showNewBookingForm);

// Create a new booking
router.post('/', isAuth, createBooking);

// Show edit booking form
router.get('/edit/:id', isAuth, showEditBookingForm);

// Update booking
router.post('/edit/:id', isAuth, updateBooking);

// Delete booking
router.post('/delete/:id', isAuth, deleteBooking);

export default router;

