const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt')

const securePassword = async(password)=>{
    try{
       const passwordHash = await bcrypt.hash(password, 10)
       return passwordHash;
    } catch (error) {
        console.log(error.message.User);
    }
}

const loadLogin = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}


const verifyLogin = async(req,res)=>{
    try {
        const {email,password} = await req.body

        const adminData = await Admin.findOne({email:email})

        if(adminData){
            const passwordMatch = await bcrypt.compare(password,adminData.password)
                if(passwordMatch){
                    // req.session.user_id = false
                    req.session.admin_id = adminData._id
                    res.redirect('admin/home')
                } else {
                    res.render('login',{message:"password in correct"})
                }
        } else {
            res.render('login',{message:"This Admin is not found"})
        }  
    } catch (error) {
        console.log(error.message);
    }
}


const loadDashboard = async(req,res)=>{
    try {
        const usersData = await User.find({is_admin:0})
        const adminData = await Admin.findOne({_id:req.session.admin_id})
        res.render('home',{admin:adminData,users:usersData})
    } catch (error) {
        console.log(error.message);
    }
}

const logOut = async(req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message);
    }
}

//Add New User

const newUserLoad = async(req,res)=>{
    try {
            res.render('new-user')
    } catch (error) {
        console.log(error.message);
    }
}

const addUser = async(req,res)=>{
    try {
        const {name, email,mobile, password } = req.body

        const spassword = await securePassword(password)

        const user = new User({
            name:name,
            email:email,
            mobile:mobile,
            password:spassword,
            is_admin:0
        })

        const userData = await user.save()

        if(userData){
                res.redirect('/admin/home')
        } else {
            res.render('new-user',{message:"Something wrong"})
        }

    } catch (error) {
        if(error.code === 11000){
           return res.render('new-user',{message:"Email Already Exist ! Please Enter Different Email"})
        }else{
            console.log(error.message);
        }
    }
}

//Edit user
const editUserLoad = async(req,res)=>{
    try {
        const id = req.query.id
        const userData = await User.findById({_id:id})
        if(userData){
                res.render('edit-user',{ user: userData })
        } else {
            res.redirect('/admin/home')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateUsers = async(req,res)=>{
    try {
        const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,mobile:req.body.mobile,is_verified:req.body.verify}})
            res.redirect('/admin/home')
    } catch (error) {
        if(error.code === 11000){
            return res.render('edit-user',{message:"Email Already Exist ! Please Enter Different Email"})
         }else{
             console.log(error.message);
         }
    }
}

//delete user
const deleteUser = async (req, res) => {
    try {
        const id = req.body.id; 
        await User.findByIdAndDelete(id);
        res.redirect('/admin/home');
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
};


//search
const searchUser = async (req, res) => {
    try {
        const searchQuery = req.query.query;
        const usersData = await User.find({name: { $regex: searchQuery, $options: "i" },is_admin:0});

        const adminData = await Admin.findOne({_id:req.session.admin_id})
        res.render('home',{admin:adminData,users:usersData})
    } catch (error) {
        console.log(error.message);
        res.redirect('/admin/home');
    }
}

const insertAdminLoad = async (req,res) => {
    try {
            res.render('add-admins')
    } catch (error) {
        console.log(error.message);
    }
}

const insertAdmin = async(req,res) => {
     try {
        const {name,email,mobile,password} = await req.body
        const spassword = await securePassword(password)
        const admin = await new Admin ({
            name:name,
            email:email,
            mobile:mobile,
            password:spassword
        })

        const user = await new User ({
            name:name,
            email:email,
            mobile:mobile,
            password:spassword,
            is_admin :1
        })

        const adminData = await admin.save()
        const userData = await user.save()

        if(adminData && userData) {
                res.redirect('/admin/home')
        }else{
            res.render('add-admins',{message:"Admin Insertion Failed"})
        }
     } catch (error) {
        if(error.code === 11000){
            return res.render('add-admins',{message:"Email Already Exist ! Please Enter Different Email"})
         }else{
             console.log(error.message);
         }
     }
}


module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logOut,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser,
    searchUser,
    insertAdminLoad,
    insertAdmin,
}