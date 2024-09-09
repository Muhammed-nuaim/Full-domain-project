const isLogin = async(req,res,next)=>{
    try {
        if(req.session.user_id && !req.session.edit && !req.session.newuser && !req.session.newAdmin && !req.session.updateUser){
            next()
        } else {
            res.redirect('/')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async(req,res,next)=>{
    try {
        if(req.session.user_id && !req.session.edit && !req.session.register && !req.session.login && !req.session.newuser && !req.session.newAdmin && !req.session.updateUser){
          res.redirect('/home')
        } else {
          next()  
        } 
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports={
    isLogin,
    isLogout,
}