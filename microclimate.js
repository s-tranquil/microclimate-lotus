
const schedule = require('node-schedule');
var fs = require('fs');
const promise = require('es6-promise');
promise.polyfill();

const chart = require('./chart');
const api = require('./api');
const uploader = require('./uploader');
const bot = require('./bot').getBot();

const postMessage = (message, params) => bot.postMessageToChannel('microclimate', message, params);

const TEMP_THRESHOLD = 26;

const uploadTemperatureChart = () => 
	api.getLastN(10).then((json) => {
		const labels = json.map(x => x.timestamp.slice(11, 19));
		const chartData = json.map(x => x.temperature);	
		const title = 'Температура, °C';

		chart
			.draw({
				labels,
				chartData,
				threshold: TEMP_THRESHOLD,
				title
			})
			.then(uploader.uploadImage);
	});

bot.on('start', function() {
	
	schedule.scheduleJob('*/15 * * * *', () => {
		api.getLatest().then(json => {
			if(json.temperature >= TEMP_THRESHOLD) {
				uploadTemperatureChart();
			}
		});
	});
    
});

bot.on('message', function(data) {
    console.log("_______________________________________");
	console.log(data);

	if(data.content && data.content.includes('@microclimate-bot')) {
		if(data.content.includes('temp')) {
			uploadTemperatureChart();
		}
	}
});