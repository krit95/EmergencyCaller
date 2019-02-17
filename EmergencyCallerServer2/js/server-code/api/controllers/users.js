const mongoose = require("mongoose");
const https = require("https");
const request = require("request");

const User = require("../models/user");

exports.user_sign_in = (req, res, next) => {
  console.log("request: " + JSON.stringify(req.body));
  const email = req.body.email;
  const id_token = req.body.requestIdToken;
  console.log("email: " + email);
  console.log("token: " + id_token);
  User.findOne({$or:[{ user_email : email, company : "rge" },{ user_email : email, company : "all" }]}, (err, user) =>{
  	if(err) return res.status(500).send(err); //user not in db => user not admin
  	else if(user != null){
	  	console.log("user: " + user);
	  	const options = {
	  		method: 'GET',
	  		url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + id_token,
	  		json: true
	  	}

		//user is admin, verify token and make active in db
	  	request(options, function(error, response, body){
	  		if(!error && response.statusCode == 200){
	  			console.log("response:" + response);
	  			console.log("body:" + body);
	  			console.log("success from google api " + body["email"]);
	  			const expiry_date = body.exp;
	  			console.log("exp: " + body.exp);
	  			// const epoch = new Date(1970, 0 ,1);
	  			// console.log("epoch: " + epoch);
	  			// const expiry_date = epoch.setSeconds(exp);
	  			// console.log("expiry_date: " + expiry_date);
	  			User.update({ user_email: email, is_active: true }, { $set: {user_id_token : id_token, session_expiry_time: expiry_date}}, function(err, count, result){
	  				console.log("modified callback: " + JSON.stringify(count));
	  				if(err){
	  					console.log("error: " + err);
				    	return res.status(401).json({
				        message: 'Auth failed',
				        });
	  				} else if(count.n == 1 && count.nModified <= 1){
	  					console.log("count = 1");
			  			return res.status(200).json({
				        message: 'User sign in successfull',
				    	});		
	  				} else{
	  					console.log("count != 1");
	  					return res.status(401).json({
				        message: 'Auth failed',
				      	});
	  				}

	  			});

			    // .exec()
			    // .then(result => {
			    //   return res.status(200).json({
			    //     message: 'User sign in successfull',
			    //   });
			    // })
			    // .catch(err => {
			    //   console.log(err);
			    //   return res.status(401).json({
			    //     message: 'Auth failed',
			    //   });
			    // });
			  	//console.log("res : " + res);
				//return res;
	  		}
	  		else{
	  			console.log("error from google api");
	  			return res.status(401).json({
			        message: 'Auth failed',
			    });
	  		}
	  	});
	}
  	else return res.status(401).json({
        message: 'Auth failed',
    });
  })
};

exports.user_sign_out = (req, res, next) => {
  const email = req.body.email;
  console.log("email: " + email);
  User.update({ user_email: email }, { $set: {user_id_token : null, session_expiry_time: null}})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User signed out successfully',
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.user_sign_in_pp = (req, res, next) => {
  console.log("request: " + JSON.stringify(req.body));
  const email = req.body.email;
  const id_token = req.body.requestIdToken;
  console.log("email: " + email);
  console.log("token: " + id_token);
  User.findOne({$or:[{ user_email : email, company : "pp" },{ user_email : email, company : "all" }]}, (err, user) =>{
  	if(err) return res.status(500).send(err); //user not in db => user not admin
  	else if(user != null){
	  	console.log("user: " + user);
	  	const options = {
	  		method: 'GET',
	  		url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + id_token,
	  		json: true
	  	}

		//user is admin, verify token and make active in db
	  	request(options, function(error, response, body){
	  		if(!error && response.statusCode == 200){
	  			console.log("response:" + response);
	  			console.log("body:" + body);
	  			console.log("success from google api " + body["email"]);
	  			const expiry_date = body.exp;
	  			console.log("exp: " + body.exp);
	  			// const epoch = new Date(1970, 0 ,1);
	  			// console.log("epoch: " + epoch);
	  			// const expiry_date = epoch.setSeconds(exp);
	  			// console.log("expiry_date: " + expiry_date);
	  			User.update({ user_email: email, is_active: true }, { $set: {user_id_token : id_token, session_expiry_time: expiry_date}}, function(err, count, result){
	  				console.log("modified callback: " + JSON.stringify(count));
	  				if(err){
	  					console.log("error: " + err);
				    	return res.status(401).json({
				        message: 'Auth failed',
				        });
	  				} else if(count.n == 1 && count.nModified <= 1){
	  					console.log("count = 1");
			  			return res.status(200).json({
				        message: 'User sign in successfull',
				    	});		
	  				} else{
	  					console.log("count != 1");
	  					return res.status(401).json({
				        message: 'Auth failed',
				      	});
	  				}

	  			});

			    // .exec()
			    // .then(result => {
			    //   return res.status(200).json({
			    //     message: 'User sign in successfull',
			    //   });
			    // })
			    // .catch(err => {
			    //   console.log(err);
			    //   return res.status(401).json({
			    //     message: 'Auth failed',
			    //   });
			    // });
			  	//console.log("res : " + res);
				//return res;
	  		}
	  		else{
	  			console.log("error from google api");
	  			return res.status(401).json({
			        message: 'Auth failed',
			    });
	  		}
	  	});
	}
  	else return res.status(401).json({
        message: 'Auth failed',
    });
  })
};

exports.user_sign_out_pp = (req, res, next) => {
  const email = req.body.email;
  console.log("email: " + email);
  User.update({$or:[{ user_email : email, company : "pp" },{ user_email : email, company : "all" }]}, { $set: {user_id_token : null, session_expiry_time: null}})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User signed out successfully',
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};



exports.user_sign_in_sltfr = (req, res, next) => {
  console.log("request: " + JSON.stringify(req.body));
  const email = req.body.email;
  const id_token = req.body.requestIdToken;
  console.log("email: " + email);
  console.log("token: " + id_token);
  User.findOne({$or:[{ user_email : email, company : "sltfr" },{ user_email : email, company : "all" }]}, (err, user) =>{
  	if(err) return res.status(500).send(err); //user not in db => user not admin
  	else if(user != null){
	  	console.log("user: " + user);
	  	const options = {
	  		method: 'GET',
	  		url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + id_token,
	  		json: true
	  	}

		//user is admin, verify token and make active in db
	  	request(options, function(error, response, body){
	  		if(!error && response.statusCode == 200){
	  			console.log("response:" + response);
	  			console.log("body:" + body);
	  			console.log("success from google api " + body["email"]);
	  			const expiry_date = body.exp;
	  			console.log("exp: " + body.exp);
	  			// const epoch = new Date(1970, 0 ,1);
	  			// console.log("epoch: " + epoch);
	  			// const expiry_date = epoch.setSeconds(exp);
	  			// console.log("expiry_date: " + expiry_date);
	  			User.update({ user_email: email, is_active: true }, { $set: {user_id_token : id_token, session_expiry_time: expiry_date}}, function(err, count, result){
	  				console.log("modified callback: " + JSON.stringify(count));
	  				if(err){
	  					console.log("error: " + err);
				    	return res.status(401).json({
				        message: 'Auth failed',
				        });
	  				} else if(count.n == 1 && count.nModified <= 1){
	  					console.log("count = 1");
			  			return res.status(200).json({
				        message: 'User sign in successfull',
				    	});		
	  				} else{
	  					console.log("count != 1");
	  					return res.status(401).json({
				        message: 'Auth failed',
				      	});
	  				}

	  			});

			    // .exec()
			    // .then(result => {
			    //   return res.status(200).json({
			    //     message: 'User sign in successfull',
			    //   });
			    // })
			    // .catch(err => {
			    //   console.log(err);
			    //   return res.status(401).json({
			    //     message: 'Auth failed',
			    //   });
			    // });
			  	//console.log("res : " + res);
				//return res;
	  		}
	  		else{
	  			console.log("error from google api");
	  			return res.status(401).json({
			        message: 'Auth failed',
			    });
	  		}
	  	});
	}
  	else return res.status(401).json({
        message: 'Auth failed',
    });
  })
};

exports.user_sign_out_sltfr = (req, res, next) => {
  const email = req.body.email;
  console.log("email: " + email);
  User.update({$or:[{ user_email : email, company : "sltfr" },{ user_email : email, company : "all" }]}, { $set: {user_id_token : null, session_expiry_time: null}})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User signed out successfully',
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
