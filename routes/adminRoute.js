const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const admin_route = express()
const config = require('../config/config')
const adminController = require('../controllers/adminController')
const auth = require('../middleware/adminAuth')
const nocache = require('nocache')

admin_route.use(express.static('public'))
admin_route.use(nocache())
admin_route.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

admin_route.use(session({ secret: config.sessionSecret, saveUninitialized: true, resave: false }))
admin_route.use(bodyParser.urlencoded({ extended: true }));
admin_route.use(bodyParser.json());

admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')

admin_route.get('/',auth.isLogout,adminController.loadLogin)
admin_route.post('/',adminController.verifyLogin)
admin_route.get('/home',auth.isLogin,adminController.loadDashboard)
admin_route.get('/logout',auth.isLogin,adminController.logOut)
// admin_route.get('/invalidAdmin',auth.isInvalid)

admin_route.get('/new-user',auth.isLogin,adminController.newUserLoad)
admin_route.post('/new-user',adminController.addUser)

admin_route.get('/edit-user',auth.isLogin,adminController.editUserLoad)
admin_route.post('/edit-user',adminController.updateUsers)

admin_route.post('/delete-user', auth.isLogin, adminController.deleteUser);

admin_route.get('/search-user', auth.isLogin, adminController.searchUser);

admin_route.get('/add-admins',auth.isLogin,adminController.insertAdminLoad)
admin_route.post('/add-admins',adminController.insertAdmin)

admin_route.get('/access',auth.isLogout,adminController.accessAdminLoad)
admin_route.post('/access',adminController.accessAdmin)

admin_route.get('/back',adminController.back)

admin_route.get('*',(req,res)=>{res.redirect('/admin')})

module.exports = admin_route;