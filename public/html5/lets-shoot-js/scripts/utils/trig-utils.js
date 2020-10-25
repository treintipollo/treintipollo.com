"use strict";

{
	class TrigUtils
	{
		constructor()
		{
		
		}
		
		static calcAngle(p1_x, p1_y, p2_x, p2_y)
		{
			const a_x = p2_x - p1_x;
			const a_y = p2_y - p1_y;
			
			const b_x = 1.0;
			const b_y = 0.0;
			
			return Math.acos((a_x * b_x + a_y * b_y) / Math.sqrt(a_x * a_x + a_y * a_y));
		}
		
		static calcAngleAtan2(p1_x, p1_y, p2_x, p2_y)
		{
			const deltaX = p1_x - p2_x;
			const deltaY = p1_y - p2_y;
			
			return Math.atan2(deltaY, deltaX);
		}
	}

	self.TrigUtils = TrigUtils;
}