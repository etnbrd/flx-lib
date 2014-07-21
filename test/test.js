var flx = require('..');

var fn = function(msg) {
    msg.done();
}

describe('Fluxion library :', function(){
    describe('registering a fluxion', function(){
        it('without a function should return false as an error', function(done){
            if (false === flx.register("test", "not a function")) {
                done();
            }
        });

        it('with a function should return true', function(done){
            if(true === flx.register("test", fn)) {
                done();
            }
        });
    });
    describe('starting a chain', function(){
        it('with the correct name of a fluxion should make this fluxion react', function(done){
            flx.start(flx.m("test", {done: done}));
        });

        it('with the name of an undefined fluxion should result in an error', function(done){
            try {
                flx.start("undefined", {});
            } catch (e) {
                if (e = "flx undefined is not defined") {
                    done();
                }
            }
        });
    });
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