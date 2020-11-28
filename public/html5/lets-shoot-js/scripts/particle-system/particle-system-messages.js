"use strict"

{
	let worker = null;
	let sharedStop = null;
	let sharedStopView = null;

	let isolated = true;
	let concurrency = navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 0;
	let path;
	
	if (window.location.origin === "http://localhost:8000")
	{
		// Local development
		isolated = true;
		path = `${window.location.origin}/scripts/`;
	}
	else if (window.location.origin === "http://localhost:3000")
	{
		// Local development in Treintipollo
		isolated = true;
		path = `${window.location.origin}/html5/lets-shoot-js/worker/scripts/`;
	}
	else
	{
		// Live
		isolated = !!window.crossOriginIsolated;
		path = `${window.location.origin}/html5/lets-shoot-js/worker/scripts/`;
	}

	if (window.Worker && isolated && concurrency > 1)
	{
		worker = new Worker(`${path}particle-system/particle-worker.js`);
	}

	if (window.SharedArrayBuffer && isolated && concurrency > 1)
	{
		sharedStop = new SharedArrayBuffer(Uint8Array.BYTES_PER_ELEMENT);
		sharedStopView = new Uint8Array(sharedStop);
	}

	let c = document.createElement("canvas");
	let hasTransferToOffscreen = typeof c.transferControlToOffscreen === "function";
	c = null;

	class ParticleSystemMessages
	{
		constructor()
		{

		}

		static _CanUse()
		{
			return (worker && sharedStop && sharedStopView && hasTransferToOffscreen);
		}

		static Init(canvasId)
		{
			if (!this._CanUse())
				return;

			const canvas = document.getElementById(canvasId);
			const offscreenCanvas = canvas.transferControlToOffscreen();

			worker.postMessage({
				name: "init",
				canvas: offscreenCanvas
			}, [offscreenCanvas]);
		}

		static Start()
		{
			if (!this._CanUse())
				return;

			worker.postMessage({
				name: "start",
				sharedStop: sharedStop
			});
		}

		static Pause()
		{
			if (!this._CanUse())
				return;

			worker.postMessage({
				name: "pause"
			});
		}

		static Resume()
		{
			if (!this._CanUse())
				return;

			worker.postMessage({
				name: "resume"
			});
		}

		static Send(name, args)
		{
			if (!this._CanUse())
				return;

			worker.postMessage({
				name: name,
				args: args
			});
		}

		static Update(stop)
		{
			if (!this._CanUse())
				return;

			sharedStopView[0] = Number(stop);
		}
	}

	window.ParticleSystemMessages = ParticleSystemMessages;
}