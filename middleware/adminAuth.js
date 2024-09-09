const isLogin = async(req,res,next)=>{
    try {
        if(req.session.admin_id && !req.session.user_id && !req.session.newuser && !req.session.newAdmin && !req.session.updateUser){
            next()
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async(req, res, next) => {
    try {
        if (req.session.admin_id  && !req.session.user_id && !req.session.newuser && !req.session.newAdmin && !req.session.updateUser) {
            res.redirect('/admin/home');
        } else {
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout,
}
