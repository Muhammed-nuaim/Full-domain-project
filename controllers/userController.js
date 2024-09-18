const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const securePassword = async(password)=>{
    try{
       const passwordHash = await bcrypt.hash(password, 10)
       return passwordHash;
    } catch (error) {
        console.log(error.message.User);
    }
}

const loadRegister = async( req, res)=>{
    try{
        res.render('registration')
    } catch(error){
     res.send(error.message)
    }
}

const insertUser = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: spassword,
            is_admin: 0
        });

        const userData = await user.save();

        if (userData) {
                res.render('login');
        } else {
            res.render('registration', { message: "Your registration has failed" });
        }

    } catch (error) {
        if(error.code === 11000){
            return res.render('registration',{message:"Email Already Exist ! Please Enter Different Email"})
         }else{
             console.log(error.message);
         }
    }
};




// Login user methods started

const loginLoad = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
};


const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                req.session.user_id = userData._id;
                res.redirect('/home');
            } else {
                res.render('login', { message: 'Invalid  password' });
            }
        } else {
            res.render('login', { message: 'User not found' });
        }
    } catch (error) {
        console.log("Error during login:", error.message);
        res.status(500).send('Internal Server Error');
    }
};





const loadHome = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id})
        res.render('home',{user:userData})
    } catch (error) {
        console.log(error.message)
    }
}

const userLogout =async(req,res) => {
    try{
        req.session.destroy();
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
}

//user profile edit & update
const editLoad = async(req,res)=>{
    try {
        const id = req.query.id
        const userData = await User.findById({_id:id})

        if(userData){
                res.render('edit',{user:userData})
        } else {
            res.redirect('/home')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateProfile = async(req,res)=>{
    try {
        const userData = await User.findByIdAndUpdate({_id:req.session.user_id},{$set:{name:req.body.name,mobile:req.body.mobile,is_verified:req.body.verify}})
        res.redirect('/home')
    } catch (error) {
        if(error.code === 11000){
            return res.render('edit',{message:"Email Already Exist ! Please Enter Different Email"})
         }else{
             console.log(error.message);
         }
    }
}


module.exports ={
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile,
}
