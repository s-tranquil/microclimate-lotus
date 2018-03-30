const promise = require('es6-promise');
require('isomorphic-fetch');

promise.polyfill();

const API_URI = "http://10.20.3.49:85/api/CO2";


const getDataFromRequest = response => response.json();

const getToday = () => fetch(API_URI + '/today').then(getDataFromRequest);
const getLatest = () => fetch(API_URI + '/latest').then(getDataFromRequest);

module.exports = {
	getLatest,
    getToday,
    getLastN: function (n) {
        return getToday().then((data) => {
            return data.slice(-n);
        });
    }
}