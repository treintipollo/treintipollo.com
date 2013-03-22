function BezierCurve(){}
 
BezierCurve.getPoint = function(t, points) {
	//clear totals
	var x = 0;
	var y = 0;
	//calculate n
	var n = points.length-1;
	//calculate n!
	var factn = BezierCurve.factoral(n);
	//loop thru points
	for (var i=0; i<=n; i++)
	{
		//calc binominal coefficent
		var b = factn/(BezierCurve.factoral(i)*BezierCurve.factoral(n-i));
		//calc powers
		var k = Math.pow(1-t, n-i)*Math.pow(t, i);
		//add weighted points to totals
		x += b*k*points[i].x;
		y += b*k*points[i].y;
	}
	//return result
	return {x:x, y:y};
}

BezierCurve.factoral = function (value) {
	//return special case
	if (value==0)
		return 1;
	//calc factoral of value
	var total = value;
	while (--value>1)
		total *= value;
	//return result
	return total;
}

BezierCurve.estimateLenght = function (precision, points) {
	var step = 1/precision;
	var results = [];
	var l = 0;

	for(var i=0; i<precision+1; i++){
		var t = step*i;

		if(t > 1.0){
			t = 1.0;
		}

		var p = BezierCurve.getPoint(t, points);

		if(i != 0){
			var dx = results[i-1].x - p.x;
			var dy = results[i-1].y - p.y;
			
			l += Math.sqrt(dx*dx + dy*dy);
		}

		results.push(p);
	}

	return l;
}

function DestroyUtils() {}

DestroyUtils.destroyAllProperties = function(obj) {
	for(var name in obj) {
		if(obj.hasOwnProperty(name)){
			delete obj[name];
		}
	}
}

Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
	if ( parentClassOrObject.constructor == Function ) 
	{ 
		//Normal Inheritance 
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;	
	} 
	else 
	{ 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
}

function Random()  {}

Random.getRandomArbitary = function (min, max) {
    return Math.random() * (max - min) + min;
}

Random.getRandomInt = function (min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

Random.getRandomBetweenToValues = function (value1, value2) {
	if(Math.random() >= 0.5){
		return value1;
	}

	return value2;
}

function NumberUtils() {}

NumberUtils.normalize = function(value, minimum, maximum) {
    return (value - minimum) / (maximum - minimum);
}

NumberUtils.interpolate = function(normValue, minimum, maximum) {
    return minimum + (maximum - minimum) * normValue;
}

NumberUtils.map = function(value, min1, max1, min2, max2) {
    return NumberUtils.interpolate( NumberUtils.normalize(value, min1, max1), min2, max2);
}

function VectorUtils(){}

VectorUtils.getFullVectorInfo = function(x1, y1, x2, y2) {
	var xd 		  	  = x2-x1;
	var yd 		  	  = y2-y1;
	var dist  	  	  = Math.sqrt(xd*xd + yd*yd);
	var direction 	  = {x:xd/dist, y:yd/dist};
	var perpendicular = {x:-direction.y, y:direction.x};
	var angle         = Math.atan2(y1 - y2, x1 - x2);

	return { distance:dist, dir:direction, perp:perpendicular, angle:angle };
}

function FuntionUtils(){}

FuntionUtils.bindScope = function(scope, f, args) {
	return function(){
		if(args){
			var a = [].splice.call(arguments,0);
			a = a.concat(args);
			return f.apply(scope, a);
		}
		
		return f.apply(scope, arguments);
	}
}

FuntionUtils.setProperties = function(obj, props) {
	for(var name in props) {
		if(obj.hasOwnProperty(name)){
			obj[name] = props[name];
		}
	}
}

function TweenUtils(){}

TweenUtils.startValueOscilation = function (valueName, time, minValue, maxValue, ease) {
	var firstArgs  = {};
	var secondArgs = {};
	
	firstArgs[valueName] 		 = "+=" + minValue;
	firstArgs["ease"] 			 = ease;
	firstArgs["yoyo"] 			 = true;
	firstArgs["repeat"] 		 = true;
	firstArgs["overwrite"] 		 = "none";
	firstArgs["onCompleteScope"] = this;
	firstArgs["onComplete"] 	 = function() { goLeft.call(this); };

	secondArgs[valueName] 		  = "+=" + maxValue;
	secondArgs["ease"] 			  = ease;
	secondArgs["yoyo"] 			  = true;
	secondArgs["repeat"] 		  = true;
	secondArgs["overwrite"] 	  = "none";
	secondArgs["onCompleteScope"] = this;
	secondArgs["onComplete"] 	  = function() { goRight.call(this); };

	var rightTween;
	var leftTween;

	var goRight = function(){ rightTween = TweenMax.to(this, time, firstArgs); }
	var goLeft  = function(){ leftTween = TweenMax.to(this, time, secondArgs); }

	goRight.call(this);

	return {
		kill:function() {
			rightTween.kill();
			leftTween.kill();
		}
	}
}

function ScreenUtils(){}

ScreenUtils.isInScreenBounds = function(pos){
	return (pos.x > 0 && pos.x < TopLevel.canvas.width) && (pos.y > 0 && pos.y < TopLevel.canvas.height);
}

ScreenUtils.isInScreenBoundsXY = function(x, y){
	return (x > 0 && x < TopLevel.canvas.width) && (y > 0 && y < TopLevel.canvas.height);
}