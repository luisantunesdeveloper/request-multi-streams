'use strict';

const httpMultiStreams = require('../');
const chalk = require('chalk');
const fs = require('fs');

const fsStream = fs.createWriteStream;
const stdOut = process.stdout;

const req1 = {
	location: 'http://www.muitochique.com/wp-content/uploads/2012/11/ano-novo-500x307.jpg',
	numberOfRequests: 10,
	stream: fsStream
};

const req2 = {
	location: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS2bZdzOUGStsuLVzH79PTGHMoJ0B_ZpUcJylVdveVd4p5oyywvSCRaHSg',
	numberOfRequests: 10,
	stream: stdOut
};

const reqs = [req1, req2];

function getEmitters() {
	const emitters = httpMultiStreams.emitters(reqs);

	if (emitters) {
		for(var name in emitters) {
			//listen the events
			emitters[name].on('progress', (request) => {
				console.log(chalk.green(`Request ${request.number}: ${Number((request.state.percent * 100).toFixed(1))}%`));
			});

			emitters[name].on('response', (request) => {
				console.log(chalk.green(`Request ${request.number} has finished with sucess`));
			});

			emitters[name].on('error', (request) => {
				console.log(chalk.red(`Request nr. ${request.number} did not finished: ${request.err}`));
			});

			emitters[name].on('end', (request) => {
				console.log(chalk.green(`Request ${request.number} has finished with sucess`));
			});
		}
	}
}

module.exports = getEmitters();

