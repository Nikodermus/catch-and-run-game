/*!
    Project: Catch & Run X
    Date: 08/14/2017
    Author: Nicolas M. Pardo
*/

/*jshint esversion: 6 */
let moment = require('moment');


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
	user_info,
	open_img,
	fancyboxes;

//Global Objects
let global = {
	development: true
};

let fifteen_minutes = new Date(new Date().getTime() + 15 * 60 * 1000);

//Constants
const BACK_URL = global.development ? 'http://localhost:3000' : 'http://game.api.dakio.co';
const current_page = getPageName(jQuery(location).attr('pathname'));


// Setup Prototypes

HTMLElement.prototype.hide = function () {
	this.style.visibility = 'hidden';
	this.style.display = 'none';
};

HTMLElement.prototype.show = function () {
	this.style.visibility = 'visible';
	this.style.display = 'block';
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

function getPageName(url) {
	url = url.toString();
	var index = url.lastIndexOf("/") + 1;
	var filenameWithExtension = url.substr(index);
	var filename = filenameWithExtension.split(".")[0];
	return filename;
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
				devLog(data);
				setTokens(data.meta);
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
			if (data.success) {
				Cookies.set('token', data.meta.token, {
					expires: fifteen_minutes
				});
				Cookies.set('device_token', data.meta.device_token, {
					expires: 365
				});
				currentUser();
				sign_up_container.hide();
			} else {
				renderError(data.responseJSON.message);
			}
		},
		error: (data, status, info) => {
			devLog(data);
			renderError(data.responseJSON.message);
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
				setTokens(data.meta);
				currentUser();
				login_container.hide();
			} else {
				renderError(data.responseJSON.message);
			}
		},
		error: (data, status, info) => {
			renderError(data.responseJSON.message);
		}
	});

}

function setTokens(data) {
	if (data.token) {
		Cookies.set('token', data.token, {
			expires: fifteen_minutes
		});
	}
	if (data.device_token) {
		Cookies.set('device_token', data.device_token, {
			expires: 365
		});
	}
}

function renderUser(user) {
	user_info.forEach((elem) => {
		elem.innerText = user[elem.dataset.user];
	});
}

function loadMyProfile() {
	jQuery.ajax({
		type: 'GET',
		url: `${BACK_URL}/my_profile`,
		success: (data, status, info) => {
			if (data.success) {
				devLog(data);
				renderProfile(data);
			} else {
				renderError(data.message);
				window.location.href = 'index.html';
			}
		},
		error: (data, status, info) => {
			window.location.href = 'index.html';
		}
	});
}

function renderProfile(profile) {
	//Render Profile
	renderUser(profile.user);
	let profile_img = document.getElementById('profile_img');

	profile_img.src = profile.user.img_path ? profile.user.img_path : 'http://game.dakio.co/assets/images/default.jpg';

	if (profile.best_games.length) {
		let best_games_container = document.getElementById('best_games');
		best_games_container.innerHTML = '';

		//Fill each TR
		for (let game of profile.best_games) {
			let date = game.created_at.substr(0, game.created_at.lastIndexOf('.'));
			let created_at_moment = moment(date)
				.local()
				.format('DD MMM[,] YYYY');

			let tr = document.createElement('tr');
			let td1 = document.createElement('td');
			let td2 = document.createElement('td');
			let td3 = document.createElement('td');
			let td4 = document.createElement('td');

			let a = document.createElement('a');
			a.href = game.img_path;
			a.classList = ['open_img'];

			let i = document.createElement('i');
			i.classList = 'icon icon-nikodermus';

			a.appendChild(i);
			td1.appendChild(a);

			td2.innerText = created_at_moment;
			td3.innerText = game.score;
			td4.innerText = game.difficulty;

			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			tr.appendChild(td4);

			best_games_container.appendChild(tr);
		}
	}

	//Render Last Games
	if (profile.latest_games.length) {
		let latest_games_container = document.getElementById('latest_games');
		latest_games_container.innerHTML = '';

		//Fill each TR
		for (let game of profile.latest_games) {
			let date = game.created_at.substr(0, game.created_at.lastIndexOf('.'));
			let created_at_moment = moment(date)
				.local()
				.format('DD MMM[,] YYYY');

			let tr = document.createElement('tr');
			let td1 = document.createElement('td');
			let td2 = document.createElement('td');
			let td3 = document.createElement('td');
			let td4 = document.createElement('td');

			let a = document.createElement('a');
			a.href = game.img_path;
			a.classList = ['open_img'];

			let i = document.createElement('i');
			i.classList = 'icon icon-nikodermus';

			a.appendChild(i);
			td1.appendChild(a);

			td2.innerText = created_at_moment;
			td3.innerText = game.score;
			td4.innerText = game.difficulty;

			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			tr.appendChild(td4);

			latest_games_container.appendChild(tr);
		}
	}


	open_img = document.querySelectorAll('.open_img');
	open_img.forEach((element) => {
		element.addEventListener('click', (e) => {
			e.preventDefault();
			openImage(e);
		}, false);
	});

	document.body.show();


}

function openImage(event) {
	devLog('opening image');
	event.preventDefault();
	let img = event.target.closest('a').href;
	document.querySelector('#image_fancybox img').src = img;
	document.querySelector('#image_fancybox').show();
}

function renderError(string) {
	devLog(string);
	if (Array.isArray(string)) {
		string = string[0];
	}
	let div = document.createElement('div');
	div.classList = 'error';
	div.innerHTML = `Oops: ${string}`;
	document.body.appendChild(div);
	setTimeout(function () {
		document.body.removeChild(div);
	}, 3000);
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
	open_img = document.querySelectorAll('.open_img');
	fancyboxes = document.querySelectorAll('.fancybox');


	//Event Listeners
	login_btn.forEach((element) => {
		element.addEventListener('click', () => {
			login_container.show();
			sign_up_container.hide();
			devLog('login!');
		});
	});

	fancyboxes.forEach((element) => {
		element.addEventListener('click', (e) => {
			if (element === e.target) {
				element.parentElement.hide();
			}
		});
	});

	open_img.forEach((element) => {
		element.addEventListener('click', (e) => {
			e.preventDefault();
			openImage(e);
		}, false);
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

	//My Profile Actions
	if (current_page === 'my_profile') {
		loadMyProfile();
	}

	//Create User
	jQuery(sign_up_form).submit((e) => (signUp(e)));

	//Create Session
	jQuery(login_form).submit((e) => (login(e)));


});