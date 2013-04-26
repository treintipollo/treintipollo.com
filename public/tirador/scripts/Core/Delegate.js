function Delegate() {}

Delegate.prototype.add = function(name, scope, callback) {
	if (!this[name]) {
		this[name] = [];
	}
	this[name].push({
		scope: scope,
		callback: callback
	});
}

Delegate.prototype.remove = function(name, scope, callback) {
	if (!this[name]) {
		return;
	}

	for (var i = this[name].length - 1; i >= 0; i--) {
		var callbackObject = this[name][i];

		if (scope === callbackObject.scope && callback === callbackObject.callback) {
			this[name].splice(i, 1);
		}
	}
}

Delegate.prototype.removeAll = function(name) {
	if (this[name]) {
		this[name].lenght = 0;
		this[name] = null;
	}
}

Delegate.prototype.execute = function(name, args) {
	if (!this[name]) {
		return;
	}

	for (var i = 0; i < this[name].length; i++) {
		var callbackObject = this[name][i];
		callbackObject.callback.call(callbackObject.scope, args);
	}
}