'use strict';

const httpMultiStreams = require('../');
const chalk = require('chalk');
const fs = require('fs');

const req1 = {
	options: {
		url: 'https://cdn.pixabay.com/photo/2014/03/27/21/10/waterfall-299685_1280.jpg'
	},
	numberOfRequests: 1000 // Not the same as retries
};

const req2 = {
	options: {
		url: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS2bZdzOUGStsuLVzH79PTGHMoJ0B_ZpUcJylVdveVd4p5oyywvSCRaHSg'
	},
	progressOptions: {
	    throttle: 0,                    // Throttle the progress event to 2000ms, defaults to 1000ms 
	    delay: 10,                       // Only start to emit after 1000ms delay, defaults to 0ms 
	    // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length 
	},
	numberOfRequests: 10 // Not the same as retries
};

const reqs = [req1, req2];

function getStreams() {
	const emitters = httpMultiStreams.streams(reqs);

	if (emitters) {
		for(var name in emitters) {
			//listen the events
			emitters[name].on('progress', (data) => {
				console.log(chalk.yellow(`Request ${data.reqNumber} for ${data.args.options.url}: ${Number((data.progress.percent * 100).toFixed(1))}% complete`));
			});

			emitters[name].on('response', (data) => {
				console.log(chalk.yellow(`Request ${data.reqNumber} for ${data.args.options.url}: got a response`));
			});

			emitters[name].on('error', (error) => {
				console.log(chalk.red(`Request ${error.reqNumber} for ${error.args.options.url}: finished on error ${error.error}`));
			});

			emitters[name].on('end', (end) => {
				console.log(chalk.green(`Request ${end.reqNumber} for ${end.args.options.url}: finished with sucess`));
			});
		}
	}
}

module.exports = getStreams();

