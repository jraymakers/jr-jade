var async = require('async');
var fs = require('fs');
var fse = require('fs-extra');
var jade = require('jade');
var path = require('path');
var xtend = require('xtend');

function compileJadeStr(jadeStr, options, locals) {
  var jadeFn = jade.compile(jadeStr, options);
  return jadeFn(locals);
}

function compileJadeFile(jadeFilePath, outDir, jadeOptions, jadeLocals, cb) {
  fs.readFile(jadeFilePath, 'utf-8', function (err, data) {
    if (err) {
      cb(err);
    } else {
      var options = xtend(jadeOptions, {
        filename: jadeFilePath
      });
      var outStr = compileJadeStr(data, options, jadeLocals);
      var outFileName = path.basename(jadeFilePath, '.jade') + '.html';
      var outFilePath = path.join(outDir, outFileName);
      fse.outputFile(outFilePath, outStr, cb);
    }
  });
}

function compileJadeDir(inDir, outDir, jadeOptions, jadeLocals, cb) {
  fs.readdir(inDir, function (err, fileNames) {
    if (err) {
      cb(err);
    } else {
      async.each(fileNames, function (fileName, fileCb) {
        if (path.extname(fileName) === '.jade') {
          compileJadeFile(path.join(inDir, fileName), outDir, jadeOptions, jadeLocals, fileCb);
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
  var jadeOptions = opts.options;
  var jadeLocals = opts.locals;
  compileJadeDir(inDir, outDir, jadeOptions, jadeLocals, cb);
};