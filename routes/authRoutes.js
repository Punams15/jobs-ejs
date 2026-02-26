// routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import { showLogin, showRegister, doRegister, logout } from '../controllers/authController.js';

const router = express.Router();

// Show forms
router.get('/login', showLogin);
router.get('/register', showRegister);

// Handle form submissions
router.post('/register', doRegister);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

router.post('/logout', logout);

export default router;