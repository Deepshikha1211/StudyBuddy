// server.js

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors()); // configure origins in production

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
