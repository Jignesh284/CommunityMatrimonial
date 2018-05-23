$(function() {

	$.validator.addMethod('strongPassword', function(value, element){
		return this.optional(element)
		|| value.length >5
		&& /\d/.test(value)
		&& /[a-z]/i.test(value);
		}, 
		'Your password must be atleast 6 character long and must contain atleast one number and one char\.');

	$('#registration-form').validate({
		rules: {
			name:{
				required: true,
			},
			email: {
				required: true,
				email: true,
			},
			mobileNumber:{
				required: true

			},
			password: {
				required: true,
				strongPassword: true,
			},
			cpassword: {
				required:  true,
				equalTo: '#password'
			}
		},

		messages: {
			name: {
				required: '*Please enter your name.'
			},

			email: {
				required: '*Please enter email address',
				email: 'Not an email address',
				
			},
			mobileNumber:{
				required: '*Please enter mobile number'

			},

			password: {
				required: '*Please enter password'
			},
			cpassword: {
				required: '*Please re-enter your password',
				equalTo: 'Password donot match'
			}
		}
	});

	$('#login-form').validate({
		rules: {
			email: {
				required: true,
				email: true,
			},
			password: {
				required: true

			}

		},
		messages: {
			email: {
				required: 'Please enter email address',
				email: 'Not an email address'
			},
			password: {
				required: 'Please enter password'
			}

		}
	});



});