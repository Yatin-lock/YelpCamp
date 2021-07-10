const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/campgrounds');
        })

    } catch (e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/users/register');
    }
}

module.exports.loginUser = (req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    req.flash('success', 'Welcome Back');
    res.redirect(redirectUrl);
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.logoutUser = (req, res) => {
    if (req.isAuthenticated()) {
        req.flash('success', 'Successfully Logged out');
        req.logOut();
        res.redirect('/campgrounds');
    } else {
        req.flash('error', 'You need to be dsigned before logging out');
        res.redirect('/campgrounds');
    }
}