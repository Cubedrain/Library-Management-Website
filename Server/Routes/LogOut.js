const router = require('express').Router()

router.get('/',(request,response,next) => {
    request.user ? next() : response.redirect('/')
},(request,response) => {
    request.logOut((error) => {
        if(error) throw error
        else response.redirect('/')
    })
})

module.exports = router