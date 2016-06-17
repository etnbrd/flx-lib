var flx = require('..');
// var fibonacci = require ('fibonacci');
require('colors');


var times = [];

function display(times) {
  console.log('start,tick,endTick');
  times.forEach(display_);
}

function display_(time) {
  console.log('%d,%d,%d', time.start[1]/1000000, time.tick[1]/1000000, time.endTick[1]/1000000);
}

function nop(iteration, n, time) {
  times.push(time);
  if (n <= 0) return display(times);
  iteration(nextTick, n)();
}

function nextTick(iteration, n, time) {
  times.push(time);
  if (n <= 0) return display(times);
  process.nextTick(iteration(nextTick, n));
}

function nextMessage(iteration, n, time) {
  times.push(time);
  if (n <= 0) return display(times);
  flx.post(flx.m('test', {nextTick: nextMessage, n: n}));
}

function nextMessageDep(iteration, n, time) {
  this.display(time);
  if (n <= 0) return;
  this.post(this.m('test', {nextTick: nextMessageDep, n: n})); 
}

function nextMessagePar(iteration, n, time, dest) {
  this.display(time);
  if (n <= 0) return;
  this.post(this.m(dest, {nextTick: nextMessagePar, n: n, dest: dest}));
}

function iteration(nextTick, n, dest) {
  var it = iteration;
  var st = start;
  return function(msg) {
    var tick = process.hrtime();

    function fibonacci(max){
      for(var fibArray = [0,1], i = 0, j = 1, k = 0; k < max; i = j, j = x, k++ ){
        x = i + j;
        fibArray.push(x);
      }
    }

    if (this.serializeFn) { // deported fluxion
      var start = this.start;
      var iteration = iteration || undefined;
      var dest = msg.dest;
      nextTick = msg.nextTick.bind(this)
      n = msg.n;
    } else { // Else, it is in the global scope
      if (this.m) // same scope fluxion
        n = msg.n;
      var start = st;
      var iteration = it;
    }

    fibonacci(300000);

    var endTick = process.hrtime();
    nextTick(iteration, n-1, {
      start: start,
      tick: tick,
      endTick: endTick
    }, dest);
  }
}

var start = process.hrtime();

var count = 50

// LOOP
iteration(nop, count)();

// NEXT TICK
// process.nextTick(iteration(nextTick, count))

// FLUXION - SEQUENTIAL
// flx.register('test', iteration(nextMessage, count), {});
// flx.start(flx.m('test', {nextTick: nextMessage, n: count}));

// FLUXION - DEPORTED
// flx.register('test', iteration(nextMessageDep, count), {display: display_, start: start}, 'minion');
// setTimeout(function() {
//   flx.start(flx.m('test', {nextTick: nextMessageDep, n: count}));
// }, 1000);

// FLUXION - PARALLEL
// var minions = 50;
// 
// var nperm = count / minions;
// 
// for (var i = minions; i > 0; i--) {
//   flx.register('test-' + i, iteration(nextMessagePar, nperm, 'test-' + i), {display: display_, start: start}, 'minion-' + i);
// }
// 
// 
// setTimeout(function() {
//   for (var i = minions; i > 0; i--) {
//     flx.start(flx.m('test-' + i, {nextTick: nextMessagePar, n: nperm, dest: 'test-' + i}));
//   }
// }, 1000);