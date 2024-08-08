const passport = require('passport'),
    {Strategy} = require('passport-google-oauth20'),
    Database = require('./../Database/GoogleSchema')

module.exports = passport.use(
    new Strategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:`http://localhost:${process.env.PORT}/accounts/googleoauth/redirect`,
        scope:['email','profile']
    },async (accessToken,refreshToken,profile,callback) => {
        try{
            if(profile){
                let userFinder = await Database.findOne({email:profile._json.email})
                if(userFinder){
                    console.log("User already exists")
                    return callback(null,userFinder)
                }
                else{
                    const newUser = await Database.create({
                        id:profile.id,
                        displayName:profile.displayName,
                        email:profile._json.email
                    })
                    console.log("Successfully created")
                    return callback(null,newUser)
                }
            }
        }
        catch(error){
            return callback(error,null)
        }
    }
))