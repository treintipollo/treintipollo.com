"use strict";

{
	let exclamation;
	let pointer;

	class Images
	{
		constructor()
		{

		}

		static Init()
		{
			exclamation = new Bitmap("assets/Exclamation.png").set({ snapToPixel: true })
			pointer = new Bitmap("assets/Pointer.png").set({ snapToPixel: true });
		}
	}

	Object.defineProperty(Images, "_exclamation",
	{
		get: function()
		{
			return exclamation;
		}
	});

	Object.defineProperty(Images, "_pointer",
	{
		get: function()
		{
			return pointer;
		}
	});

	window.Images = Images;
}