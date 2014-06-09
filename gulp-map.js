var Through = require('through2').obj;
var isPromise = require('is-promise');
var Q = require('kew');

module.exports = function(fn)
{
	if(!fn || 'function' !== typeof fn)
		throw new Error('Usage: map( function(x){return x} )');

	var promises = undefined;

	var handle_data = function(file, encoding, done)
	{
		// map the file
		var file_ = fn(file);

		// filter if nothing is returned
		if(!file_)
			return done();

		if(isPromise(file_))
		{
			promises = (promises || []);
			promises.push(
				// wait for completion and emit
				file_.then(function(f){
					this.push(f);
				}.bind(this))
			);
		}
		// it was a synchronous call
		else
			this.push(file_);

		done();
	};

	var handle_end = function(done)
	{
		if(promises)
			Q.all(promises).then(function(){
				done();
			});
		else
			done();
	};

	return Through(handle_data, handle_end);
};