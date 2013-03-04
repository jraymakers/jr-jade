var async = require('async');
var fs = require('fs');
var fse = require('fs-extra');
var jrJade = require('../');
var path = require('path');

describe('jr-jade', function () {

  var inDir = path.join('test', 'in');
  var outDir = path.join('test', 'out');

  afterEach(function (done) {
    async.parallel([
      async.apply(fse.remove, inDir),
      async.apply(fse.remove, outDir)
    ], done);
  });

  it('should produce no output files for no input files', function (done) {
    async.waterfall([
      async.apply(fse.mkdir, inDir),
      async.apply(jrJade, { inDir: inDir, outDir: outDir }),
      function (cb) {
        fs.exists(outDir, function (exists) {
          if (exists) {
            cb(new Error('Output directory exists, but it should not.'));
          } else {
            cb();
          }
        });
      }
    ], done);
  });

  it('should produce the correct output file for a single input file', function (done) {
    async.waterfall([
      async.apply(fse.outputFile, path.join(inDir, 'basic.jade'), 'p basic jade file'),
      async.apply(jrJade, { inDir: inDir, outDir: outDir }),
      async.apply(fs.readFile, path.join(outDir, 'basic.html'), 'utf-8'),
      function (data, cb) {
        if (data === '<p>basic jade file</p>') {
          cb();
        } else {
          cb(new Error('Unexpected output files contents: ' + data));
        }
      }
    ], done);
  });

  it('should produce the correct output files for multiple input files', function (done) {
    async.waterfall([
      async.apply(fse.outputFile, path.join(inDir, 'basic1.jade'), 'p basic jade file 1'),
      async.apply(fse.outputFile, path.join(inDir, 'basic2.jade'), 'p basic jade file 2'),
      async.apply(jrJade, { inDir: inDir, outDir: outDir }),
      async.apply(fs.readFile, path.join(outDir, 'basic1.html'), 'utf-8'),
      function (data, cb) {
        if (data === '<p>basic jade file 1</p>') {
          cb();
        } else {
          cb(new Error('Unexpected output files contents: ' + data));
        }
      },
      async.apply(fs.readFile, path.join(outDir, 'basic2.html'), 'utf-8'),
      function (data, cb) {
        if (data === '<p>basic jade file 2</p>') {
          cb();
        } else {
          cb(new Error('Unexpected output files contents: ' + data));
        }
      }
    ], done);
  });

  it('should handle include correctly', function (done) {
    async.waterfall([
      async.apply(fse.outputFile, path.join(inDir, 'parent.jade'), 'div\n  include child'),
      async.apply(fse.outputFile, path.join(inDir, 'child.jade'), 'p child'),
      async.apply(jrJade, { inDir: inDir, outDir: outDir }),
      async.apply(fs.readFile, path.join(outDir, 'parent.html'), 'utf-8'),
      function (data, cb) {
        if (data === '<div><p>child</p></div>') {
          cb();
        } else {
          cb(new Error('Unexpected output files contents: ' + data));
        }
      },
      async.apply(fs.readFile, path.join(outDir, 'child.html'), 'utf-8'),
      function (data, cb) {
        if (data === '<p>child</p>') {
          cb();
        } else {
          cb(new Error('Unexpected output files contents: ' + data));
        }
      }
    ], done);
  });

});