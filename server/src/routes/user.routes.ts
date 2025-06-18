import { Router, Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import { protect } from '../middleware/auth.middleware';
import { authorizeAdmin } from '../middleware/admin.middleware';

const router = Router();

// Get all users (Admin only)
router.get('/', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find({}).select('-password'); // Exclude passwords
    res.json(users);
  } catch (error) {
    console.error('Error fetching users (Admin):', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (Admin only)
router.put('/:id/role', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'applicant'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    const user: IUser | null = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user: { id: user._id.toString(), email: user.email, role: user.role } });
  } catch (error) {
    console.error('Error updating user role (Admin):', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user (Admin only)
router.delete('/:id', protect, authorizeAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userToDelete: IUser | null = await User.findById(id);

    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    await userToDelete.deleteOne(); // Use deleteOne for Mongoose 5.x/6.x or remove() for older versions

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user (Admin):', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 