// server.js - Task 3: Advanced CSS Styling and Responsive Design

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Create Express application
const app = express();
const PORT = 3002; // Using different port to avoid conflicts

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

// =============================================
// SERVER-SIDE VALIDATION
// =============================================

function validateFormData(name, email, message) {
    const errors = [];
    
    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!email || !email.includes('@') || !email.includes('.')) {
        errors.push('Please enter a valid email address');
    }
    
    if (!message || message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}

// =============================================
// ROUTES
// =============================================

// Home page
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Task 3 - Advanced CSS',
        submissions: submissions,
        errors: null,
        success: null,
        formData: {}
    });
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, email, message } = req.body;
    
    const validationErrors = validateFormData(name, email, message);
    
    if (validationErrors.length > 0) {
        return res.render('index', {
            title: 'Task 3 - Advanced CSS',
            submissions: submissions,
            errors: validationErrors,
            success: null,
            formData: { name, email, message }
        });
    }
    
    const newSubmission = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: new Date().toLocaleString()
    };
    
    submissions.push(newSubmission);
    
    res.render('index', {
        title: 'Task 3 - Advanced CSS',
        submissions: submissions,
        errors: null,
        success: '✅ Form submitted successfully!',
        formData: {}
    });
});

// =============================================
// START THE SERVER
// =============================================

app.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 TASK 3 SERVER IS RUNNING!');
    console.log(`📝 Open your browser and go to:`);
    console.log(`   http://localhost:${PORT}`);
    console.log('========================================');
    console.log('🎨 Advanced CSS with animations is active!');
    console.log('📱 Fully responsive design!');
    console.log('Press Ctrl+C to stop the server');
});