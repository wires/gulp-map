
# Better mapping.

Works with 

```js
$ = require('gulp-load-plugins');
// $.map(fn)
```

When returning a promise, it is mapped asynchronously (in parallel):

```js
var Q = require('kew');
// ...
.pipe($.map(function(file){
	return Q.delay(500).then(function(){
		file.tags = (file.tags || []).push('slow');
		return file;
	});
}))
```

The stream 'end' event delayed until all promisses are finished.

When you return `undefined` from your promise or regular function, the file is
filtered from the stream.

```js
.pipe($.map(function(file){
	if(file.path.match(/gulpfile\.js/))
		return file;
	// other files not emitted
}))
```

That's it.

## Alternatives

For regular callback style mapping, just use `map-stream`.

```js
var map = require('map-stream');
// ...
.pipe(map(function(file, done){
	done(null, file);
}))
```

For both `data` and `end` events, `through2` works well:

```js
var Through = require('through2').obj;
// ...
.pipe(Through(
	function handle_data(file, encoding, done) {
		this.push(file);
		done();
	}
	function handle_end(done) {
		done();
	}
))
```
