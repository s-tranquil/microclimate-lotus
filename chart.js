const ChartjsNode = require('chartjs-node');


getChartJsOptions = ({ labels, chartData, threshold, title }) => {
	console.log(chartData);

	const getColor = value => 
		value >= threshold 
			? "red" 
			: "green";

	const getColors = chartData => 
		chartData.map(getColor);

	const colors = getColors(chartData);

	return {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [{
				label: title,
				backgroundColor: colors,
				borderColor: colors,
				data: chartData
			}]
		},
		// data: {
		// 	//labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
		// 	datasets: [{
		// 		label: 'Температура, °C',
		// 		data: tempData,
		// 		backgroundColor: "red"
		// 		// color: function(context) {
		// 		// 	var index = context.dataIndex;
		// 		// 	var value = context.dataset.data[index];

		// 		// 	console.log(context);

		// 		// 	return value > 26 ? "red" : "blue";
		// 		// }
		// 	}]
		// },
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:false
					}
				}]
			}
		}
	};
}

module.exports = {
	draw: function ({ labels, chartData, threshold, title }) {
		const chartNode = new ChartjsNode(1000, 600);

		const chartOptions = getChartJsOptions({ labels, chartData, threshold, title });

		return chartNode.drawChart(chartOptions)
			.then(() => {
				// chart is created

				// get image as png buffer
				return chartNode.getImageBuffer('image/png');
			})
			.then(buffer => {
				Array.isArray(buffer) // => true
				// as a stream
				return chartNode.getImageStream('image/png');
			})
			.then(streamResult => {
				// using the length property you can do things like
				// directly upload the image to s3 by using the
				// stream and length properties
				streamResult.stream // => Stream object
				streamResult.length // => Integer length of stream
				// write to a file
				const fileName = `./temp/chart-${new Date().getTime()}.png`;

				chartNode.writeImageToFile('image/png', fileName);
				return fileName;
			})
			.then((fileName) => {
				console.log(fileName);
				// chart is now written to the file path
				// ./testimage.png
			});
	}
};