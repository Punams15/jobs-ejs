import Booking from "../models/Booking.js";

// GET all bookings for logged-in user
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.render("bookings/index", { bookings });
  } catch (err) {
    console.error(err);
    req.flash("error", "Cannot fetch bookings");
    res.redirect("/");
  }
};

// Show NEW booking form
export const showNewBookingForm = (req, res) => {
  res.render("bookings/new", { booking: null });
};

// CREATE booking
export const createBooking = async (req, res) => {
  try {
    const { hotelName, location, checkInDate, checkOutDate, guests, price, notes } = req.body;

    const booking = new Booking({
      hotelName,
      location,
      checkInDate,
      checkOutDate,
      guests,
      price,
      notes,
      createdBy: req.user._id,
    });

    await booking.save();
    req.flash("success", "Booking created successfully!");
    res.redirect("/bookings");
  } catch (err) {
    console.error(err);
    req.flash("error", err.message || "Error creating booking");
    res.redirect("/bookings/new");
  }
};

// Show EDIT booking form
export const showEditBookingForm = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.createdBy.toString() !== req.user._id.toString()) {
      req.flash("error", "Unauthorized access");
      return res.redirect("/bookings");
    }

    res.render("bookings/edit", { booking });
  } catch (err) {
    console.error(err);
    req.flash("error", "Cannot load booking");
    res.redirect("/bookings");
  }
};

// UPDATE booking
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.createdBy.toString() !== req.user._id.toString()) {
      req.flash("error", "Unauthorized access");
      return res.redirect("/bookings");
    }

    const { hotelName, location, checkInDate, checkOutDate, guests, price, notes } = req.body;

    booking.hotelName = hotelName;
    booking.location = location;
    booking.checkInDate = checkInDate;
    booking.checkOutDate = checkOutDate;
    booking.guests = guests;
    booking.price = price;
    booking.notes = notes;

    await booking.save();

    req.flash("success", "Booking updated successfully!");
    res.redirect("/bookings");
  } catch (err) {
    console.error(err);
    req.flash("error", err.message || "Error updating booking");
    res.redirect("/bookings");
  }
};

// DELETE booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.createdBy.toString() !== req.user._id.toString()) {
      req.flash("error", "Unauthorized access");
      return res.redirect("/bookings");
    }

    await booking.deleteOne();
    req.flash("success", "Booking deleted successfully!");
    res.redirect("/bookings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Error deleting booking");
    res.redirect("/bookings");
  }
};


