// server.js - Task 2: Inline Styles, Basic Interaction, and Server-Side Validation

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Create Express application
const app = express();
const PORT = 3001; // Using different port to avoid conflict with Task 1

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =============================================
// TEMPORARY STORAGE
// =============================================
let submissions = [];

// =============================================
// SERVER-SIDE VALIDATION FUNCTION
// =============================================

function validateFormData(name, email, message) {
    const errors = [];
    
    // Name validation - must be at least 2 characters
    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    // Email validation - must contain @ and .
    if (!email || !email.includes('@') || !email.includes('.')) {
        errors.push('Please enter a valid email address');
    }
    
    // Message validation - must be at least 10 characters
    if (!message || message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}

// =============================================
// ROUTES
// =============================================

// Home page - Display the form
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Task 2 - Form with Validation',
        submissions: submissions,
        errors: null,
        success: null,
        formData: {} // Empty form data for initial load
    });
});

// Handle form submission with validation
app.post('/submit', (req, res) => {
    const { name, email, message } = req.body;
    
    // Server-side validation
    const validationErrors = validateFormData(name, email, message);
    
    // If there are errors, show them
    if (validationErrors.length > 0) {
        return res.render('index', {
            title: 'Task 2 - Form with Validation',
            submissions: submissions,
            errors: validationErrors,
            success: null,
            formData: { name, email, message } // Keep the entered data
        });
    }
    
    // If validation passes, store the data
    const newSubmission = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: new Date().toLocaleString()
    };
    
    submissions.push(newSubmission);
    
    // Show success message
    res.render('index', {
        title: 'Task 2 - Form with Validation',
        submissions: submissions,
        errors: null,
        success: '✅ Form submitted successfully!',
        formData: {} // Clear form data
    });
});

// =============================================
// START THE SERVER
// =============================================

app.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 TASK 2 SERVER IS RUNNING!');
    console.log(`📝 Open your browser and go to:`);
    console.log(`   http://localhost:${PORT}`);
    console.log('========================================');
    console.log('🔒 Server-side validation is active!');
    console.log('💻 Client-side validation is active!');
    console.log('Press Ctrl+C to stop the server');
});