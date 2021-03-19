"use strict";

{
	let current = -1;

	class UIDGenerator
	{
		static getUID()
		{
			current++;
			
			return current;
		}
	}

	window.UIDGenerator = UIDGenerator;
}