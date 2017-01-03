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
 * Get a streams for locations. Build an iterable in the process.
 * @param {Object} args 
 *
 * @return {Object} EventEmitter
 */
function get(args) {
    const iterable = createIterable(args.numberOfRequests || defaultNumberOfRequests);
    const emitter = new eventEmitter();
    for (const i of iterable) {
        let reqNumber = i + 1;
        const stream = progress(request(args.options.url), args.progressOptions)
            .on('response', (response) => {
                emitter.emit('response', {reqNumber: reqNumber, args: args, response: response, stream: stream});
            })
            .on('progress', (progress) => {
                emitter.emit('progress', {reqNumber: reqNumber, args: args, progress: progress});
            })
            .on('end', () => {
                emitter.emit('end', {reqNumber: reqNumber, args: args});
            })
            .on('error', (error) => {
                emitter.emit('error', {reqNumber: reqNumber, args: args, error: error});
            });
    }
    return emitter;
}

/**
 * Dispatches the requests.
 * @param {Array} requests
 * @return {Object} the key is the url for each request/response
 */
function streams(requests) {
    if (!requests) {
        return new Error('There is no requests to be made');
    }
    let emitters = {};
    for(const request of requests) {
        emitters[request.options.url] = get(request);
    }
    return emitters;
}

module.exports = {
    streams: streams
};

