async function isLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        req.flash('error', 'Please sign-in to continue');
        return res.redirect('/login');
    }
    next();
}
function storeReturnTo (req, res, next) {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports = {isLoggedIn, storeReturnTo}