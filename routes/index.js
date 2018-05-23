var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
var config = require('../config/auth');
const multer = require('multer');

const multerConfig = {
  storage : multer.diskStorage({
    destination: function(req, file, next){
      next(null, './public/uploadedImages');
    },
    filename : function(req, file, next){
    	const ext = file.mimetype.split('/')[1];
    	next(null, 'abc.' + ext);
        console.log(file);
    },
    fileFilter : function(req, file, next){
    	if(!file){
    		next();
    	}
    	const image = file.mimetype.startsWith('image/');
    	if(image){
    		next(null, true);
    	} else {
    		next({message: 'File type not supported' });
    	}
    } 

  })

}

var transpoterGmail =  nodemailer.createTransport({
	service: 'gmail',
	secure: false,
	auth: {
		user: config.username,
		pass: config.password,
	},
	tls: {
			rejectUnauthorised: false
	}	
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/gallery', function(req, res, next) {
  res.render('gallery', { title: 'Gallery' });
});

router.get('/edit-profile', function(req, res, next){
	res.render('edit-profile', { title: 'Edit Profile'});
});

router.post('/save-profile', multer(multerConfig).single('photo'), function(req, res, next){
		res.send('this is post route save profile');
});

router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Profile' });
});

router.post('/contact-us',function(req, res, next) {
	console.log('In contact Us form');

	var name = req.body.name;
	var visitersEmail = req.body.email;
	var message = req.body.message;
	var internalOptions = {
	from:  name +' <'+ visitersEmail +'>',
	to: config.email,
	subject: 'Matrimonial Message from ' + name,
	text: message
};
var visitorOptions = {
	from: 'Matrimonial <jigneshmodi.developer@gmail.com>',
	to:  visitersEmail,
	subject: 'Reply mail <noreply@matrimonial.com>',
	text: 'Thank you for contacting us. Our team will get back to you shortly!'
};


	transpoterGmail.sendMail(internalOptions, function(err, res){
		
		if(err){
			console.log(err);
			
		} else {
			console.log("Email is sent!");  
			
		}

	});
	msg =null;
	
	var msg = transpoterGmail.sendMail(visitorOptions, (err, res) => {
		
		if(err){
			console.log(err);
			message = "Sorry could not end mail Try after some time";
			console.log(message);
			return message;
			
		} else {
			console.log("Email is sent!");  
			message = "Thank you for reaching out to us!";
			console.log(message);
			return message;
		}


	});
	res.render('status', { title: 'Status', message: msg });
	
});

router.get('/status', function(req, res, next) {
  res.render('status', { title: 'Status', message: 'Timepass' });
});


module.exports = router;
