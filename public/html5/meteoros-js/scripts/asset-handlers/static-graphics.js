"use strict";

{
	let shardsCanvas;
	let peopleCanvas;

	let promises = [];

	class Images
	{
		constructor()
		{

		}

		static Init()
		{
			promises.push(new Promise((resolve) =>
			{
				const shards = new Bitmap("assets/shards.png").set({ snapToPixel: true });
				
				shards.image.onload = (event) =>
				{
					shardsCanvas = new OffscreenCanvas(shards.image.width, shards.image.height);
					const context = shardsCanvas.getContext("2d");

					context.drawImage(shards.image, 0, 0);

					resolve();
				}
			}));

			promises.push(new Promise((resolve) =>
			{
				const people = new Bitmap("assets/people.png").set({ snapToPixel: true });

				people.image.onload = () =>
				{
					peopleCanvas = new OffscreenCanvas(people.image.width, people.image.height);
					const context = peopleCanvas.getContext("2d");

					context.drawImage(people.image, 0, 0);

					resolve();
				}
			}));
		}

		static IsReady()
		{
			return Promise.all(promises);
		}
	}

	Object.defineProperty(Images, "_shards",
	{
		get: function()
		{
			return shardsCanvas;
		}
	});

	Object.defineProperty(Images, "_people",
	{
		get: function()
		{
			return peopleCanvas;
		}
	});

	window.Images = Images;
}