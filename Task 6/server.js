// server.js - COMPLETE WORKING VERSION (No pre-save issues)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ← IMPORTANT!

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3005;

// =============================================
// MIDDLEWARE
// =============================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =============================================
// DATABASE
// =============================================
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB connected!'))
.catch(err => console.log('❌ MongoDB error:', err));

// =============================================
// ROUTES
// =============================================

app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Task 6 - Authentication',
        message: null,
        error: null 
    });
});

app.get('/login', (req, res) => {
    res.render('login', { 
        title: 'Login',
        message: null,
        error: null,
        email: '' 
    });
});

app.get('/register', (req, res) => {
    res.render('login', { 
        title: 'Register',
        message: 'Create your account',
        error: null,
        email: '' 
    });
});

app.get('/dashboard', async (req, res) => {
    try {
        const token = req.query.token || req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.redirect('/login');
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.redirect('/login');
        }
        
        const allUsers = await User.find().select('-password');
        res.render('dashboard', {
            title: 'Dashboard',
            user: user,
            users: allUsers
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.redirect('/login');
    }
});

// =============================================
// REGISTER API - Hash password manually
// =============================================
app.post('/api/register', async (req, res) => {
    console.log('📝 Register request received');
    
    try {
        const { username, email, password } = req.body;
        console.log('Data:', { username, email, password: '***' });
        
        // 1. Validation
        if (!username || username.length < 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username must be at least 3 characters' 
            });
        }
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email' 
            });
        }
        
        if (!password || password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters' 
            });
        }
        
        // 2. Check if user exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email or username' 
            });
        }
        
        // 3. Hash password MANUALLY (NO pre-save hook!)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('✅ Password hashed successfully');
        
        // 4. Create user with hashed password
        const user = new User({ 
            username, 
            email, 
            password: hashedPassword 
        });
        
        await user.save();
        console.log('✅ User created:', username);
        
        // 5. Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('❌ Register error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message 
        });
    }
});

// =============================================
// LOGIN API
// =============================================
app.post('/api/login', async (req, res) => {
    console.log('📝 Login request received');
    
    try {
        const { email, password } = req.body;
        console.log('Email:', email);
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }
        
        // Find user with password field
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        // Compare password using bcrypt directly
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        console.log('✅ Login successful:', user.username);
        
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            message: 'Login successful!',
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message 
        });
    }
});

// GET ALL USERS
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({
            success: true,
            count: users.length,
            users: users
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// =============================================
// START SERVER
// =============================================
app.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 TASK 6 SERVER IS RUNNING!');
    console.log(`📝 Open: http://localhost:${PORT}`);
    console.log('========================================');
    console.log('📋 Routes:');
    console.log('  GET  /              - Home');
    console.log('  POST /api/register  - Register');
    console.log('  POST /api/login     - Login');
    console.log('  GET  /api/users     - All users');
    console.log('========================================');
});