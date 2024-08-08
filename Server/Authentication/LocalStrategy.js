const passport = require('passport'),
    {Strategy} = require('passport-local'),
    bcrpyt = require('bcryptjs'),
    Database = require('./../Database/UserSchema')

module.exports = passport.use(
    new Strategy({
        usernameField:'email',
        passwordField:'password'
    },async (email,password,done) => {
        try{
            let userFinder = await Database.findOne({email:email})
            if(userFinder){
                if(bcrpyt.compareSync(password,userFinder.password)) return done(null,userFinder)
                else return done({message:"Incorrect user password"},null)
            }
        }
        catch(error){
            console.log(error)
            return done(error,null)
        }
    })
)