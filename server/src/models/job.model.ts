import { Schema, model, Types, Document } from 'mongoose';

export interface IJob extends Document {
  company: string;
  role: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected';
  appliedDate: Date;
  notes?: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>({
  company: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['applied', 'interviewing', 'offered', 'rejected'],
    default: 'applied',
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

JobSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Job = model<IJob>('Job', JobSchema);

export default Job; 