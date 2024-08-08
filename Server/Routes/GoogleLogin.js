const router = require('express').Router(),
    passport = require('passport')

router.get('/',passport.authenticate('google',{
    scope:['profile','email']
}))

router.get('/redirect',passport.authenticate('google',{
    successRedirect:'/',
    failureRedirect:'/login'
}))

module.exports = router