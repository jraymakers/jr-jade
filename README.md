# JR-JADE

A [jr](https://npmjs.org/package/jr) job for [jade](https://npmjs.org/package/jade).

### Example

```javascript
var jrJade = require('jr-jade');

jrJade({
  inDir: 'src',
  outDir: 'out',
  options: {
    pretty: true
  }, 
  locals: {
    name: 'Jade'
  }
}, function (err) {
  if (err) {
    console.log(err);
  }
});
```

Given src/hello.jade:
```
doctype
html
  body
    p Hello, #{name}!
```

this writes out/hello.html:
```
<!DOCTYPE html>
<html>
  <body>
    <p>Hello, Jade!</p>
  </body>
</html>
```

### Details

Jr-jade is a function that compiles [jade](https://npmjs.org/package/jade) files into html files.  Although designed to be used with [jr](https://npmjs.org/package/jr), it does not depend on jr and can be used by itself.

All \*.jade files in 'inDir' (non-recursive) will be compiled to \*.html files in 'outDir' with the same basename.  Because 'inDir' is not traversed recursively, jade partials can be stored in subdirectories without generating their own html files.

See the [jade public API](https://github.com/visionmedia/jade#a5) for details on 'options' and 'locals'.

Jr-jade is a thin wrapper around the jade public API.  Jade provides an API to compile jade strings, and a command-line tool to compile jade files, but no API to compile files.  Jr-jade fills this gap.