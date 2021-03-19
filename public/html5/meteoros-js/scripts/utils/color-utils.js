"use strict";

{
	class ColorUtils
	{
		constructor()
		{

		}
		
		static interpolateColors(first, second, threshhold)
		{
			let firstA = first >> 24 & 0xFF;
			let firstR = first >> 16 & 0xFF;
			let firstG = first >> 8  & 0xFF;
			let firstB = first 		 & 0xFF;
			
			let secondA = second >> 24 & 0xFF;
			let secondR = second >> 16 & 0xFF;
			let secondG = second >> 8  & 0xFF;
			let secondB = second 	   & 0xFF;
			
			let tempA = secondA + (firstA - secondA)  * threshhold;
			let tempR = secondR + (firstR - secondR)  * threshhold;
			let tempG = secondG + (firstG - secondG)  * threshhold;
			let tempB = secondB + (firstB - secondB)  * threshhold;
			
			return (tempA << 24 | tempR << 16 | tempG << 8 | tempB);
		}
		
		static getRandomARGBColor()
		{
			let a = NumberUtils.randRange(0, 255, true);
			let r = NumberUtils.randRange(0, 255, true);
			let g = NumberUtils.randRange(0, 255, true);
			let b = NumberUtils.randRange(0, 255, true);
			
			return (a << 24 | r << 16 | g << 8 | b);
		}
		
		static getRandomRGBColor()
		{
			let r = NumberUtils.randRange(0, 255, true);
			let g = NumberUtils.randRange(0, 255, true);
			let b = NumberUtils.randRange(0, 255, true);
			
			return (255 << 24 | r << 16 | g << 8 | b);
		}
	}

	window.ColorUtils = ColorUtils;
}