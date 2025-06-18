import { Router, Request, Response } from 'express';
import Job, { IJob } from '../models/job.model';
import { protect } from '../middleware/auth.middleware';
import { HydratedDocument } from 'mongoose';
import { Server } from 'socket.io';

const createJobRouter = (io: Server) => {
  const router = Router();

  // Get all jobs for the authenticated user
  router.get('/', protect, async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authorized, user ID not found' });
      }
      const jobs: HydratedDocument<IJob>[] = await Job.find({ userId: req.user.id }).sort({ appliedDate: -1 });
      res.json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get a single job by ID
  router.get('/:id', protect, async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authorized, user ID not found' });
      }
      const job: HydratedDocument<IJob> | null = await Job.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.json(job);
    } catch (error) {
      console.error('Get job error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Create a new job application
  router.post('/', protect, async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authorized, user ID not found' });
      }
      const newJob: HydratedDocument<IJob> = new Job({
        ...req.body,
        userId: req.user.id,
      });
      await newJob.save();

      // Emit Socket.IO event for job creation
      io.to(`user:${req.user.id}`).emit('jobCreated', newJob);
      io.emit('adminNotification', { type: 'newJob', message: `New job created by ${req.user.email}: ${newJob.role} at ${newJob.company}` });

      res.status(201).json(newJob);
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update a job application
  router.put('/:id', protect, async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authorized, user ID not found' });
      }
      const updatedJob: HydratedDocument<IJob> | null = await Job.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true }
      );

      if (!updatedJob) {
        return res.status(404).json({ message: 'Job not found' });
      }

      // Emit Socket.IO event for job update
      io.to(`user:${req.user.id}`).emit('jobUpdated', updatedJob);
      io.emit('adminNotification', { type: 'jobUpdate', message: `Job updated by ${req.user.email}: ${updatedJob.role} at ${updatedJob.company}` });

      res.json(updatedJob);
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Delete a job application
  router.delete('/:id', protect, async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authorized, user ID not found' });
      }

      // Find the job first to get its details before deleting
      const foundJob: (IJob & Document) | null = await Job.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });

      if (!foundJob) {
        return res.status(404).json({ message: 'Job not found' });
      }

      // Now delete the job
      await Job.deleteOne({ _id: req.params.id, userId: req.user.id });

      // Emit Socket.IO event for job deletion using details from foundJob
      io.to(`user:${req.user.id}`).emit('jobDeleted', foundJob._id.toString());
      io.emit('adminNotification', { type: 'jobDelete', message: `Job deleted by ${req.user.email}: ${foundJob.role} at ${foundJob.company}` });

      res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};

export default createJobRouter; 