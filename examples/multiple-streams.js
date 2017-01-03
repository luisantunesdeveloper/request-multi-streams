'use strict';

const httpMultiStreams = require('../');
const chalk = require('chalk');
const fs = require('fs');

const req1 = {
	location: 'http://www.muitochique.com/wp-content/uploads/2012/11/ano-novo-500x307.jpg',
	numberOfRequests: 1000
};

const req2 = {
	location: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS2bZdzOUGStsuLVzH79PTGHMoJ0B_ZpUcJylVdveVd4p5oyywvSCRaHSg',
	numberOfRequests: 1000
};

const reqs = [req1, req2];

function getStreams() {
	const emitters = httpMultiStreams.streams(reqs);

	if (emitters) {
		for(var name in emitters) {
			//listen the events
			emitters[name].on('progress', (progress) => {
				console.log(chalk.green(`Request ${progress.number} for ${progress.args.location}: ${Number((progress.state.percent * 100).toFixed(1))}% complete`));
			});

			emitters[name].on('response', (response) => {
				console.log(chalk.green(`Request ${response.number} for ${response.args.location}: got a response`));
			});

			emitters[name].on('error', (error) => {
				console.log(chalk.red(`Request ${error.number} for ${error.args.location}: finished on error ${error.err}`));
			});

			emitters[name].on('end', (end) => {
				console.log(chalk.green(`Request ${end.number} for ${end.args.location}: finished with sucess`));
			});
		}
	}
}

module.exports = getStreams();

