var flx = require('..');
flx.options.allowFlxOverwrite = true;
flx.options.immediateDeploy = false;

var fn = function(msg) {
  return this.m('end', {ok: true});
}

var fn2 = function(msg) {
  this.test[0]++;
  return this.m('end', {ok: true}); 
}

var end = function(msg) {
  if (msg.done) this.done = msg.done;
  if (msg.max) this.max = msg.max;
  if (msg.ok) this.count++;
  if (this.count === this.max) this.done();
}

describe('Fluxion library :', function(){
  describe('registering a fluxion', function(){
    it('without a function should return false as an error', function(done){
      if(false === flx.register("test", "not a function")) {
        done();
      }
    });

    it('with a function should return true', function(done){
      if(true === flx.register("test", fn, {}, 'minion')) {
        done();
      }
    });
  });

  describe('starting a chain', function(){
    it('with the correct name of a fluxion should make this fluxion react', function(done){
      flx.register('end', end, {count: 0, max: 1});
      flx.post(flx.m('end', {done: done}));
      flx.start(flx.m("test", {}));
    });

    it('with the name of an undefined fluxion should result in an error', function(done){
      try {
        flx.start("undefined", {});
      } catch (e) {
        if (e === "flx undefined is not defined") {
          done();
        }
      }
    });

    it('an undeployed fluxion should allow side-effects', function(done) {

      var A = [0];

      flx.register('test-se', fn2, {test: A}, 'minion');
      flx.register('end', end, {count: 0, max: 1, done: function() {
        if (A[0] === 1) done();
      }});
      flx.start(flx.m("test-se", {}));
    });

    it('with multiple recipients should receive all messages', function(done){
      var n = 3;
      var dest = Array.apply(null, {length: n}).map(function() {return 'test'});
      flx.post(flx.m('end', {done: done, count: 0, max: 3}));
      flx.start(flx.m(dest, {done: done}));
    });
  });

  describe('Fluxion deployment', function() {
    it('should still allow to react', function(done){
      flx.register("test", fn, {}, 'minion')
      flx.register('end', end, {count: 0, max: 1, done: done});
      flx.deploy();
      //flx.post(flx.m('end', {count: 0, max: 1, done: done}));
      flx.start(flx.m("test", {done: done}));
    });

    it('disallow side-effects', function(done) {
      
      var A = [0];

      flx.register('test-se', fn2, {test: A}, 'minion');
      //flx.register('end', end, {count: 0, max: 1, done: done});
      flx.deploy();

      flx.post(flx.m('end', {count: 0, max: 1, done: function() {
        if (A[0] === 0) done();
      }}));
      flx.start(flx.m("test-se", {done: done}));
    })

  })

  // describe('encapsulation', function() {
  //   it('should disallow side effects', function(done) {

  //     var test = ['not leaked'];

  //     var fn = function(msg) {
  //       if (this.test[0] === 'not leaked') {
  //         msg.done();
  //       }
  //       msg.done(false);
  //     }

  //     flx.register("test", fn, {test: test});

  //     // test[0] = 'leaked';

  //     flx.start("test", {
  //       done: done
  //     });
  //   })
  // })
});

describe('Web Fluxion library :', function(){
  // describe('register a fluxion', function(){
  //     it('if-then no else should compile', function(done){
  //         var srv = compileAndMock('ifthenout.js')
  //         srv.get('/')
  //             .expect('B')
  //             .end(done)
  //             ;
  //     });

  //     it('if-then-else should compile', function(done){
  //         var srv = compileAndMock('ifthenelseout.js')
  //         srv.get('/')
  //             .expect('D')
  //             .end(done)
  //             ;
  //     });
  // });
  // describe('inside of app.get :', function(){
  //     it('if-then no else should compile', function(done){
  //         var srv = compileAndMock('ifthenin.js')
  //         srv.get('/')
  //             .expect('E')
  //             .end(done)
  //             ;
  //     });

  //     it('if-then-else should compile', function(done){
  //         var srv = compileAndMock('ifthenelsein.js')
  //         srv.get('/')
  //             .expect('G')
  //             .end(done)
  //             ;
  //     });
  // });
});