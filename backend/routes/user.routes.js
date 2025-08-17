console.log("✅ user.routes.js loaded");
import express from 'express';
import { forgotPassword, getProfile, login, logout, register, resetPassword, verifyOTP } from '../controllers/register.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', register)
router.post('/verify-otp', verifyOTP)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.put('/resetPassword/:token', resetPassword)
router.get('/logout', authMiddleware, logout)
router.get('/user', authMiddleware, getProfile)
router.stack.forEach(r => {
  if (r.route) {
    console.log("➡️", Object.keys(r.route.methods)[0].toUpperCase(), r.route.path);
  }
});

export default router;