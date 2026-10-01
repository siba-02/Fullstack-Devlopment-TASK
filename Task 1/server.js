// server.js - Task 1: HTML Structure and Basic Server Interaction

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Create Express application
const app = express();
const PORT = 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =============================================
// Temporary storage for form submissions
// =============================================
let submissions = [];

// =============================================
// ROUTES
// =============================================

// Home page - Display the form
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Task 1 - Form Submission',
        submissions: submissions,
        successMessage: null,
        errorMessage: null
    });
});

// Handle form submission
app.post('/submit', (req, res) => {
    // Get data from the form
    const { name, email, message } = req.body;
    
    // Create a new submission object
    const newSubmission = {
        id: Date.now(),
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toLocaleString()
    };
    
    // Store in our temporary array
    submissions.push(newSubmission);
    
    // Show success message and render the page
    res.render('index', {
        title: 'Task 1 - Form Submission',
        submissions: submissions,
        successMessage: '✅ Form submitted successfully!',
        errorMessage: null
    });
});

// =============================================
// START THE SERVER
// =============================================

app.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 TASK 1 SERVER IS RUNNING!');
    console.log(`📝 Open your browser and go to:`);
    console.log(`   http://localhost:${PORT}`);
    console.log('========================================');
    console.log('Press Ctrl+C to stop the server');
});