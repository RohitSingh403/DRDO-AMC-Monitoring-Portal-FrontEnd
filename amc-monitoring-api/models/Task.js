const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'overdue'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
taskSchema.index({ dueDate: 1, status: 1 });

// Static method to find overdue tasks
taskSchema.statics.findOverdueTasks = async function() {
  const now = new Date();
  return this.find({
    dueDate: { $lt: now },
    status: { $nin: ['completed', 'overdue'] }
  });
};

// Method to mark task as overdue
taskSchema.methods.markAsOverdue = async function() {
  if (this.status !== 'completed') {
    this.status = 'overdue';
    this.updatedAt = new Date();
    return this.save();
  }
  return this;
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
