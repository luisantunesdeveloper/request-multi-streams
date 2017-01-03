'use strict';

const request = require('request');
const progress = require('request-progress');
const eventEmitter = require('events').EventEmitter;

// defaults
const defaultNumberOfRequests = 1;

/**
 * Creates an iterable Array that is going to assist the async requests
 * @param {Int} n Number of iterations (Array size)
 * @return {Array} Iterable array filled with integers
 */
function createIterable(n) {
    var arr = Array.apply(null, Array(n));
    return arr.map((x, i) => {
        return i;
    });
}

/**
 *
 * Get a stream for a location
 * @param {Object} args 
 *
 * @return {Object} EventEmitter
 */
function get(args) {
    const iterable = createIterable(args.numberOfRequests || defaultNumberOfRequests);
    const emitter = new eventEmitter();
    for (const i of iterable) {
        let reqNumber = i + 1;
        const stream = progress(request(args.location))
            .on('response', (response) => {
                emitter.emit('response', {number: reqNumber, args: args, response: response, stream: stream});
            })
            .on('progress', (state) => {
                emitter.emit('progress', {number: reqNumber, args: args, state: state});
            })
            .on('end', () => {
                emitter.emit('end', {number: reqNumber, args: args});
            })
            .on('error', (err) => {
                emitter.emit('error', {number: reqNumber, args: args, err: err});
            });
    }
    return emitter;
}

function emitters(requests) {
    let emitters = {};
    for(const request of requests) {
        emitters[request.location] = get(request);
    }
    return emitters;
}

module.exports = {
    emitters: emitters
};

