/*!
    Project: Catch & Run X
    Date: 08/14/2017
    Author: Nicolas M. Pardo
*/

/*jshint esversion: 6 */

jQuery.noConflict();

//Global Variables
let
	sign_up_form,
	login_form,
	sign_up_btn,
	login_btn,
	login_container,
	sign_up_container,
	close_btn,
	anonymous_elem,
	user_elem,
	current_user,
	user_info;

//Global Objects
let global = {
	development: false,
	headers: {}
};

let fifteen_minutes = new Date(new Date().getTime() + 15 * 60 * 1000);

//Constants
const BACK_URL = global.development ? 'http://localhost:3000' : 'http://heroku.bla.bla';



// Setup Prototypes
HTMLElement.prototype.beforeDisplay = '';

HTMLElement.prototype.hide = function () {
	this.beforeDisplay = this.style.display;
	this.style.visibility = 'hidden';
	this.style.display = 'none';
};

HTMLElement.prototype.show = function () {
	this.style.visibility = 'visible';
	if (this.beforeDisplay && this.beforeDisplay !== 'none') {
		this.style.display = this.beforeDisplay;
	} else {
		this.style.display = 'inherit';
	}
};

// Set Headers if the cookies exist
jQuery(document).ajaxSend((event, request) => {

	if (Cookies.get('device_token')) {
		request.setRequestHeader(
			'APP-DEVICE-TOKEN', Cookies.get('device_token')
		);
	}
	if (Cookies.get('token')) {
		request.setRequestHeader(
			'APP-TOKEN', Cookies.get('token')
		);
	}
});


function devLog(object) {
	if (global.development) {
		console.log(object);
	}
}


function currentUser() {
	let return_value = false;
	jQuery.ajax({
		type: 'GET',
		url: `${BACK_URL}/current_user`,
		data: '',
		success: (data, status, info) => {

			return_value = true;
			if (data.success) {
				showUser();
				renderUser(data.user);
				devLog('we have a user!');
			} else {
				showAnonymous();
			}
		},
		error: (data, status, info) => {
			devLog(data);
			showAnonymous();
		}
	});
	return return_value;
}

function showUser() {
	user_elem.forEach((elem) => {
		elem.show();
	});
	anonymous_elem.forEach((elem) => {
		elem.hide();
	});
}

function showAnonymous() {
	user_elem.forEach((elem) => {
		elem.hide();
	});
	anonymous_elem.forEach((elem) => {
		elem.show();
	});
}

function signUp(e) {
	devLog('signing up');
	e.preventDefault();
	let form_data = jQuery(sign_up_form).serialize();
	jQuery.ajax({
		type: 'POST',
		url: `${BACK_URL}/users`,
		data: form_data,
		success: (data, status, info) => {
			devLog(data);
		},
		error: (data, status, info) => {
			devLog(data);
		}
	});
}

function login(e) {
	devLog('logging in');
	e.preventDefault();
	let form_data = jQuery(login_form).serialize();
	jQuery.ajax({
		type: 'POST',
		url: `${BACK_URL}/sessions/create`,
		data: form_data,
		success: (data, status, info) => {
			if (data.success) {
				Cookies.set('token', data.meta.token, {
					expires: fifteen_minutes
				});
				Cookies.set('device_token', data.meta.device_token, {
					expires: 365
				});
				currentUser();
				login_container.hide();
			}
		},
		error: (data, status, info) => {
			devLog(data);
		}
	});

}

function renderUser(user) {
	user_info.forEach((elem) => {
		elem.innerText = user[elem.dataset.user];
	});
}



// Window Ready (Using jQuery to avoid conflicts)
jQuery(document).ready(() => {


	// Load Elements
	sign_up_form = document.getElementById('sign_up_form');
	login_form = document.getElementById('login_form');
	sign_up_container = document.getElementById('sign_up_container');
	login_container = document.getElementById('login_container');

	//Load HTMLCollections
	sign_up_btn = document.querySelectorAll('.sign_up_btn');
	login_btn = document.querySelectorAll('.login_btn');
	close_btn = document.querySelectorAll('.close_btn');
	user_elem = document.querySelectorAll('.user_elem');
	anonymous_elem = document.querySelectorAll('.anonymous_elem');
	user_info = document.querySelectorAll('.user_info');


	//Event Listeners
	login_btn.forEach((element) => {
		element.addEventListener('click', () => {
			login_container.show();
			sign_up_container.hide();
			devLog('login!');
		});
	});

	sign_up_btn.forEach((element) => {
		element.addEventListener('click', () => {
			login_container.hide();
			sign_up_container.show();
			devLog('sign up!');
		});
	});

	close_btn.forEach((element) => {
		element.addEventListener('click', () => {
			login_container.hide();
			sign_up_container.hide();
			devLog('closed!');
		});
	});

	// Set Headers
	setInterval(currentUser(), 840000);

	//Create User
	jQuery(sign_up_form).submit((e) => (signUp(e)));

	//Create Session
	jQuery(login_form).submit((e) => (login(e)));


});