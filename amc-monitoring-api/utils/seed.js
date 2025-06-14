const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const logger = require('./logger');

const connectDB = require('../config/db');

// Connect to database
connectDB();

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Task.deleteMany({});
    logger.info('Cleared existing data');
  } catch (error) {
    logger.error('Error clearing data:', error);
    process.exit(1);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });

    // Create AMC personnel user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      name: 'AMC Personnel',
      email: 'user@example.com',
      password: userPassword,
      role: 'amc_personnel'
    });

    logger.info('Seeded users');
    return { adminId: admin._id, userId: user._id };
  } catch (error) {
    logger.error('Error seeding users:', error);
    process.exit(1);
  }
};

// Seed tasks
const seedTasks = async (adminId, userId) => {
  try {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    const tasks = [
      {
        title: 'Quarterly Maintenance Check',
        description: 'Perform routine maintenance on all AMC equipment',
        dueDate: new Date(now.getTime() + oneDay * 7), // Due in 7 days
        status: 'pending',
        priority: 'high',
        assignedTo: userId,
        createdBy: adminId
      },
      {
        title: 'Inspect Fire Safety Systems',
        description: 'Monthly inspection of all fire safety equipment',
        dueDate: new Date(now.getTime() - oneDay * 2), // Overdue by 2 days
        status: 'pending',
        priority: 'high',
        assignedTo: userId,
        createdBy: adminId
      },
      {
        title: 'Update Client Reports',
        description: 'Generate and send monthly reports to clients',
        dueDate: new Date(now.getTime() + oneDay * 14), // Due in 14 days
        status: 'in_progress',
        priority: 'medium',
        assignedTo: userId,
        createdBy: adminId
      },
      {
        title: 'Review Service Contracts',
        description: 'Review and renew expiring service contracts',
        dueDate: new Date(now.getTime() + oneDay * 30), // Due in 30 days
        status: 'pending',
        priority: 'low',
        assignedTo: adminId,
        createdBy: adminId
      },
      {
        title: 'Team Training Session',
        description: 'Conduct training on new equipment',
        dueDate: new Date(now.getTime() + oneDay * 3), // Due in 3 days
        status: 'pending',
        priority: 'medium',
        assignedTo: userId,
        createdBy: adminId
      }
    ];

    await Task.insertMany(tasks);
    logger.info(`Seeded ${tasks.length} tasks`);
  } catch (error) {
    logger.error('Error seeding tasks:', error);
    process.exit(1);
  }
};

// Main function to run the seeder
const seedDB = async () => {
  try {
    // Clear existing data
    await clearData();
    
    // Seed users and get their IDs
    const { adminId, userId } = await seedUsers();
    
    // Seed tasks with user references
    await seedTasks(adminId, userId);
    
    logger.info('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDB();
