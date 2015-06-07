// console.log = function log() {
//   process.send({reason: 'log', data:arguments});
// }

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
    scp = scp || {};
    scp.m = message;
    scp.register = register;

    flxRepo[name] = {run: fn, scp: scp};

    return true;
  }

  return false;
}

function post(msg) {

  // TODO do the serialization here.
  // walk through the object, and verifiy everything resolves to a literal (no native fn for example), and there is no cycles.

  process.send({reason: 'post', data: msg});
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
    console.log('flx ' + req.dest + ' not defined');
    return;
  }

  // TODO calling a fluxion is done on the minion and the master -> do a fluxion abstraction.
  var res = flxRepo[req.dest].run.call(flxRepo[req.dest].scp, req.body);

  if (res)
    post(res);
}

process.on('message', function (event) {
  if (event.reason === 'register') {
    // TODO improve function serialization
    var fn = (Function('return ' + event.data.run))();
    register(event.data.name, fn, event.data.scp)
  }
  if (event.reason === 'post') 
    receive(event.data);
})