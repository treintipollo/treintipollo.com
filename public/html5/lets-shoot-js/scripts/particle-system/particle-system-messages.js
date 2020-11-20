"use strict"

{
	let worker = null;
	let sharedStop = null;
	let sharedStopView = null;

	let baseWorkerPath = "scripts/particle-system/particle-worker.js";
	let isolated = true;
	let concurrency = navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 0;

	if (window.location.origin === "http://localhost:8000")
	{
		// Local development
		isolated = true;
	}
	else if (window.location.origin === "http://localhost:3000")
	{
		// Local development in Treintipollo
		isolated = true;
	}
	else
	{
		// Live
		isolated = !!window.crossOriginIsolated;
	}

	const workerPromise = fetch(baseWorkerPath)
	.then((response) =>
	{
		return response.text();
	})
	.then((script) =>
	{
		const blob = new Blob([script], { type: "application/javascript" });

		const url = URL.createObjectURL(blob);

		if (window.Worker && isolated && concurrency > 1)
			worker = new Worker(url);

		if (window.SharedArrayBuffer && isolated && concurrency > 1)
		{
			sharedStop = new SharedArrayBuffer(Uint8Array.BYTES_PER_ELEMENT);
			sharedStopView = new Uint8Array(sharedStop);
		}
	});

	let c = document.createElement("canvas");
	let hasTransferToOffscreen = typeof c.transferControlToOffscreen === "function";
	c = null;

	class ParticleSystemMessages
	{
		constructor()
		{

		}

		static async _CanUse()
		{
			await workerPromise;

			return worker && sharedStop && sharedStopView && hasTransferToOffscreen;
		}

		static async Init(canvasId)
		{
			if (!(await this._CanUse()))
				return;

			const canvas = document.getElementById(canvasId);
			const offscreenCanvas = canvas.transferControlToOffscreen();

			worker.postMessage({
				name: "init",
				canvas: offscreenCanvas
			}, [offscreenCanvas]);
		}

		static async Start()
		{
			if (!(await this._CanUse()))
				return;

			worker.postMessage({
				name: "start",
				sharedStop: sharedStop
			});
		}

		static async Pause()
		{
			if (!(await this._CanUse()))
				return;

			worker.postMessage({
				name: "pause"
			});
		}

		static async Resume()
		{
			if (!(await this._CanUse()))
				return;

			worker.postMessage({
				name: "resume"
			});
		}

		static async Send(name, args)
		{
			if (!(await this._CanUse()))
				return;

			worker.postMessage({
				name: name,
				args: args
			});
		}

		static async Update(stop)
		{
			if (!(await this._CanUse()))
				return;

			sharedStopView[0] = Number(stop);
		}
	}

	window.ParticleSystemMessages = ParticleSystemMessages;
}