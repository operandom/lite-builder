'use strict';

const fs      = require('fs');
const http    = require('http');
const url     = require('url');
const path    = require('path');
const mime    = require('mime-types');
const watcher = require('chokidar');
const config  = require('./config.js');


const ROOT = path.normalize(process.cwd() + '/' + config.root);
const INDEX = path.join(ROOT, config.index);
const RELOADER = path.join(__dirname, 'reloader.js');
const PATTERN_WATCH = '\x1b[36m%s\x1b[0m %s';
console.log('\x1b[36m%s\x1b[0m', 'Start watching...');
console.log('\nconfiguration:');
console.dir(config, { colors: true });



// WATCHER


const WATCHER = watcher.watch(ROOT)
  .addListener('all', changeHandler)
  .addListener('error', errorHandler)
;


/**
 * @param {string} event
 * @param {string|Buffer} file
 */
function changeHandler(event, file) {
  file = file.replace(ROOT, '');
  switch (event) {
    case 'add':
      console.log(PATTERN_WATCH, '🞦', file);
      break;

    case 'unlink':
      console.log(PATTERN_WATCH, '🞭', file);
      break;

    case 'change':
      console.log(PATTERN_WATCH, '✎', file);
      break;
  }
}



/**
 * @param {Error} error
 */
function errorHandler(error) {
  console.log(error);
}



// HTTP SERVER


const SERVER = http.createServer();

SERVER.addListener('listening', () => {
  console.log('\nListening');
  console.dir(SERVER.address(), { colors: true });
  console.log('\n');
});


SERVER.addListener('error', error => {
  console.log(error.message);
});



SERVER.addListener('request', requestHandler);


/**
 *
 * @param {IncomingMessage} request
 * @param {ServerResponse} response
 */
function requestHandler(request, response) {
  const pathname = url.parse(request.url).pathname;
  const localPath = pathname === '/' ? INDEX : path.join(ROOT, pathname);
  const isIndex = localPath === INDEX;
  const address = request.connection.remoteAddress
    .split('.')
    .map(value => padStart(value, 3, '0'))
    .join('.')
  ;


  if (request.headers.accept.split(',').indexOf('text/event-stream') !== -1) {
      console.log('\x1b[32m⇋\x1b[0m \x1b[90m%s\x1b[0m %s', address, pathname);

    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    const HANDLER = (event, path) => {
      console.log('\x1b[35m↺\x1b[0m \x1b[90m%s\x1b[0m %s', address, 'close');
      response.write('data: ' + JSON.stringify({ event, path }) +  '\n\n');
    }

    WATCHER.addListener('all', HANDLER);

    response.addListener('close', () => {
      console.log('\x1b[31m⇋\x1b[0m \x1b[90m%s\x1b[0m %s', address, 'close');
      WATCHER.removeListener('all', HANDLER);
      response.removeAllListeners();
    });

    response.addListener('finish', () => {
      console.log('\x1b[31m⇋\x1b[0m \x1b[90m%s\x1b[0m %s', address, 'finish');
      WATCHER.removeListener('all', HANDLER);
      response.removeAllListeners();
    });

  } else {

    response.setHeader('Content-Type', mime.lookup(localPath));
    fs.createReadStream(localPath, { flags: 'r' })
      .once('error', error => {
        console.log('\x1b[31m❱\x1b[0m \x1b[90m%s\x1b[0m %s', address, error.message);
        notFound(response);
      })
      .once('end', () => {
        console.log('\x1b[32m❱\x1b[0m \x1b[90m%s\x1b[0m %s', address, pathname);
        if (!isIndex) {
          return;
        }
        response.write('<script>');
        fs.createReadStream(RELOADER, { flags: 'r' })
          .once('end', () => {
            response.write('</script>');
            response.end();
          })
          .pipe(response, { end: false })
        ;
      })
      .pipe(response, { end: !isIndex })
    ;

  }


}


SERVER.listen(config.port, config.hostname);



// TOOLS


function notFound(response) {
  response.statusCode = 404;
  response.end();
}


/**
 * @param {string} input
 * @param {number} count
 * @param {string} pad
 */
function padStart(input, count, pad) {
    return (pad || ' ').repeat(count - input.length).substr(0,count) + input;
};


/**
 * @param {string} input
 * @param {number} count
 * @param {string} pad
 */
function padEnd(input, count, pad) {
  return Object.assign(
    (pad || ' ').repeat(count).split(''),
    input.split('')
  ).join('');
}

