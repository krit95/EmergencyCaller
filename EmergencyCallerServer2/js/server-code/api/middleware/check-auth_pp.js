// const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const User = require("../models/user");

module.exports = (req, res, next) => {
    try {
        console.log("request: " + JSON.stringify(req.body));
        const email = req.body.email;
        const id_token = req.body.requestIdToken;

        console.log("email: " + email);
        console.log("token: " + id_token);
        User.findOne({$or:[{ user_email : email, company : "pp" },{ user_email : email, company : "all" }]}, (err, user) =>{
            if(err) return res.status(500).send(err); //some error
            else if(user!= null){
                const now = Math.floor(Date.now()/1000);
                console.log("user: " + user);
                console.log("now: " + now);

                if(user.user_id_token!=null) console.log("token not null");
                if(user.is_active == 'true') console.log("active true");
                if(now < user.session_expiry_time) console.log("now less");
                if(user.user_id_token!=null && user.is_active == true && now < user.session_expiry_time){
                    console.log("Success auth");
                    next();
                }    
                else{
                    User.update({ user_email: email }, { $set: {user_id_token : null, session_expiry_time: null}})
                    .exec()
                    .then(result => {
                      return res.status(401).json({
                        message: 'Auth failed',
                      });
                    })
                    .catch(err => {
                      console.log(err);
                      return res.status(500).json({
                        error: err
                      });
                    });        
                }
            }
            else return res.status(401).json({
                message: 'Auth failed',
            });
        });
        // const token = req.headers.authorization.split(" ")[1];
        // const decoded = jwt.verify(token, process.env.JWT_KEY);
        // req.userData = decoded;
        // next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};
