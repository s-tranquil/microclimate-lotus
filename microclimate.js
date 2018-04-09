
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
const TEMP_THRESHOLD_BAD = 28;

const uploadTemperatureChart = () => 
	api.getLastN(33).then((json) => {
		const data = json.filter((x, i) => i % 8 === 0);

		const labels = data.map(x => x.timestamp.slice(11, 16));
		const chartData = data.map(x => x.temperature);	
		const title = 'Температура, °C';

		chart
			.draw({
				labels,
				chartData,
				threshold: TEMP_THRESHOLD,
				thresholdBad: TEMP_THRESHOLD_BAD,
				title
			})
			.then(uploader.uploadImage);
	});

bot.on('start', function() {
	
	schedule.scheduleJob('*/20 * * * *', () => {
		api.getLatest().then(json => {
			if(json.temperature >= TEMP_THRESHOLD_BAD) {
				uploadTemperatureChart();
			}
		});
	});

	schedule.scheduleJob('0 * * * *', () => {
		api.getLatest().then(json => {
			const t = json.temperature;
			if(t >= TEMP_THRESHOLD && t < TEMP_THRESHOLD_BAD) {
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