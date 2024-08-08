const router = require('express').Router(),
    passport = require('passport')

router.get('/',passport.authenticate('local',{
    failureRedirect:'/'
}),(request,response) => {
    console.log("User is logged in successfully")
    response.redirect('/')
})

module.exports = router