import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { protect } from '../middleware/auth.middleware';
import bcrypt from 'bcryptjs';

const router = Router();

// Register user
router.post('/register', async (req: Request, res: Response) => {
  console.log('Register request received', req.body.email);
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Registration failed: User already exists', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
    });

    await user.save();
    console.log('User registered successfully:', user.email);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  console.log('Login request received', req.body.email);
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login failed: Invalid password for user', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    console.log('Login successful for user:', user.email);
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get user profile
router.get('/me', protect, async (req: Request, res: Response) => {
  console.log('Get profile request received', req.user?.email);
  try {
    if (!req.user) {
      console.log('Get profile failed: Not authorized (no user in request)');
      return res.status(401).json({ message: 'Not authorized' });
    }
    const user = await User.findById(req.user.id).select('-password') as any;
    if (!user) {
      console.log('Get profile failed: User not found', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', protect, async (req: Request, res: Response) => {
  console.log('Update profile request received', req.user?.email);
  try {
    if (!req.user) {
      console.log('Update profile failed: Not authorized (no user in request)');
      return res.status(401).json({ message: 'Not authorized' });
    }
    const { firstName, lastName } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName },
      { new: true, runValidators: true }
    ).select('-password') as any;

    if (!user) {
      console.log('Update profile failed: User not found', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update password
router.put('/password', protect, async (req: Request, res: Response) => {
  console.log('Update password request received', req.user?.email);
  try {
    if (!req.user) {
      console.log('Update password failed: Not authorized (no user in request)');
      return res.status(401).json({ message: 'Not authorized' });
    }
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id) as any;
    if (!user) {
      console.log('Update password failed: User not found', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      console.log('Update password failed: Current password incorrect for user', req.user.email);
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    console.log('Password updated successfully for user:', req.user.email);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;