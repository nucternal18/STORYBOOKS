const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const sessions = require('express-session');
const MongoStore = require('connect-mongo')(sessions);

const PORT = process.env.PORT || 3000;

// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport)

connectDB();

const app = express();

//Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Handlebars Helpers
const { formatDate } = require('./helpers/hbs');

// Handlebars engine
app.engine('.hbs', exphbs({
  helpers: {
  formatDate
}, defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Sessions
app.use(sessions({
  secret: "Bankai",
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))
// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
