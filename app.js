if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const Joi = require('joi');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campgrounds');
const catchAsync = require('./utilities/catchAsync');
const Review = require('./models/reviews');
const ExpressError = require('./utilities/expressError');
const schemas = require('./schemas');
const mongoSantitize = require('express-mongo-sanitize');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const dbURL = process.env.DB_URL;
const secret = process.env.secret || 'thishouldbeabettersecret';
mongoose.connect(dbURL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(p => {
        console.log('connected');
    })
    .catch(err => {
        console.log('connection error');
    })
mongoose.set('useFindAndModify', false);

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
//setting up assets
app.use(express.static(path.join(__dirname, '/assets')));
//setting up flash and cookies
const options = {
    mongoUrl:dbURL,
    secret,
    touchAfter: 24*3600
}
const sessionConfig = {
    name: 'demoHashName',
    secret,
    store: MongoStore.create(options),
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(mongoSantitize());
app.use(session(sessionConfig));
app.use(flash());
//passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//flashing success and errors
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home');
})
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/users', userRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404));
})

app.use((err, req, res, next) => {
    console.log(err);
    const { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render('errors/default', { err });
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`express-auth-done-at-${port}`);
})