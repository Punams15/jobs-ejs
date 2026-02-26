// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Show login form
export const showLogin = (req, res) => {
  res.render('auth/login', { csrfToken: req.csrfToken() });
};

// Show register form
export const showRegister = (req, res) => {
  res.render('auth/register', { csrfToken: req.csrfToken() });
};

// Handle registration
export const doRegister = async (req, res) => {
  const { name, email, password, password2 } = req.body;

  if (!name || !email || !password || !password2) {
    req.flash('error', 'All fields are required');
    return res.redirect('/auth/register');
  }

  if (password !== password2) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/auth/register');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email already registered');
      return res.redirect('/auth/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    req.flash('success', 'Registration successful! Please login.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error registering user');
    res.redirect('/auth/register');
  }
};

// Handle logout
export const logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'Logged out successfully');
    res.redirect('/');
  });
};