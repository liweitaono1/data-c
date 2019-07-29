(function($) {
 
    $.fn.countup = function(params) {
        var method = typeof arguments[0] == "string" && arguments[0];
		var args = method && Array.prototype.slice.call(arguments, 1) || arguments;
		// get a reference to the first marquee found
		var self = (this.length == 0) ? null : $.data(this[0], "countUp");


		// if a method is supplied, execute it for non-empty results
		if( self && method && this.length ){

			// if request a copy of the object, return it
			if( method.toLowerCase() == "object" ) return self;
			// if method is defined, run it and return either it's results or the chain
			else if( self[method] ){
				// define a result variable to return to the jQuery chain
				var result;
				this.each(function (i){
					// apply the method to the current element
					var r = $.data(this, "countUp")[method].apply(self, args);
					// if first iteration we need to check if we're done processing or need to add it to the jquery chain
					if( i == 0 && r ){
						// if this is a jQuery item, we need to store them in a collection
						if( !!r.jquery ){
							result = $([]).add(r);
						// otherwise, just store the result and stop executing
						} else {
							result = r;
							// since we're a non-jQuery item, just cancel processing further items
							return false;
						}
					// keep adding jQuery objects to the results
					} else if( !!r && !!r.jquery ){
						result = result.add(r);
					}
				});

				// return either the results (which could be a jQuery object) or the original chain
				return result || this;
			// everything else, return the chain
			} else return this;
		// initializing request
		} else {
            // make sure dependency is present
            if (typeof CountUp !== 'function') {
                console.error('countUp.js is a required dependency of countUp-jquery.js.');
                return;
            }

            var defaults = {
                startVal: 0,
                decimals: 0,
                duration: 2,
            };

            if (typeof params === 'number') {
                defaults.endVal = params;
            }
            else if (typeof params === 'object') {
                $.extend(defaults, params);
            }
            else {
                console.error('countUp-jquery requires its argument to be either an object or number');
                return;
            }

            this.each(function (i, elem) {
                var countUp = new CountUp(elem, defaults.startVal, defaults.endVal, defaults.decimals, defaults.duration, defaults.options);
                $.data(elem, 'countUp', countUp);
                countUp.start();
            });


            return this;
        }
 
    };
 
}(jQuery));