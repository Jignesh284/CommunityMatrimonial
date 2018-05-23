var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport'); 
const paypal = require('paypal-rest-sdk'); 
const accountFees = require('../config/accountTypeDetails');

paypal.configure({
	'mode': 'sandbox', // sandbox or live
	'client_id': 'AUM75P4ik39XCWLwyXVuee5hWD6x9_IWAexP3kqD2wcS7lVGbHQIjv3v0fvLuZPD9TFT6Phx7ZeSiXsA',
	'client_secret': 'EGyXp3M4TeNYBA4DLamc_luZNZxoHQtvSR-rasc5H6CtG5i3kKTQJ8u3Up2QE9EDIZLhax4zEBuEhdh4',
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('user/login', {title: 'Login'});
});

router.get('/registration', function(req, res, next) {
  res.render('user/registration', { title: 'Registration' });;
});

router.get('/profile', function(req, res, next) {
	res.render('user/profile', { title:'Home', user: user});
});

///////********. LOGIN. ***********////////////

router.post('/login', function(req, res, next){
	var email = req.body.email;
	var password = req.body.password;
	console.log(email);

	User.findOne({'email': email}, function(err, user){
		if(err){
			done(err);
		}
		console.log(user);
		if(!user){
			return done(null, false, { message: 'No User Found.'});
		}
		if(!user.validPassword(password)){
			console.log('I Am Here');
			return done(null, false, { message: 'Incorrect Password.'});
		}
		res.redirect('/user/profile');
	});
});

///////********.   REGISTRATION    .***********////////////

router.post('/registration', function(req, res, next) {
	console.log('In post Registration');
	var name = req.body.name;
	var email = req.body.email;
	var mobileNumber = req.body.mobileNumber;
	var account = req.body.account;
	var password = req.body.password;
	var cpassword = req.body.cpassword;
	

	var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/payment-success",
        "cancel_url": "http://localhost:3000/payment-cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "001",
                "price": "0.00",
                "currency": "INR",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "INR",
            "total": "0.00"
        },
        "description": "This is the payment description."
    }]
   };

	if( account === 'YEARLY_MEMBER' ){
		
	} else if( account === 'LIFE_MEMBER' ) {
		console.log(account);
		create_payment_json.transactions[0].amount.total = accountFees[account];
		create_payment_json.transactions[0].item_list.items[0].price = accountFees[account];
		create_payment_json.transactions[0].item_list.items[0].name = account;
		create_payment_json.transactions[0].description = name +" "+ account+ " Fees";

		 create_payment_json = JSON.stringify(create_payment_json);
		console.log(create_payment_json);

		paypal.payment.create(create_payment_json, function (error, payment) {
		    if (error) {
		        throw error;
            } else {
		          console.log("Create Payment Response");
		        // console.log(payment);
		        // res.send('test');
		        for(let i=0; i<payment.links.length; i++){
		        	if(payment.links[i].rel === 'approval_url'){
		        		res.redirect(payment.links[i].href);
		        	}

		        }
		    }
		});

	} else {
		//Trial member 1 month
		console.log(account);
		var newUser = new User();
		newUser.name = name;
		newUser.email = email;
		newUser.mobileNumber = mobileNumber;
		newUser.password = newUser.encryptPassword(password);

		newUser.save(function(err, result) {
			if(err){
				console.log("error: "+ err);
				//return done(err);
			}
			res.redirect('/');
		});
	}
	
});

router.get('/payment-success', (req, res, next) => {
	const payerId = req.query.PayerId;
	const paymentId = req.query.paymentId;

	const execute_payment_json = {
		"payer_id": payerId,
		"transactions": [{
			"amount": {
				"currency": "INR",
				"total": "25.00"
			}
		}]
	};

	paypal.payment.execute(paymentId, execute_payment_json, function(error, payment){
		if(error){
			console.log(error.response);
			throw error;
		} else {
			console.log("Get Payment response");
			console.log(JSON.stringify(payment));
			res.send('success');

		}
	})
})

router.get('/payment-cancel', (req, res, next) => {
	res.send('failed');

});

module.exports = router;
