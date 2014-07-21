var util = require('util');


try {
  var hooks = require('./hooks')
} catch(err) {
  // For debug purpose
  // console.log("No hooks module found, fallback to debug");
  var hooks = {
    register: function(name, fn, scps) {
      // console.log("+ register " + name);
    },
    post: function(msg, dest) {
      // console.log(">> post to " + dest + " | " + msg);
    }
  };
}

var flx_repo = {};


/**
 * Post a message.
 * A message being an object containing the name of the destination fluxion, and the body of the message.
 * @param      {Object}   source path
 * @jsFiddle   A jsFiddle embed URL
 * @return     {undefined} nothing
 */
function post(msg) {

  function postMsg(msg) {
    if (!msg)
      return false;

    setImmediate(post, msg);
  }

  function recvMsg(msg) {
    if (!flx_repo[msg.dest]) {
      throw "flx " + msg.dest + " not defined";
    }

    hooks.post(msg, msg.dest);
    postMsg(flx_repo[msg.dest].run.call(flx_repo[msg.dest].scp, msg.body));
  }

  if (msg)
    if (Array.isArray(msg.dest)) for (var i = 0; i < msg.dest.length; i++) {
      recvMsg(message(msg.dest[i], msg.body));
    } else {
      recvMsg(msg);
    }
};


/**
 * Register a fluxion
 * @param      {String}   Name
 * @param      {Function} Function
 * @param      {Object}   Scope
 * @jsFiddle   A jsFiddle embed URL
 * @return     {undefined} true if successuflly registered, false else.
 */
function register(name, fn, scp) {
  // if (flx_repo[name])
  //   return false;

  scp = scp || {};
  scp.m = message;
  scp.register = register;

  if (typeof fn === "function") {
    hooks.register(name, fn, scp);
    flx_repo[name] = {run: fn, scp: scp}; 

    return true;
  }

  return false;
};


/**
 * Build a message
 * @param      {String}   destination name
 * @param      {Object}   body of the message
 * @jsFiddle   A jsFiddle embed URL
 * @return     {undefined} nothing
 */
function message(dest, body) {
  return {
    dest: dest,
    body: body
  };
};

module.exports = {
  register : register,
  start : post,
  m : message,
};