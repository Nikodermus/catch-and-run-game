/*!
    Project: Catch & Run X
    Date: 08/14/2017
    Author: Nicolas M. Pardo
*/

/*jshint esversion: 6 */



// REQUIRE MODULES
import jQuery from 'jquery';
import Cookies from 'js-cookie';
// require('js-cookie');


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
	hide_anonymous,
	hide_user;

//Global Objects
let global = {
	development: true,
	headers: {}
};

let fifteen_minutes = new Date(new Date().getTime() + 15 * 60 * 1000);

//Constants
const BACK_URL = global.development ? 'http://localhost:3000' : 'http://heroku.bla.bla';



function devLog(object) {
	if (global.development) {
		console.log(object);
	}
}




function refreshToken(params) {

}

function currentUser() {
	let return_value = false;
	jQuery.ajax({
		type: 'GET',
		url: `${BACK_URL}/current_user`,
		data: '',
		success: (data, status, info) => {
			devLog(data);
			return_value = true;
		},
		error: (data, status, info) => {
			devLog(data);
		}
	});
	return return_value;
}

function hideShowOnUser() {
	if (currentUser()) {
		hide_user.forEach((element) => {
			element.classList.remove = 'hidden';
		});
		hide_anonymous.forEach((element) => {
			element.classList.add = 'hidden';
		});
	} else {
		hide_user.forEach((element) => {
			element.classList.remove = 'hidden';
		});
		hide_anonymous.forEach((element) => {
			element.classList.add = 'hidden';
		});
	}
}

function signUp() {
	jQuery(sign_up_form).submit((e) => {
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
	});
}

function login(e) {
	e.preventDefault();
	let form_data = jQuery(login_form).serialize();
	jQuery.ajax({
		type: 'POST',
		url: `${BACK_URL}/sessions/create`,
		data: form_data,
		success: (data, status, info) => {
			devLog(data);
			Cookies.set('token', data.meta.token, {
				expires: fifteen_minutes
			});
			Cookies.set('device_token', data.meta.device_token, {
				expires: 365
			});
			hideShowOnUser();
		},
		error: (data, status, info) => {
			devLog(data);
		}
	});

}

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
	hide_user = document.querySelectorAll('hide_user');
	hide_anonymous = document.querySelectorAll('hide_anonymous');


	//Event Listeners
	login_btn.forEach((element) => {
		element.addEventListener('click', () => {
			login_container.style.visibility = 'hidden';
			sign_up_container.style.visibility = 'hidden';
			devLog('login!');
		});
	});

	sign_up_btn.forEach((element) => {
		element.addEventListener('click', () => {
			login_container.style.visibility = 'hidden';
			sign_up_container.style.visibility = 'hidden';
			devLog('sign up!');
		});
	});

	close_btn.forEach((element) => {
		element.addEventListener('click', () => {
			login_container.style.visibility = 'hidden';
			sign_up_container.style.visibility = 'hidden';
			devLog('closed!');
		});
	});

	//Is there a current user?
	hideShowOnUser();

	//Create User
	jQuery(sign_up_form).submit((e) => (signUp(e)));

	//Create Session
	jQuery(login_form).submit((e) => (login(e)));


});