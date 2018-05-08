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

VectorUtils.inRange = function(p1x, p1y, p2x, p2y, radius) {
	var deltaX = p1x-p2x;
	var deltaY = p1y-p2y;
	
	p1 = null;
	p2 = null;
	
	if((deltaX*deltaX) + (deltaY*deltaY) <= radius*radius){
	 	return true;
	}
	
	return false;
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
			if(rightTween)
				rightTween.kill();
			if(leftTween)
				leftTween.kill();
		}
	}
}

function ScreenUtils(){}

ScreenUtils.isInScreenBounds = function(pos, offsetX, offsetY){
	offsetX = offsetX ? offsetX : 0;
	offsetY = offsetY ? offsetY : 0;

	return (pos.x > -offsetX && pos.x < TopLevel.canvas.width+offsetX) && (pos.y > -offsetY && pos.y < TopLevel.canvas.height+offsetY);
}

ScreenUtils.isInScreenBoundsXY = function(x, y, offsetX, offsetY){
	offsetX = offsetX ? offsetX : 0;
	offsetY = offsetY ? offsetY : 0;

	return (x > -offsetX && x < TopLevel.canvas.width+offsetX) && (y > -offsetY && y < TopLevel.canvas.height+offsetY);
}

ScreenUtils.isPastBottom = function(y, offset){
	offset = offset ? offset : 0;
	return (y > TopLevel.canvas.height + offset);
}

ScreenUtils.isPastTop = function(y, offset){
	offset = offset ? offset : 0;
	return (y < -offset);
}

ScreenUtils.isPastRight = function(x, offset){
	offset = offset ? offset : 0;
	return (x > TopLevel.canvas.width + offset);
}

ScreenUtils.isPastLeft = function(x, offset){
	offset = offset ? offset : 0;
	return (x < -offset);
}

function DrawUtils(){}

DrawUtils.circle = function(context, x, y, radius, fillColor, strokeColor, lineWidth){
	if(fillColor) context.fillStyle = fillColor;
	if(strokeColor)	context.strokeStyle = strokeColor;
	if(lineWidth) context.lineWidth = lineWidth;

	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI*2, false);
	context.closePath();

	if(fillColor) context.fill();
	if(strokeColor) context.stroke();
}

DrawUtils.rectangle = function(context, x, y, width, height, fillColor, strokeColor, lineWidth){
	if(strokeColor)	context.strokeStyle = strokeColor;	
	if(lineWidth) context.lineWidth = lineWidth;
	if(fillColor) context.fillStyle = fillColor;	
	
	context.beginPath();
	context.rect(x, y, width, height);
	context.closePath();

	if(fillColor) context.fill();
	if(strokeColor) context.stroke();
}

DrawUtils.triangle = function(context, centerX, centerY, x1, y1, x2, y2, x3, y3, fillColor, strokeColor, lineWidth, scale){
	if(strokeColor)	context.strokeStyle = strokeColor;	
	if(lineWidth) context.lineWidth = lineWidth;
	if(fillColor) context.fillStyle = fillColor;	
	
	if(!scale) scale = 1;

	x1 *= scale; x2 *= scale; x3 *= scale;
	y1 *= scale; y2 *= scale; y3 *= scale;

	x1 += centerX; x2 += centerX; x3 += centerX;
	y1 += centerY; y2 += centerY; y3 += centerY;

	context.beginPath();

	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineTo(x3, y3);

	context.closePath();

	if(fillColor) context.fill();
	if(strokeColor) context.stroke();
}

DrawUtils.quadraticTriangle = function(context, centerX, centerY, x1, y1, ax1, ay1, x2, y2, ax2, ay2, x3, y3, ax3, ay3, fillColor, strokeColor, lineWidth, scale){
	if(strokeColor)	context.strokeStyle = strokeColor;	
	if(lineWidth)   context.lineWidth   = lineWidth;
	if(fillColor)   context.fillStyle   = fillColor;	
	
	if(!scale) scale = 1;

	x1  *= scale; x2  *= scale; x3  *= scale;
	y1  *= scale; y2  *= scale; y3  *= scale;
	ax1 *= scale; ax2 *= scale; ax3 *= scale;
	ay1 *= scale; ay2 *= scale; ay3 *= scale;

	x1  += centerX; x2  += centerX; x3  += centerX;
	y1  += centerY; y2  += centerY; y3  += centerY;
	ax1 += centerX; ax2 += centerX; ax3 += centerX;
	ay1 += centerY; ay2 += centerY; ay3 += centerY;

	context.beginPath();

	context.moveTo(x1, y1);
	context.quadraticCurveTo(ax1, ay1, x2, y2);
	context.quadraticCurveTo(ax2, ay2, x3, y3);
	context.quadraticCurveTo(ax3, ay3, x1, y1);

	context.closePath();

	if(fillColor) context.fill();
	if(strokeColor) context.stroke();
}

DrawUtils.polygon = function(context, x, y, points, fillColor, strokeColor, lineWidth, scale){
	if(strokeColor)	context.strokeStyle = strokeColor;	
	if(lineWidth) context.lineWidth = lineWidth;
	if(fillColor) context.fillStyle = fillColor;	
	
	if(!scale) scale = 1;

	context.beginPath();

	context.moveTo((points[0].x*scale)+x, (points[0].y*scale)+y);
	for(var i=1; i<points.length; i++){
		context.lineTo((points[i].x*scale)+x, (points[i].y*scale)+y);
	}

	context.closePath();

	if(fillColor) context.fill();
	if(strokeColor) context.stroke();
}

DrawUtils.quadraticPolygon = function(context, x, y, points, fillColor, strokeColor, lineWidth, scale){
	if(strokeColor)	context.strokeStyle = strokeColor;	
	if(lineWidth)   context.lineWidth   = lineWidth;
	if(fillColor)   context.fillStyle   = fillColor;	
	
	if(!scale) scale = 1;

	context.beginPath();

	context.moveTo((points[0].x*scale)+x, (points[0].y*scale)+y);
	for(var i=1; i<points.length; i += 2){
		
		var next = i+1;
		if(next >= points.length){
			next = 0;
		}

		context.quadraticCurveTo((points[i].x*scale)+x, (points[i].y*scale)+y, (points[next].x*scale)+x, (points[next].y*scale)+y);
		
	}

	context.closePath();

	if(fillColor) context.fill();
	if(strokeColor) context.stroke();
}