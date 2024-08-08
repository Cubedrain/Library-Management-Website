const express = require('express'),
    dotenv = require('dotenv'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    connect_mongo = require('connect-mongo'),
    cors = require('cors'),
    passport = require('passport')
dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    store:connect_mongo.create({
        mongoUrl:process.env.MONGO_URI,
    })
}))
app.use(passport.initialize())
app.use(passport.session())

const googleDatabase = require('./Database/GoogleSchema'),
    localDatabase = require('./Database/UserSchema')

passport.serializeUser((user,done) => {
    return user ? done(null,user.id) : done({message:"No user is present"},null)
})
passport.deserializeUser(async (userID,done) => {
    try{
        let userFinder = await googleDatabase.findOne({id:userID}).lean() || await localDatabase.findOne({id:userID}).lean()
        if(userFinder) return done(null,userFinder)
        else return done({message:"User not found"},null)
    }
    catch(error){
        return done(error,null)
    }
})

//Routes and Strategies
const googleStrategy = require('./Authentication/GoogleStrategy'),
    localStrategy = require('./Authentication/LocalStrategy')
const googleLogin = require('./Routes/GoogleLogin'),
    localLogin = require('./Routes/LocalLogin'),
    localSignUp = require('./Routes/LocalSignUp'),
    logOut = require('./Routes/LogOut')

app.use('/accounts/login',localLogin)
app.use('/accounts/signup',localSignUp)
app.use('/accounts/googleoauth',googleLogin)
app.use('/accounts/logout',logOut)

app.get('/',(request,response) => {
    response.status(200).send(request.user ? "User exists" : "No user exists")
    console.log(request.user)
})

app.listen(process.env.PORT,() => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Server and Database and listening")
        })
        .catch(() => {
            console.log("Server is listening, Database is inaccessible")
        })
})