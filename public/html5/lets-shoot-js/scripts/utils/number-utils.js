"use strict";

{
	class NumberUtils
	{
		constructor()
		{

		}

		static normalize(value, minimum, maximum)
        {
            return (value - minimum) / (maximum - minimum);
        }

        static interpolate(normValue, minimum, maximum)
        {
            return minimum + (maximum - minimum) * normValue;
        }
        
        static map(value, min1, max1, min2, max2)
        {
            return NumberUtils.interpolate(NumberUtils.normalize(value, min1, max1), min2, max2);
        }
        
        static randRange(minNum, maxNum, returnInt = false)
	    {
	    	if (returnInt)
	    	{
	    		return Math.floor((Math.random() * (maxNum - minNum + 1)) + minNum);
	   		}
	   		else
	   		{
	   			return (Math.random() * (maxNum - minNum +1)) + minNum;
	   		}
	    }
	}
	
	self.NumberUtils = NumberUtils;
}