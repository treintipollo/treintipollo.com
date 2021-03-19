"use strict";

{
	class StringUtils
	{
		constructor()
		{

		}
		
		static toPoint(coord)
		{
			let numbers = coord.split(",");
			
			return new Point(Number(numbers[0]), Number(numbers[1]));
		}
		
      	static toBoolean(string)
      	{
      		return string.toLowerCase() === "true";
      	}
		
		static toArray(string, separator)
		{
			return string.split(separator);
		}
		
		static zeroPad(number, width)
		{
			let ret = "" + number;
			
			while (ret.length < width)
				ret = "0" + ret;
			
			return ret;
		}
	}

	window.StringUtils = StringUtils;
}