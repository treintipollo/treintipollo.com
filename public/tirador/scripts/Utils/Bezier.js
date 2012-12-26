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
	