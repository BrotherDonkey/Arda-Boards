
//prevents logged in users from getting to pesky register and login pages.
function loggedOut(req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/profile');
    }
    return next();
}

//allows logged in users to access a route unfettered, displays errors to not logged in users
function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('You need to be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}



//export loggedOut
module.exports.loggedOut = loggedOut;
//export requiresLogin
module.exports.requiresLogin = requiresLogin;