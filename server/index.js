require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./db');
const cookieParser = require('cookie-parser');
const { default: mongoose } = require('mongoose');

// database conneciton
connection();

// middlewares

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const refreshRoutes = require('./routes/refresh');
const registerRoutes = require('./routes/register');
app.use('/register', registerRoutes);
app.use('/auth', authRoutes);
app.use('/refresh', refreshRoutes);

app.use('/users', userRoutes);



const port = process.env.PORT || 3001;

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`Listening to port ${port}`));
});