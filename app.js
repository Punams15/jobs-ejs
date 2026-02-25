// app.js - Final version for Globetrek EJS project with full security
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import helmet from 'helmet';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import expressLayouts from 'express-ejs-layouts';

// Import Passport config & routes
import './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- SECURITY ----------------
app.use(helmet());               // basic security headers
app.use(xss());                  // sanitize user input
app.use(cookieParser());         // parse cookies for CSRF
app.set('trust proxy', 1);       // if deployed behind a proxy (Render, Heroku)

// Rate limiting: max 100 requests per 15 min
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CSRF protection
app.use(csurf({ cookie: true }));

// ---------------- VIEW ENGINE ----------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // default layout

// ---------------- BODY PARSER ----------------
app.use(express.urlencoded({ extended: true }));

// ---------------- STATIC FILES ----------------
app.use(express.static(path.join(__dirname, 'public')));

// ---------------- SESSION ----------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  })
);

// ---------------- PASSPORT ----------------
app.use(passport.initialize());
app.use(passport.session());

// ---------------- FLASH MESSAGES ----------------
app.use(flash());

// Set res.locals for EJS templates
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.info = req.flash('info');
  res.locals.user = req.user;
  res.locals.csrfToken = req.csrfToken(); // make CSRF token available in all forms
  next();
});

// ---------------- ROUTES ----------------
app.use('/auth', authRoutes);        // login/register/logout
app.use('/bookings', bookingRoutes); // CRUD for bookings

// ---------------- HOME ----------------
app.get('/', (req, res) => {
  res.render('home');
});

// ---------------- 404 HANDLER ----------------
app.use((req, res) => {
  res.status(404).send(`Page ${req.url} not found`);
});

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'EBADCSRFTOKEN') {
    // CSRF token error
    return res.status(403).send('Form tampered with.');
  }
  res.status(500).send(err.message);
});

// ---------------- DATABASE + START SERVER ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const port = process.env.PORT || 5000;
    app.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
    );
  })
  .catch((err) => console.error(err));