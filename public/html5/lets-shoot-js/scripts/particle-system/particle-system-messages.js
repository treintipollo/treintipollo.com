"use strict"

{
	const worker = new WorkerStub();
	
	class ParticleSystemMessages
	{
		constructor()
		{

		}

		static Init(canvasId)
		{
			const canvas = document.getElementById(canvasId);

			worker.postMessage({
				name: "init",
				canvas: canvas
			});
		}

		static Send(name, args)
		{
			worker.postMessage({
				name: name,
				args: args
			});
		}

		static Update(stop)
		{
			if (window.ParticleSystemManager)
				window.ParticleSystemManager.Update(Number(stop));
		}
	}

	window.ParticleSystemMessages = ParticleSystemMessages;
}