'use strict';

const test = require('tape').test;
const proxyquire = require('proxyquire');
const httpMultiStreams = require('../http-multi-streams');
const eventEmitter = require('events').EventEmitter;

const req1 = {
	location: 'http://www.muitochique.com/wp-content/uploads/2012/11/ano-novo-500x307.jpg'
};

const req2 = {
	location: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS2bZdzOUGStsuLVzH79PTGHMoJ0B_ZpUcJylVdveVd4p5oyywvSCRaHSg'
};

const reqs = [req1, req2];

function moduleMock(type) {
	return proxyquire('../http-multi-streams', {'streams': buildStreamEmitters(type)});
}

const buildStreamEmitters = (type) => {
	let emitters = {};
	const emitter = new eventEmitter()
	emitters[req1.location] = emitter;
	setTimeout(() => {
		switch(type) {
			case 'response': 
				emitter.emit('response', {number: 1, args: req1, response: null, stream: null});
				break;
			case 'progress': 
				emitter.emit('progress', {number: 1, args: req1, state: null});
				break;
			case 'end': 
				emitter.emit('end', {number: 1, args: req1});
				break;
			default:
				break;
		}
	}, 0);
	return emitters;
}

test('it throws error if no requests are provided', (assert) => {
	const error = new Error('There is no requests to be made');
	assert.deepEqual(error, httpMultiStreams.streams());
	assert.end();
});

test('it should return 2 stream emitters', (assert) => {
	const nrReqs = Object.keys(httpMultiStreams.streams(reqs)).length;
	assert.equal(nrReqs, 2);
	assert.end();
});

test('it should emit response', (assert) => {
	const resultEmitter = moduleMock('response').streams(reqs);
	resultEmitter[req1.location].on('response', (response) => {
		assert.notEqual(response, null);
		assert.end();
	});
});

test('it should emit progress', (assert) => {
	const resultEmitter = moduleMock('progress').streams(reqs);
	resultEmitter[req1.location].on('progress', (progress) => {
		assert.notEqual(progress, null);
		assert.end();
	});
});

test('it should emit end', (assert) => {
	const resultEmitter = moduleMock('end').streams(reqs);
	resultEmitter[req1.location].on('end', () => {
		assert.pass('request end with success');
		assert.end();
	});
});

test('it should emit error', (assert) => {	
	const resultEmitter = moduleMock('error').streams(reqs);
	resultEmitter[req1.location].on('error', (error) => {
		assert.deepEqual(new Error('some error'), error.err);
		assert.end();
	});
	resultEmitter[req1.location].emit('error', {number: 1, args: req1, err: new Error('some error')});
});

