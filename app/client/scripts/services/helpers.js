
(function() {
    'use strict';

    var app = angular.module('reanaApp');

    app.service('helpers', function($http, $q, $timeout){
    	var helpers = this;

        this.typeOf = function(data){
            if(data === null) return 'null';
			var out = typeof data;
			if(out == 'object'){
				if(data instanceof Array) return 'array';
				if(data.then instanceof Function) return 'promise';
			}
			return out;
		}

		this.overload = function(variations){

			return function(){
				var that = this;
				var args = arguments;
				var argTypeOfs = _.map(args,  function(arg){ return helpers.typeOf(arg); });
				var found = false;
				var out;
				if(!variations.default){
					variations.default = function(){
						throw "Could not satisfy overloaded function '" + argTypeOfs.join(', ') + "'.";
					};
				}

				_.each(variations, function(fn, pattern){
					if(pattern == 'default') return false;
					pattern = pattern.trim().split(/\s*,\s*/);
					found = _.isEqual(argTypeOfs, pattern);
					if(found){
						out = fn.apply(that, args);
						return false;
					}
				});

				if(argTypeOfs.length == 0 && variations['']){
					out = variations[''].apply(that, args);
				} else if(!found){
					out = variations.default.apply(that, args);
				}

				return out;
			};
		}


		this.buildQuery = function(query){
			while(true){
	        	query = _.map(query, function(i){
	        		if(helpers.typeOf(i) == 'function') i = i.call(this);
	        		return i;
	        	});
	        	query = _.flatten(query);
	        	var isFunction = _.select(query, function(i){ return helpers.typeOf(i) == 'function'; }).length > 0;
	        	var isArray = _.select(query, function(i){ return helpers.typeOf(i) == 'array'; }).length > 0;
	        	if(!isFunction && !isArray) break;
	        }

	        query = _.select(query, function(i){ return i !== undefined; });

	        try {
	        	var _query = [];
	        	for(var i = 0; i < query.length; i++){
	        		var expression = [];
	        		var fragments = query[i].split(/\?/);
	        		for(var j in fragments){
	        			expression.push(fragments[j]);
	        			if(j < fragments.length - 1){
	        				i++;
	        				expression.push(helpers.jpqlSanitize(query[i]));
	        			}
	        		}
	        		_query.push(expression.join(''));
	        	}
	        } catch(e) {
	        	console.error("can't build query", query, e)
	        }
	        return _query.join(' ');
		};

		this.urlEncode = function(o){
			var out = [];
			_.each(o, function(value, key){
				out.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
			});
			return out.join('&');
		};

		this.generateRestMethods = function(that, prefix){
			
			defineMethod.call(that, 'get');
			defineMethod.call(that, 'delete');
			defineMethod.call(that, 'post');
			defineMethod.call(that, 'put');

			function defineMethod(methodName){
				this[methodName] = helpers.overload({
					'string, string, object': function(offset, params, options){
						options = _.clone(options);
						if(methodName.match(/post|put/)){
							if(!options.headers) options.headers = {};
							if(!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
						}
						if(_.isUndefined(options.byPassIntercepter)) options.byPassIntercepter = true;
						var url = prefix + offset;
						if(methodName.match(/get|delete/) && params !== '') url += '?' + params;
						var out = $q.defer();
						var args = [url];
						if(methodName.match(/post|put/)) args.push(params);
						args.push(options);
						$http[methodName].apply($http, args).then(function(response){
							out.resolve(response.data);
						}, function(response){
							out.reject(response.data);
						});
						return out.promise;
		    		},
					'string, object, object': function(offset, params, options){
						return this[methodName].call(this, offset, helpers.urlEncode(params), options)
		    		},
		    		'string, promise, object': function(offset, timeout, params){
		    			return this[methodName].call(this, offset, params, {timeout: timeout});
		    		},
		    		'string, object': function(offset, params){
		    			return this[methodName].call(this, offset, params, {});
		    		},
		    		'string, promise': function(offset, timeout){
		    			return this[methodName].call(this, offset, {}, {timeout: timeout});
		    		},
		    		'string': function(offset){
		    			return this[methodName].call(this, offset, {}, {});
		    		}
				});
			}

		};

		this.resolvedPromise = function(value){
			var defered = $q.defer();
			defered.resolve(value);
			return defered.promise;
		};

		(function(){
			var methods = {
	            get: $http.get,
	            delete: $http.delete,
	            post: $http.post,
	            put: $http.put
	        };

	        _.each(methods, function(method, name){
	            $http[name] = function(){
	                return extendPromise(method.apply(this, arguments));
	            };
	        });

	        var deferMethod = $q.defer;
	        $q.defer = function(){
	        	var out = deferMethod.apply(this, arguments);
	        	extendPromise(out.promise);
	        	return out;
	        };

	        function extendPromise(promise){
				promise.log = function(){
		            return this.then(function(data){
		                console.log('(success)', data); 
		            }, function(data){
		                console.log('(error)', data);   
		            }, function(data){
		                console.log('(notify)', data);  
		            });
		        };

		        var then = promise.then;
		        promise.then = function(){
		        	return extendPromise(then.apply(this, arguments));
		        };

		        return promise;
			}

	    })();

    });


})();