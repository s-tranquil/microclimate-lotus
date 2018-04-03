const ChartjsNode = require('chartjs-node');
const Chart = require('chart.js');

Chart.plugins.register({
	beforeDraw: function(chartInstance) {
	  var ctx = chartInstance.chart.ctx;
	  ctx.fillStyle = "white";
	  ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
	}
});

getChartJsOptions = ({ labels, chartData, threshold, thresholdBad, title }) => {
	console.log(chartData);

	const getColor = value => {
		if (value >= thresholdBad) {
			return "red";
		}
		if (value >= threshold) {
			return "yellow";
		}
		return "green";
	}

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
		options: {
			scales: {
				yAxes: [{
					ticks: {
						suggestedMin: Math.min(...chartData) - 0.2,
						beginAtZero:false,
						fontSize: 30
					}
				}],
				xAxes: [{
					ticks: {
						fontSize: 30
					}
				}]
			},
			layout: {
				padding: {
					left: 30
				}
			}
		}
	};
}

module.exports = {
	draw: function ({ labels, chartData, threshold, thresholdBad, title }) {
		const chartNode = new ChartjsNode(600, 400);

		const chartOptions = getChartJsOptions({ labels, chartData, threshold, thresholdBad, title });

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

				return chartNode
					.writeImageToFile('image/png', fileName)
					.then(() => fileName);
			});
	}
};