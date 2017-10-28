/*!
    Project: Catch & Run X
    Date: 08/14/2017
    Author: Nicolas M. Pardo
*/

/*jshint esversion: 6 */



// REQUIRE MODULES
import jQuery from 'jquery'
import Cookies from 'js-cookie'
// require('js-cookie');


jQuery.noConflict();

//Global Objects
let global = {
	development: true,
	headers: {}
};

console.log(window.Cookies);
//Constants
const BACK_URL = 'http://localhost:3000/';

window.onload = function () {
	checkTokens();
}

function devLog(object) {
	if (global.development) {
		console.log(object);
	}
}

function checkTokens() {
	global_headers = getHeaders();
	if (Cookies.get('token')) {
		Cookies.set('token', token);
		global_headers = getHeaders();
		return {
			success: true,
			data: {
				headers: global[headers],
				token: token
			}
		};
	} else {
		devLog('no token');
	}
}

function getHeaders() {
	let return_value;
	jQuery.get({
		url: `${BACK_URL}get_headers`,
		data: '',
		success: function (data) {
			return_value = {
				"APP-TOKEN": data
			}
		}
	});
	return return_value;

}