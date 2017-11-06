/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ({

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*!
    Project: Catch & Run X
    Date: 08/14/2017
    Author: Nicolas M. Pardo
*/

/*jshint esversion: 6 */

jQuery.noConflict();

//Global Variables
var sign_up_form = void 0,
    login_form = void 0,
    sign_up_btn = void 0,
    login_btn = void 0,
    login_container = void 0,
    sign_up_container = void 0,
    close_btn = void 0,
    anonymous_elem = void 0,
    user_elem = void 0,
    current_user = void 0,
    user_info = void 0;

//Global Objects
var global = {
	development: true,
	headers: {}
};

var fifteen_minutes = new Date(new Date().getTime() + 15 * 60 * 1000);

//Constants
var BACK_URL = global.development ? 'http://localhost:3000' : 'http://heroku.bla.bla';

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
jQuery(document).ajaxSend(function (event, request) {

	if (Cookies.get('device_token')) {
		request.setRequestHeader('APP-DEVICE-TOKEN', Cookies.get('device_token'));
	}
	if (Cookies.get('token')) {
		request.setRequestHeader('APP-TOKEN', Cookies.get('token'));
	}
});

function devLog(object) {
	if (global.development) {
		console.log(object);
	}
}

function currentUser() {
	var return_value = false;
	jQuery.ajax({
		type: 'GET',
		url: BACK_URL + '/current_user',
		data: '',
		success: function success(data, status, info) {

			return_value = true;
			if (data.success) {
				showUser();
				renderUser(data.user);
				devLog('we have a user!');
			} else {
				showAnonymous();
			}
		},
		error: function error(data, status, info) {
			devLog(data);
			showAnonymous();
		}
	});
	return return_value;
}

function showUser() {
	user_elem.forEach(function (elem) {
		elem.show();
	});
	anonymous_elem.forEach(function (elem) {
		elem.hide();
	});
}

function showAnonymous() {
	user_elem.forEach(function (elem) {
		elem.hide();
	});
	anonymous_elem.forEach(function (elem) {
		elem.show();
	});
}

function signUp(e) {
	devLog('signing up');
	e.preventDefault();
	var form_data = jQuery(sign_up_form).serialize();
	jQuery.ajax({
		type: 'POST',
		url: BACK_URL + '/users',
		data: form_data,
		success: function success(data, status, info) {
			devLog(data);
		},
		error: function error(data, status, info) {
			devLog(data);
		}
	});
}

function login(e) {
	devLog('logging in');
	e.preventDefault();
	var form_data = jQuery(login_form).serialize();
	jQuery.ajax({
		type: 'POST',
		url: BACK_URL + '/sessions/create',
		data: form_data,
		success: function success(data, status, info) {
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
		error: function error(data, status, info) {
			devLog(data);
		}
	});
}

function renderUser(user) {
	user_info.forEach(function (elem) {
		elem.innerText = user[elem.dataset.user];
	});
}

// Window Ready (Using jQuery to avoid conflicts)
jQuery(document).ready(function () {

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
	login_btn.forEach(function (element) {
		element.addEventListener('click', function () {
			login_container.show();
			sign_up_container.hide();
			devLog('login!');
		});
	});

	sign_up_btn.forEach(function (element) {
		element.addEventListener('click', function () {
			login_container.hide();
			sign_up_container.show();
			devLog('sign up!');
		});
	});

	close_btn.forEach(function (element) {
		element.addEventListener('click', function () {
			login_container.hide();
			sign_up_container.hide();
			devLog('closed!');
		});
	});

	// Set Headers
	setInterval(currentUser(), 840000);

	//Create User
	jQuery(sign_up_form).submit(function (e) {
		return signUp(e);
	});

	//Create Session
	jQuery(login_form).submit(function (e) {
		return login(e);
	});
});

/***/ })

/******/ });