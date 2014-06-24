var flx = require('./flx')
  , express = require('express')
  , app = express();

var _cid = 0;

flx.register("output", function(msg){
  if (msg.res) {
    // console.log(">> REG " + msg.cid);
    this.cid[msg.cid] = msg.res;
  } else {
    // console.log(">> OUT " + msg.cid);
    this.cid[msg.cid].send(msg.view.toString());
    delete this.cid[msg.cid];
  }
  return undefined;
}, {
  cid: {}
})

app.get('/:id', function(req, res) {
  var uid = req.params.id;
  var cid = _cid++;

  // console.log(">> IN " + cid);
  flx.start(flx.m("output", {cid: cid, res: res}));
  flx.start(flx.m("input", {uid: uid, cid: cid}));
})

function listen() {
  app.listen(8080);
	console.log(">> listening 8080");
}

module.exports = {
	listen: listen
}