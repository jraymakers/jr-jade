var async = require('async');
var fs = require('fs');
var fse = require('fs-extra');
var jade = require('jade');
var path = require('path');

function compileJadeStr(jadeStr, locals) {
  var jadeFn = jade.compile(jadeStr);
  return jadeFn(locals);
}

function compileJadeFile(jadeFilePath, outDir, locals, cb) {
  fs.readFile(jadeFilePath, 'utf-8', function (err, data) {
    if (err) {
      cb(err);
    } else {
      var outStr = compileJadeStr(data, locals);
      var outFileName = path.basename(jadeFilePath, '.jade') + '.html';
      var outFilePath = path.join(outDir, outFileName);
      fse.outputFile(outFilePath, outStr, cb);
    }
  });
}

function compileJadeDir(inDir, outDir, locals, cb) {
  fs.readdir(inDir, function (err, fileNames) {
    if (err) {
      cb(err);
    } else {
      async.each(fileNames, function (fileName, fileCb) {
        if (path.extname(fileName) === '.jade') {
          compileJadeFile(path.join(inDir, fileName), outDir, locals, fileCb);
        } else {
          fileCb();
        }
      }, cb);
    }
  });
}

module.exports = function (opts, cb) {
  var inDir = opts.inDir;
  var outDir = opts.outDir;
  var locals = opts.locals;
  compileJadeDir(inDir, outDir, locals, cb);
};