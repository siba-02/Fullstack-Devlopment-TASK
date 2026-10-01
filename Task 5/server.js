// server.js - Task 5: API Integration and Front-End Interaction

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3004;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// =============================================
// DATA STORE (In-memory database)
// =============================================
let todos = [];
let idCounter = 1;

// =============================================
// ROUTES - Server-Side Rendering
// =============================================

// Home page
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Task 5 - API Integration',
        todos: todos,
        message: null
    });
});

// =============================================
// RESTful API ENDPOINTS (CRUD Operations)
// =============================================

// GET all todos
app.get('/api/todos', (req, res) => {
    res.json({
        success: true,
        count: todos.length,
        data: todos
    });
});

// GET single todo
app.get('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
        return res.status(404).json({
            success: false,
            message: 'Todo not found'
        });
    }
    
    res.json({
        success: true,
        data: todo
    });
});

// POST - Create new todo
app.post('/api/todos', (req, res) => {
    const { title, description } = req.body;
    
    // Validation
    if (!title || title.trim().length < 3) {
        return res.status(400).json({
            success: false,
            message: 'Title must be at least 3 characters'
        });
    }
    
    const newTodo = {
        id: idCounter++,
        title: title.trim(),
        description: description ? description.trim() : '',
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    
    res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: newTodo
    });
});

// PUT - Update todo
app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description, completed } = req.body;
    
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
        return res.status(404).json({
            success: false,
            message: 'Todo not found'
        });
    }
    
    // Update fields
    if (title) todo.title = title.trim();
    if (description !== undefined) todo.description = description.trim();
    if (completed !== undefined) todo.completed = completed;
    
    res.json({
        success: true,
        message: 'Todo updated successfully',
        data: todo
    });
});

// DELETE - Delete todo
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Todo not found'
        });
    }
    
    todos.splice(index, 1);
    
    res.json({
        success: true,
        message: 'Todo deleted successfully'
    });
});

// PATCH - Toggle completion status
app.patch('/api/todos/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
        return res.status(404).json({
            success: false,
            message: 'Todo not found'
        });
    }
    
    todo.completed = !todo.completed;
    
    res.json({
        success: true,
        message: `Todo ${todo.completed ? 'completed' : 'uncompleted'}`,
        data: todo
    });
});

// =============================================
// START SERVER
// =============================================

app.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 TASK 5 SERVER IS RUNNING!');
    console.log(`📝 Open your browser and go to:`);
    console.log(`   http://localhost:${PORT}`);
    console.log('========================================');
    console.log('📋 API Endpoints available:');
    console.log('   GET    /api/todos          - Get all todos');
    console.log('   GET    /api/todos/:id      - Get single todo');
    console.log('   POST   /api/todos          - Create todo');
    console.log('   PUT    /api/todos/:id      - Update todo');
    console.log('   DELETE /api/todos/:id      - Delete todo');
    console.log('   PATCH  /api/todos/:id/toggle - Toggle status');
    console.log('========================================');
});