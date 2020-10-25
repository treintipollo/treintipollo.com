"use strict"

{
	let worker = null;
	let sharedStop = null;
	let sharedStopView = null;

	let baseWorkerPath = "scripts/particle-system/particle-worker.js";
	let absoluteWorkerPath = "";
	let isolated = true;

	absoluteWorkerPath = `${window.location.origin}/html5/lets-shoot-js/worker/${baseWorkerPath}`;
	isolated = !!window.crossOriginIsolated;

	if (window.Worker && isolated)
		worker = new Worker(absoluteWorkerPath);

	if (window.SharedArrayBuffer && isolated)
	{
		sharedStop = new SharedArrayBuffer(Uint8Array.BYTES_PER_ELEMENT);
		sharedStopView = new Uint8Array(sharedStop);
	}

	const c = document.createElement("canvas");
	const hasTransferToOffscreen = typeof c.transferControlToOffscreen === "function";

	class ParticleSystemMessages
	{
		constructor()
		{

		}

		static _CanUse()
		{
			return worker && sharedStop && sharedStopView && hasTransferToOffscreen;
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