"use strict";

{
	class VectorUtils
	{
		constructor()
		{
		
		}
		
		static distance(p1, p2)
		{
			const deltaX = p1.x - p2.x;
			const deltaY = p1.y - p2.y;
			const length = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
			
			return length;
		}

		static calcDistance(p1, p2)
		{
			const deltaX = p1.x - p2.x;
			const deltaY = p1.y - p2.y;
			const length = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
			
			return [deltaX, deltaY, length];
		}
		
		static normalize(p1, p2, value = 1)
		{
			const values = VectorUtils.calcDistance(p1, p2);
			const normX = (values[0] / values[2]) * value;
			const normY = (values[1] / values[2]) * value;
			
			return [new Point(normX, normY), values[2]];
		}
		
		static inRange(p1, p2, radius)
		{
			const deltaX = p1.x - p2.x;
			const deltaY = p1.y - p2.y;
			
			if((deltaX * deltaX) + (deltaY * deltaY) <= radius * radius)
			 	return true;
			
			return false;
		}
	}

	self.VectorUtils = VectorUtils;
}

