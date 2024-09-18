const express = require('express')
const session = require('express-session')
const user_route = express()
const bodyParser = require('body-parser')
const userController = require("../controllers/userController");
const config = require('../config/config')
const auth = require('../middleware/userAuth')
const nocache = require('nocache')

user_route.use(nocache())
user_route.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});



user_route.use(session({ secret: config.sessionSecret, saveUninitialized: true, resave: false ,cookie: {secure: false}}))

user_route.set('view engine','ejs');
user_route.set('views','./views/users');
user_route.use(express.static('public'))

user_route.use(bodyParser.urlencoded({ extended: true }));
user_route.use(bodyParser.json());

user_route.get('/register',auth.isLogout,userController.loadRegister)
user_route.post('/register',userController.insertUser)

user_route.get('/',auth.isLogout,userController.loginLoad)
user_route.get('/login',auth.isLogout,userController.loginLoad)
user_route.post('/login',userController.verifyLogin)

user_route.get('/home',auth.isLogin,userController.loadHome)

user_route.get('/logout',auth.isLogin,userController.userLogout)

user_route.get('/edit',auth.isLogin,userController.editLoad)
user_route.post('/edit',userController.updateProfile)

module.exports = user_route;