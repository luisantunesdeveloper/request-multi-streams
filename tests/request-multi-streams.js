'use strict';

const test = require('tape').test;
const proxyquire = require('proxyquire');
const httpMultiStreams = require('../');
const eventEmitter = require('events').EventEmitter;

const req1 = {
	options: {
		url: 'https://cdn.pixabay.com/photo/2014/03/27/21/10/waterfall-299685_1280.jpg'
	}
};

const req2 = {
	options: {
		url: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS2bZdzOUGStsuLVzH79PTGHMoJ0B_ZpUcJylVdveVd4p5oyywvSCRaHSg'
	}
};

const reqs = [req1, req2];

function moduleMock(type) {
	return proxyquire('../', {'streams': buildStreamEmitters(type)});
}

const buildStreamEmitters = (type) => {
	let emitters = {};
	const emitter = new eventEmitter()
	emitters[req1.options.url] = emitter;
	setTimeout(() => {
		switch(type) {
			case 'response': 
				emitter.emit('response', {reqNumber: 1, args: req1, response: null, stream: null});
				break;
			case 'progress': 
				emitter.emit('progress', {reqNumber: 1, args: req1, progress: null});
				break;
			case 'end': 
				emitter.emit('end', {reqNumber: 1, args: req1});
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
	resultEmitter[req1.options.url].on('response', (response) => {
		assert.notEqual(response, null);
		assert.end();
	});
});

test('it should emit progress', (assert) => {
	const resultEmitter = moduleMock('progress').streams(reqs);
	resultEmitter[req1.options.url].on('progress', (progress) => {
		assert.notEqual(progress, null);
		assert.end();
	});
});

test('it should emit end', (assert) => {
	const resultEmitter = moduleMock('end').streams(reqs);
	resultEmitter[req1.options.url].on('end', () => {
		assert.pass('request end with success');
		assert.end();
	});
});

test('it should emit error', (assert) => {	
	const resultEmitter = moduleMock('error').streams(reqs);
	resultEmitter[req1.options.url].on('error', (error) => {
		assert.deepEqual(new Error('some error'), error.error);
		assert.end();
	});
	resultEmitter[req1.options.url].emit('error', {number: 1, args: req1, error: new Error('some error')});
});

