const router = require('express').Router(),
    Database = require('./../Database/UserSchema'),
    crypto = require('crypto'),
    bcrypt = require('bcryptjs')

router.post('/',(request,response,next) => {
    if(request.user) response.redirect('/')
    else next()
},async (request,response) => {
    const {username,email,password} = request.body,
        id = crypto.randomBytes(16).toString('hex'),
        newPassword = bcrypt.hashSync(password,10)
    try{
        let duplicateChecker = await Database.findOne({email:email})
        if(duplicateChecker) return response.send("User already exists")
        else{
            const newUser = await Database.create({
                id:id,
                email:email,
                displayName:username,
                password:newPassword
            })
            request.login(newUser,(error) => {
                if(error) throw error
                return response.sendStatus(201)
            })
        }
    }
    catch(error){
        console.log("User isn't saved in database, error encountered")
        throw error
    }
})

module.exports = router