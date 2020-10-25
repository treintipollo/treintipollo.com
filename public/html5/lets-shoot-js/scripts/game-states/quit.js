"use strict";

{
	class Quit extends State
	{
		constructor(stage)
		{
			super(stage);
		}
		
		Init()
		{
			if (window.nw)
			{
				window.nw.App.quit();
			}
			else
			{
				window.location.href = window.location.origin;
			}
		}
		
		Run()
		{

		}
		
		Completed()
		{
			
		}
		
		CleanSpecific()
		{

		}
	}

	window.Quit = Quit;
}