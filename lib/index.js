var fs = require('fs'),
    fork = require('child_process').fork,
    cycle = require('./cycle');

var flxRepo = {},
    minions = {},
    options = {
      allowFlxOverwrite: false, // disallow the redifinition of fluxion (it will mess with remote fluxion)
      immediateDeploy: true, // Deploy minions immediatly after initialisation
    };

/* TODO a fluxion is an entry point for execution distributed over the network.
   It makes sense to say that multiple fluxions can share the same heap (but not scope), because they are on the same minion.
   So minions assure the low-level isolation, and fluxion assure the higher-level isolation.
   During the registration phase, the library should gather fluxion by minions, and then creates minions, so that the fluxions can actually share the heap, once deployed remotely.

   Also, it would make sense to preserve the cycles, we need a way to serialize that, and restore the memory as-is on the remote minions.
 */

// TODO refactor : message and some other functions are duplicated between index.js and minion.js
function message(dest, body) {
  return {
    dest: dest,
    body: body
  };
}

function register(name, fn, scp, remote) {
  if (flxRepo[name] && !options.allowFlxOverwrite)
    return false;

  if (typeof fn === 'function') {
    scp = scp || {};
    scp.m = message;

    var flx = {run: fn, scp: scp, minion: remote};

    if(remote) {
      if (!minions[remote]) minions[remote] = {name: remote, flx:{}};
      minions[remote].flx[name] = flx;
    }
    
    flxRepo[name] = flx;

    return true;
  }

  return false;
}

function receive(req) {
  function _receiveOne(dest) {
    if (!flxRepo[dest]) {
      throw 'flx ' + dest + ' is not defined';
    }

    if (flxRepo[dest].minion && flxRepo[dest].minion.worker) { // flxRepo[dest].minion) { // should test on minion, but as deployement can be postponed, we actually test on the worker
      // TODO do serialization here

      // console.log('sending msg to ' + dest);

      // console.log('decy >>> ', req.body._sign.next);

      var msg_ = serializeObject(cycle.decycle(message(dest, req.body)));

      // console.log('send >>> ', msg_.body._sign.next);

      flxRepo[dest].minion.worker.send({reason: 'post', data: msg_});
    } else {
      process.nextTick(function(){
        var res = flxRepo[dest].run.call(flxRepo[dest].scp, req.body);
        if (res) receive(res);
      });
    }
  }

  if (Array.isArray(req.dest)) {
    req.dest.forEach(_receiveOne)
  } else {
    _receiveOne(req.dest);
  }
}

function rcvMsgFactory(name) {
  return function _receiveMessage(message) {
    if (message.reason === 'log')
      console.log(name + '>> ', message.data.join(' '));

    if (message.reason === 'post') {
      console.log('receiving message from ' + name);
      var data = cycle.retrocycle(desrializeObject(message.data));
      receive(data)
    }
  }
}

function bootstrapMinions() {

  /* Warning, there might be a race condition in this fonction.
     I don't now if fork is synchronous or not, and I can't find anythin on the web.
     If it is synchronous, there is no race condition, but poor performance are to be expected.
     If it is asynchronous, there is potentially a race condition, if messages are dropped during the fork.
     If the pipes are buffered, there should be no race condition, however.
   */

  for (var minionName in minions) { var minion = minions[minionName];

    if (!minion.worker) {

      // console.log('forking ' + minionName);

      minion.worker = fork(__dirname + '/minion.js');
      minion.worker.on('message', rcvMsgFactory(minionName));
    }

    for (var flxName in minion.flx) { var flx = minion.flx[flxName];
      if (!flx.deployed) {
        // TODO do serialization here
        flx.minion = minion;
        flx.deployed = true; // We are optimistic here. On the verge of ecstasy would be more a accurate definition, though.
        // In flx, there is minion, which contains an object of the registered fluxion including flx itslef : circular dependency.

        var remoteFlx = {
          name: flxName,
          run: serializeFn(flx.run),
          scp: serializeObject(flx.scp)
        }

        // console.log('registering ' + flxName);

        minion.worker.send({reason:'register', data: remoteFlx})
      }

    }
  }
}

// TODO put these two functions in a common lib for master and minion
function serializeFn(fn) {
  return fn.toString();
}

function deserializeFn(fnString) {
  // TODO improve function serialization
  return (Function('return ' + fnString))();
}

function isFunction(fn) {
  var getType = {};
  return fn && getType.toString.call(fn) === '[object Function]';
}

function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

function isArray(arr) {
  return arr && arr.constructor === Array;
}

function serializeObject(obj) {
  for (name in obj) { var value = obj[name];
    if (isFunction(value)) {
      obj[name] = {__dryfn: true, fn: serializeFn(value)};
    }

    if (isObject(value)) {
      obj[name] = serializeObject(value);
    }
  }

  return obj;
}

// Right after synchronously registering all the fluxions, we bootstrap the 
process.nextTick(function() {
  if (options.immediateDeploy) {
    bootstrapMinions()
  }
});

module.exports = {
  register: register,
  post: receive,
  start: receive,
  m: message,
  deploy: bootstrapMinions,
  options: options,
  serializeFn: serializeFn,
  deserializeFn: deserializeFn,
}