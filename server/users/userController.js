var User = require('./userModel.js');
var db = require('../config/config.js');
var jwt = require('jwt-simple');
var helpers = require('../config/helpers.js');



module.exports = {
	signin: function(req, res, next) {
		console.log(req.body.email, req.body.password)
		db.select().from('users')
			.where('email', req.body.email)
			.then(function(user) {
				console.log('we have user :', user)
				console.log(' and still have pass: ', req.body.password)
				if (!user) {
					next(new Error('User does not exist!'));
				}
				else {
					User.signin(req.body.email, req.body.password, function(err, match) {
						if (!match) {
							next(new Error('Wrong password!'));
						}
						else {
							var token = jwt.encode(user, 'secret');
							res.json({token: token});
						}
					});
				}
			})
	},

	signup: function (req, res, next) {
		console.log('signing up with: ', req.body)
		db.select().from('users')
			.where('email', req.body.email)
			.then(function (user) {
				if (user.length) {
					next(new Error('User already exists!'));
				} else {
					User.signup(req.body, (err, response) => {
						res.json({token: response});
					})
				}
			})
	},

	getUsers: function(req, res, next) {
		User.getUsers((err, response) => {
			if (err) {
				next(new Error('Couldn\'t find users. '));
			}
			else {
				res.send(response);
			}
		});
	},

	updateUser: function(req, res, next) {
		User.updateUser(req.body, (err, response) => {
			if (err) {
				next(new Error('Couldn\'t save new user.'));
			}
			else {
				res.sendStatus(200);
			}
		})
	},

	currentUser: function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No Token!!!!!!'));
    } else {
    	console.log(' a token: ', token)
      var user = jwt.decode(token, 'secret');
      console.log('heres the current jwt: ', user)
      db.select().from('users').where('email', user[0].email)
    	.then(user => {
    		console.log(user);
    		res.json(user);
    	});
    }
  }
}





