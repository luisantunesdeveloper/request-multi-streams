[![Build Status](https://travis-ci.org/luisantunesdeveloper/request-multi-streams.svg?branch=master)](https://travis-ci.org/luisantunesdeveloper/request-multi-streams)
[![Test Coverage](https://codeclimate.com/github/luisantunesdeveloper/request-multi-streams/badges/coverage.svg)](https://codeclimate.com/github/luisantunesdeveloper/request-multi-streams/coverage)
# request-multi-streams
This library wraps multiple http get requests using request/request and IndigoUnited/node-request-progress to different locations at the same time. The streams are handed and can be piped as they come, along with the progress. You can even repeat a request multiple times.

## Install
yarn add request-multi-streams

## Usage
See examples and tests to get more detail about the requests and responses.  

### Requests
Since this module wraps request and request-progress, it supports the same options for both.
```
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
	numberOfRequests: 10 // Not the same as retries, request-multi-streams internal usage.
};

// receives an array of requests
const streamEmitters = httpMultiStreams.streams([req1, req2]);
```

### Responses
You can do whatever you want with the streams. In this case we are piping the streams for the request name 'http://www.textfiles.com/fun/acronym.txt' to a file. See examples folder for more info.
```
for(var name in emitters) {
	//listen the events
	emitters[name].on('progress', (data) => {
		console.log(chalk.yellow(`Request ${data.reqNumber} for ${data.args.options.url}: ${Number((data.progress.percent * 100).toFixed(1))}% complete`));
	});

	emitters[name].on('response', (data) => {
		console.log(chalk.yellow(`Request ${data.reqNumber} for ${data.args.options.url}: got a response`));
		if (name === 'http://www.textfiles.com/fun/acronym.txt') {
			data.stream.pipe(fs.createWriteStream(`${__dirname}/${data.reqNumber}`));
		}
	});
}
```

### Major dependencies
https://www.npmjs.com/package/request  
https://www.npmjs.com/package/request-progress

### Works with node > 4.5

