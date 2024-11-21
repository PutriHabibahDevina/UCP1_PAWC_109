const express = require('express');
const app = express();
const todoRoutes = require('./routes/tododb.js');  // Route for managing to-do tasks
require('dotenv').config();  // For environment variables (e.g., port, session secret)
const port = process.env.PORT;  // Port from environment variable
const expressLayout = require('express-ejs-layouts');  // EJS layouts middleware
const db = require('./database/db');  // Database connection
const session = require('express-session');  // For session management
const authRoutes = require('./routes/authRoutes');  // Authentication routes
const { isAuthenticated } = require('./middlewares/middleware.js');  // Authentication middleware

// Use EJS layouts for views
app.use(expressLayout);
app.use(express.json());  // Middleware to parse JSON data
app.use(express.urlencoded({ extended: true }));  // Middleware to parse URL-encoded data
app.use('/todos', todoRoutes);  // Mount the todos routes
app.set('view engine', 'ejs');  // Set the view engine to EJS

// Configure express-session
app.use(session({
    secret: process.env.SESSION_SECRET,  // Secret for signing session ID cookies
    resave: false,  // Don't save session if unmodified
    saveUninitialized: false,  // Don't create sessions for unauthenticated users
    cookie: { secure: false }  // Set true for HTTPS environments (secure cookies)
}));

// Use authentication routes
app.use('/', authRoutes);  // Mount authentication routes

// Main homepage route with authentication check
app.get('/', isAuthenticated, (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layout'  // Using a layout for the main page
    });
});

// Contact page route with authentication check
app.get('/contact', isAuthenticated, (req, res) => {
    res.render('contact', {
        layout: 'layouts/main-layout'  // Using the same layout for the contact page
    });
});

// View all todo items (with authentication check)
app.get('/todo-view', isAuthenticated, (req, res) => {
    db.query('SELECT * FROM todos', (err, todos) => {
        if (err) {
            return res.status(500).send('Internal Server Error');  // Handle database query errors
        }
        res.render('todo', {
            layout: 'layouts/main-layout',  // Layout for the todo view
            todos: todos  // Send todos data to the view
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);  // Log to console when the server is running
});