var cycle = require('./cycle');

// TODO synchronize options between minion and master
var flxRepo = {},
    options = {
      allowFlxOverwrite: false
    };

function message(dest, body) {
  return {
    dest: dest,
    body: body
  };
}

function register(name, fn, scp) {
  if (flxRepo[name] && !options.allowFlxOverwrite)
    return false;

  if (typeof fn === 'function') {
    scp = scp && deserializeObject(scp) || {};
    scp.m = message;
    scp.register = register;
    scp.deserializeFn = deserializeFn;
    scp.serializeFn = serializeFn;
    scp.post = receive;

    flxRepo[name] = {run: fn, scp: scp};

    return true;
  }

  return false;
}

function post(msg) {

  // TODO do the serialization here.
  // walk through the object, and verifiy everything resolves to a literal (no native fn for example), and there is no cycles.

  var msg_ = cycle.decycle(msg);

  process.send({reason: 'post', data: msg_});
}

function receive(req) {

  function _receiveOne(dest) {
    if (flxRepo[dest]) {
      process.nextTick(function(){
        var res = flxRepo[req.dest].fn.call(flxRepo[req.dest].scp, req.body);
        receive(res)
      });
    } else { // the fluxions is not hosted on this minion, send back to the master
      post(message(dest, req.body));
    }
  }

  if (Array.isArray(req.dest)) {
    req.dest.forEach(_receiveOne);
  } else {
    _receiveOne(req.dest);
  }
}


function receive(req) {

  if (!flxRepo[req.dest]) {
    console.log(req);
    console.log('flx ' + req.dest + ' not defined');
    return;
  }

  // TODO calling a fluxion is done on the minion and the master -> do a fluxion abstraction.
  var res = flxRepo[req.dest].run.call(flxRepo[req.dest].scp, req.body);

  if (res)
    post(res);
}

process.on('message', function (message) {
  if (message.reason === 'register') {
    var fn = deserializeFn(message.data.run);
    register(message.data.name, fn, message.data.scp)
  }
  if (message.reason === 'post')  {
    var data = deserializeObject(cycle.retrocycle(message.data));
    receive(data);
  }
})


// TODO put these functions in a common lib for master and minion


function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

function isArray(arr) {
  return arr && arr.constructor === Array;
}

function serializeFn(fn) {
  return fn.toString();
}

function deserializeFn(fnString) {
  // TODO improve function serialization
  return (Function('return ' + fnString))();
}

function deserializeObject(obj) {
  for (name in obj) { var value = obj[name];

    if (value.__dryfn) {
      obj[name] = deserializeFn(value.fn);
    } else if (isObject(value)) {
      obj[name] = deserializeObject(value);
    }
  }

  return obj;
}