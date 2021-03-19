"use strict";

{
	let particleSizes;
	let messages;
	let promise;

	class Files
	{
		constructor()
		{

		}

		static Init()
		{
			promise = new Promise(async (resolve) =>
			{
				const domparser = new DOMParser();

				let result = await fetch(new Request("assets/Particle_Sizes.xml"));
				let string = await result.text();
				particleSizes = domparser.parseFromString(string, "text/xml");

				result = await fetch(new Request("assets/messages.xml"));
				string = await result.text();
				messages = domparser.parseFromString(string, "text/xml");

				resolve();
			});
		}

		static IsReady()
		{
			return promise;
		}
	}

	Object.defineProperty(Files, "_particleSizes",
	{
		get: function()
		{
			return particleSizes;
		}
	});

	Object.defineProperty(Files, "_messages",
	{
		get: function()
		{
			return messages;
		}
	});

	window.Files = Files;
}