// server.js - Task 4: Complex Form Validation and Dynamic DOM Manipulation

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Create Express application
const app = express();
const PORT = 3003; // Using different port to avoid conflicts

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =============================================
// TEMPORARY STORAGE
// =============================================
let submissions = [];
let users = [];

// =============================================
// COMPLEX SERVER-SIDE VALIDATION
// =============================================

function validateFormData(name, email, password, message) {
    const errors = [];
    
    // Name validation - at least 2 characters
    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    // Email validation - valid format
    if (!email || !email.includes('@') || !email.includes('.')) {
        errors.push('Please enter a valid email address');
    }
    
    // Password validation - COMPLEX RULES (Task 4)
    if (!password) {
        errors.push('Password is required');
    } else {
        const passwordErrors = validatePassword(password);
        errors.push(...passwordErrors);
    }
    
    // Message validation - at least 10 characters
    if (!message || message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}

// =============================================
// COMPLEX PASSWORD VALIDATION (Task 4)
// =============================================

function validatePassword(password) {
    const errors = [];
    
    // Rule 1: Minimum 8 characters
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    
    // Rule 2: At least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    
    // Rule 3: At least one lowercase letter
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    
    // Rule 4: At least one number
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    
    // Rule 5: At least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*)');
    }
    
    return errors;
}

// =============================================
// ROUTES
// =============================================

// Home page
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Task 4 - Complex Validation & Dynamic DOM',
        submissions: submissions,
        users: users,
        errors: null,
        success: null,
        formData: {}
    });
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, email, password, message } = req.body;
    
    const validationErrors = validateFormData(name, email, password, message);
    
    if (validationErrors.length > 0) {
        return res.render('index', {
            title: 'Task 4 - Complex Validation & Dynamic DOM',
            submissions: submissions,
            users: users,
            errors: validationErrors,
            success: null,
            formData: { name, email, password, message }
        });
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        password: password, // In real app, you'd hash this
        message: message.trim(),
        timestamp: new Date().toLocaleString()
    };
    
    users.push(newUser);
    
    // Also add to submissions for display
    submissions.push({
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: new Date().toLocaleString()
    });
    
    res.render('index', {
        title: 'Task 4 - Complex Validation & Dynamic DOM',
        submissions: submissions,
        users: users,
        errors: null,
        success: '✅ Registration successful! Welcome ' + name + '!',
        formData: {}
    });
});

// =============================================
// API ENDPOINTS for Dynamic DOM (Task 4)
// =============================================

// Get all users (for dynamic display)
app.get('/api/users', (req, res) => {
    res.json({ success: true, users: users });
});

// Get single user
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json({ success: true, user: user });
    } else {
        res.json({ success: false, message: 'User not found' });
    }
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index !== -1) {
        users.splice(index, 1);
        // Also remove from submissions
        const subIndex = submissions.findIndex(s => s.id === parseInt(req.params.id));
        if (subIndex !== -1) {
            submissions.splice(subIndex, 1);
        }
        res.json({ success: true, message: 'User deleted successfully' });
    } else {
        res.json({ success: false, message: 'User not found' });
    }
});

// =============================================
// START THE SERVER
// =============================================

app.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 TASK 4 SERVER IS RUNNING!');
    console.log(`📝 Open your browser and go to:`);
    console.log(`   http://localhost:${PORT}`);
    console.log('========================================');
    console.log('🔐 Complex password validation is active!');
    console.log('🔄 Dynamic DOM manipulation is active!');
    console.log('📱 Client-side routing is active!');
    console.log('Press Ctrl+C to stop the server');
});