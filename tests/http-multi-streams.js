'use strict';

const test = require('tape').test;
const httpMultiStreams = require('../http-multi-streams');

const req1 = {
	location: 'http://www.muitochique.com/wp-content/uploads/2012/11/ano-novo-500x307.jpg'
};

const req2 = {
	location: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS2bZdzOUGStsuLVzH79PTGHMoJ0B_ZpUcJylVdveVd4p5oyywvSCRaHSg'
};

const reqs = [req1, req2];

test('it throws error if no requests are provided', (assert) => {
	const error = new Error('There is no requests to be made');
	assert.equal(typeof(error), typeof(httpMultiStreams.streams()));
	assert.end();
});

test('it should return 2 stream emitters', (assert) => {
	let nrReqs = Object.keys(httpMultiStreams.streams(reqs)).length;
	assert.equal(nrReqs, 2);
	assert.end();
});