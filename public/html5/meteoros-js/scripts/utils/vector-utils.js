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

		static calcDistanceXY(p1x, p1y, p2x, p2y)
		{
			let deltaX = p1x - p2x;
			let deltaY = p1y - p2y;
			
			return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
		}
		
		static normalize(p1, p2, ret = null, value = 1)
		{
			const values = VectorUtils.calcDistance(p1, p2);
			const normX = (values[0] / values[2]) * value;
			const normY = (values[1] / values[2]) * value;
			
			if (ret)
			{
				ret[0].x = normX;
				ret[0].y = normY;
				ret[1] = values[2];

				return ret;
			}
			else
			{
				return [new Point(normX, normY), values[2]];
			}
		}

		static normalizeXY(p1x, p1y, p2x, p2y, result, value = 1)
		{
			let deltaX = p1x - p2x;
			let deltaY = p1y - p2y;
			let length = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
			
			result[0].x = (deltaX / length) * value;
			result[0].y = (deltaY / length) * value;
			result[1]   = length;
			
			return result;
		}
		
		static inRange(p1, p2, radius)
		{
			const deltaX = p1.x - p2.x;
			const deltaY = p1.y - p2.y;
			
			if((deltaX * deltaX) + (deltaY * deltaY) <= (radius * radius))
			 	return true;
			
			return false;
		}

		static inRangeXY(p1x, p1y, p2x, p2y, radius)
		{
			const deltaX = p1x - p2x;
			const deltaY = p1y - p2y;
			
			if((deltaX * deltaX) + (deltaY * deltaY) <= (radius * radius))
			 	return true;
			
			return false;
		}
		
		static calcMoveVector(angle, result, value = 1, toRadian = true)
		{
			let radianAngle = angle;
			
			if (toRadian)
			{
				radianAngle *= NumberUtils.TO_RADIAN;
			}
			
			result.x = Math.cos(radianAngle) * value;
			result.y = Math.sin(radianAngle) * value;
			
			return result;
		}
	}

	self.VectorUtils = VectorUtils;
}

