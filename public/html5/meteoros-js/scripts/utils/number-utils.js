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
	   			return (Math.random() * (maxNum - minNum + 1)) + minNum;
	   		}
	    }

	    static randPair(first, second, selectionRate)
	    {
	    	if (Math.random() < selectionRate)
	    	{
	    		return first;
	    	}
	    	else
	    	{
	    		return second;
	    	}
	    }
		
		static randBoolean()
		{
			if (Math.random() <= 0.5)
			{
				return true;
			}
			
			return false;
		}
	    
	    static randSet(... valueSet)
	    {
	    	return valueSet[randRange(0, valueSet.length - 1, true)];
	    }
	    
	    static wrap(kX, kLowerBound, kUpperBound)
	    {
		    let range = kUpperBound - kLowerBound + 1;
			
			kX = ((kX - kLowerBound) % range);
			
			kX < 0 ? range = kUpperBound + 1 + kX : range = kLowerBound + kX;
			
			return range;
		}
		
		static isPowerOfTwo(number)
		{
			 if (number <= 0)
			 	return false;
			 
			 return !(number & (number - 1));
		}

		static isNumber(number)
		{
			return typeof number === "number" && !isNaN(number);
		}
	}
	
	NumberUtils.TO_RADIAN   = (Math.PI / 180);
	NumberUtils.TO_DEGREE   = (180 / Math.PI);
	NumberUtils.RADIAN_UNIT = 0.017;

	self.NumberUtils = NumberUtils;
}