
const schedule = require('node-schedule');
const promise = require('es6-promise');
promise.polyfill();

const chart = require('./chart');
const api = require('./api');
const bot = require('./bot').getBot();

const postMessage = (message) => bot.postMessageToChannel('microclimate', message);

bot.on('start', function() {
	api.getLastN(20).then((json) => {
		const labels = json.map(x => x.timestamp.slice(11, 19));
		const chartData = json.map(x => x.temperature);	
		chart.draw({
			labels,
			chartData,
			threshold: 24.45,
			title: 'Температура, °C'
		});
	});
	
	
	// schedule.scheduleJob('*/5 * * * *', () => {
	// 	fetch('http://10.20.3.49:85/api/CO2/latest')
	// 		.then(response => 
	// 			response.json().then(json => {
	// 				const temp = json.temperature;
	// 				const co2 = json.cO2ppm;
					
	// 				if(temp < 26 && co2 < 650) {
	// 					return;
	// 				}
					
	// 				let message = ' ';
					
	// 				//let message = `\n *${json.timestamp.slice(11, 19)}*`;
					
	// 				if (temp >= 26) {
	// 					message += `\n *Температура: ${temp} °C*`;
	// 				} else {
	// 					message += `\n Температура: ${temp} °C`;
	// 				}
					
	// 				if (co2 >= 650) {
	// 					message += `\n *Влажность: ${json.humidity} %*`;
	// 				} else {
	// 					message += `\n Влажность: ${json.humidity} %`;
	// 				}
					
	// 				message += `\n CO2: ${co2} ppm`;
					
	// 				postMessage(message);
	// 			})
	// 		);
	// });
    
});

bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    console.log("_______________________________________");
	console.log(data);
	// if(data.content && data.content.includes('@microclimate-bot')) {
	// 	if(data.content.includes('latest')) {
	// 		fetch('http://10.20.3.49:85/api/CO2/latest')
	// 			.then(response => {
	// 				response.json().then(postMessage);
	// 			});
	// 	}
	// }
	
});