/**
 * VERSION: beta 0.1.0
 * DATE: 2013-02-20
 * JavaScript
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue || (window._gsQueue = [])).push( function() {

	window._gsDefine("plugins.ShortRotationPlugin", ["plugins.TweenPlugin"], function(TweenPlugin) {
		
		var ShortRotationPlugin = function(props, priority) {
				TweenPlugin.call(this, "shortRotation");
				this._overwriteProps.pop();
			},
			p = ShortRotationPlugin.prototype = new TweenPlugin("shortRotation");
		
		p.constructor = ShortRotationPlugin;
		ShortRotationPlugin._autoCSS = true;
		ShortRotationPlugin.API = 2;

		p._onInitTween = function(target, value, tween) {
			if (typeof(value) !== "object") {
				value = {rotation:value};
			}
			var cap = (value.useRadians === true) ? Math.PI * 2 : 360,
				p, v, start, end, dif;
			for (p in value) {
				if (p !== "useRadians") {
					v = value[p];
					start = (typeof(target[p]) !== "function") ? parseFloat(target[p]) : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]();
					end = (typeof(v) === "string" && v.charAt(1) === "=") ? start + parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : Number(v) || 0;
					dif = (end - start) % cap;
					if (dif !== dif % (cap / 2)) {
						dif = (dif < 0) ? dif + cap : dif - cap;
					}
					this._addTween(target, p, start, start + dif, p);
					this._overwriteProps.push(p);
				}
			}
			return true;
		};
		
		TweenPlugin.activate([ShortRotationPlugin]);
		
		return ShortRotationPlugin;
		
	}, true);

}); if (window._gsDefine) { window._gsQueue.pop()(); }