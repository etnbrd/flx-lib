var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;

var childArgs = [
  path.join(__dirname, 'phantom-crowbar.js'),
  'file://' + __dirname + '/index.html',
  '.chart',
  ''
];

var child = childProcess.spawn(binPath, childArgs);

child.stdout.on('data', function(data) {
  eval('var files = ["' + data + '"]');
  console.log(files);
  convertToPdf(files);
});

child.on('close', function(code, signal) {
  // process exited and no more data available on `stdout`/`stderr`
});


function convertToPdf(files) {
  files.forEach(function(file) {
    if (file === '')
      return

    var destination = file.replace('.svg', '.pdf');
    var cmd = 'inkscape -D -z --file=' + file + ' --export-pdf=' + destination;

//     console.log(cmd);

    childProcess.exec(cmd, function(error, stdout, stderr) {
      // command output is in stdout
      console.log(file + ' ✓');
    });
  });
}

