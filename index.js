// index.js
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './db/db.js';
import seedUsers from './userseed.js'; // ✅ Import here

import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';
import attandenceRouter from './routes/attendence.js';
import dashBoardRouter from './routes/dashboard.js';

const startServer = async () => {
  await connectDB();     // ✅ First, connect DB
  await seedUsers();     // ✅ Then, auto-run seeder

  const app = express();
  app.use(cors({
    origin: 'https://ems-frontend-two-xi.vercel.app/',
    credentials: true
  }));
  app.use(express.json());
  app.use(express.static('public/uploads'));

  app.use('/api/auth', authRouter);
  app.use('/api/department', departmentRouter);
  app.use('/api/employee', employeeRouter);
  app.use('/api/attendence', attandenceRouter);
  app.use('/api/dashboard', dashBoardRouter);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};

startServer();
