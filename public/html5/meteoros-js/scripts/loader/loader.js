(async function()
{
	const supportFail = [];

	if (!window.OffscreenCanvas)
	{
		 window.OffscreenCanvas = function(width, height)
		 {
			const canvas = document.createElement("canvas");
			
			canvas.width = width;
			canvas.height = height;

			return canvas;
		};
	}

	const checkFroWebGL = () =>
	{
		let gl;

		const canvas = document.createElement("canvas");

		const options = {
			"failIfMajorPerformanceCaveat": true
		};

		try
		{
			gl = canvas.getContext("webgl2", options);
		}
		catch (e)
		{

		}

		if (!gl)
		{
			try
			{
				gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
			}
			catch (e)
			{
				
			}
		}

		return !!gl;
	};

	if (!checkFroWebGL())
		supportFail.push("WebGL");

	if (!window.fetch)
		supportFail.push("Fetch API");

	const audioContext = window.AudioContext || window.webkitAudioContext;

	if (!audioContext)
		supportFail.push("Audio context");

	if (!window.es6_js_support)
		supportFail.push("ES6 Syntax");

	if (supportFail.length > 0)
	{
		Promise.resolve()
		.then(() =>
		{
			return fetch("./scripts/loader/missing.html");
		})
		.then((response) =>
		{
			return response.text();
		})
		.then((mainHtml) =>
		{
			// Show the feedabck with the missing features
			const template = document.createElement("template");
			template.innerHTML = mainHtml;

			const list = template.content.querySelector(".list");

			for (const feature of supportFail)
			{
				const li = document.createElement("li");

				li.textContent = feature;

				list.appendChild(li);
			}

			document.getElementsByTagName("body")[0].appendChild(template.content);

			for (var i = 0; i < 100; i++)
			{
				const div = document.createElement("div");
				div.className = "box";
				document.body.appendChild(div);
			}
		});
	}
	else
	{
		await Promise.all(Array.from(document.fonts.values()).map((ff) => ff.loaded));

		const loadData = {
			"scripts": [
				{ path: "scripts/easeljs-NEXT.min.js" },

				{ path: "scripts/utils/extension-utils.js" },
				{ path: "scripts/utils/collection-utils.js" },
				{ path: "scripts/utils/shape-utils.js" },
				{ path: "scripts/utils/number-utils.js" },
				{ path: "scripts/utils/pause-utils.js" },
				{ path: "scripts/utils/string-utils.js" },
				{ path: "scripts/utils/trig-utils.js" },
				{ path: "scripts/utils/vector-utils.js" },
				{ path: "scripts/utils/probability-utils.js" },
				{ path: "scripts/utils/color-utils.js" },
				{ path: "scripts/utils/uid-generator.js" },
				{ path: "scripts/utils/text.js" },
				{ path: "scripts/utils/callback-chain.js" },
				{ path: "scripts/utils/callback.js" },
				{ path: "scripts/utils/timer.js" },
				{ path: "scripts/utils/shared-point.js" },

				{ path: "scripts/engine/actors/actor-init-arguments-getter.js" },
				{ path: "scripts/engine/actors/actor-init-arguments.js" },
				{ path: "scripts/engine/actors/actor.js" },
				{ path: "scripts/engine/actors/actor-collection.js" },
				{ path: "scripts/engine/actors/actor-manager.js" },
				{ path: "scripts/engine/actors/modules/logic.js" },
				{ path: "scripts/engine/actors/modules/renderer.js" },
				{ path: "scripts/engine/actors/modules/factory-logic.js" },

				{ path: "scripts/asset-handlers/dynamic-graphics.js" },
				{ path: "scripts/asset-handlers/static-graphics.js" },
				{ path: "scripts/asset-handlers/static-sounds.js" },
				{ path: "scripts/asset-handlers/static-files.js" },

				{ path: "scripts/engine/collision/actor-collision-manager.js" },
				{ path: "scripts/engine/collision/collider-collection.js" },
				{ path: "scripts/engine/collision/collision-group.js" },
				{ path: "scripts/engine/collision/collision-methods.js" },
				{ path: "scripts/engine/collision/colliders/collider.js" },
				{ path: "scripts/engine/collision/colliders/circle-collider.js" },
				{ path: "scripts/engine/collision/colliders/box-collider.js" },
				{ path: "scripts/engine/collision/shapes/circle.js" },
				{ path: "scripts/engine/collision/shapes/aabb.js" },
				{ path: "scripts/engine/collision/shapes/triangle.js" },
				
				{ path: "scripts/engine/gui/gui-actor-manager.js" },
				{ path: "scripts/engine/gui/gui-group.js" },

				{ path: "scripts/engine/input/keyboard.js" },
				{ path: "scripts/engine/input/mouse.js" },

				{ path: "scripts/engine/levels/level-manager.js" },
				{ path: "scripts/engine/levels/level.js" },
				{ path: "scripts/engine/levels/requirements/requirements-collection.js" },
				{ path: "scripts/engine/levels/requirements/requirements-getter.js" },
				{ path: "scripts/engine/levels/requirements/requirements-group.js" },
				{ path: "scripts/engine/levels/requirements/requirements-manager.js" },

				{ path: "scripts/engine/modules/module-package-collection.js" },
				{ path: "scripts/engine/modules/module-package-factory.js" },
				{ path: "scripts/engine/modules/module-package.js" },

				{ path: "scripts/engine/sound/sound.js" },
				{ path: "scripts/engine/sound/sound-channel.js" },
				{ path: "scripts/engine/sound/sound-transform.js" },
				{ path: "scripts/engine/sound/game-sound.js" },
				{ path: "scripts/engine/sound/game-sound-channel.js" },
				{ path: "scripts/engine/sound/sound-manager.js" },

				{ path: "scripts/engine/state-machine/state-machine.js" },
				{ path: "scripts/engine/state-machine/state.js" },
				{ path: "scripts/engine/state-machine/wire.js" },
				
				{ path: "scripts/game/input-visuals/arrow-pointer.js" },
				{ path: "scripts/game/input-visuals/cross-hair.js" },
				{ path: "scripts/game/input-visuals/input-visuals-manager.js" },

				{ path: "scripts/game/levels/level-initializer.js" },
				{ path: "scripts/game/levels/level-1.js" },
				{ path: "scripts/game/levels/level-2.js" },
				{ path: "scripts/game/levels/level-3.js" },
				{ path: "scripts/game/levels/level-4.js" },
				{ path: "scripts/game/levels/level-5.js" },
				{ path: "scripts/game/levels/level-6.js" },
				{ path: "scripts/game/levels/level-7.js" },
				{ path: "scripts/game/levels/level-8.js" },

				{ path: "scripts/game/levels/bosses/pyramid-boss-level.js" },
				{ path: "scripts/game/levels/bosses/pyramid-boss-level-1.js" },
				{ path: "scripts/game/levels/bosses/pyramid-boss-level-2.js" },
				{ path: "scripts/game/levels/bosses/pyramid-boss-level-3.js" },
				{ path: "scripts/game/levels/bosses/pyramid-boss-level-4.js" },
				{ path: "scripts/game/levels/requirements/cities-destroyed.js" },
				{ path: "scripts/game/levels/requirements/destroy-count.js" },
				{ path: "scripts/game/levels/requirements/destroy-boss.js" },

				{ path: "scripts/game/modules/city/city-logic.js" },
				{ path: "scripts/game/modules/city/city-renderer.js" },
				{ path: "scripts/game/modules/city/city-collider.js" },
				{ path: "scripts/game/modules/city/city-observer-logic.js" },

				{ path: "scripts/game/modules/city-population/city-population-logic.js" },
				{ path: "scripts/game/modules/city-population/city-population-renderer.js" },

				{ path: "scripts/game/modules/gui/gui-component-logic.js" },
				{ path: "scripts/game/modules/gui/gui-component-logic-container.js" },
				{ path: "scripts/game/modules/gui/fades/gui-scale-fade.js" },
				{ path: "scripts/game/modules/gui/fades/gui-alpha-fade.js" },
				{ path: "scripts/game/modules/gui/fades/gui-float-feedback.js" },
				{ path: "scripts/game/modules/gui/icons/crown-icon-renderer.js" },
				{ path: "scripts/game/modules/gui/icons/population-icon-renderer.js" },
				{ path: "scripts/game/modules/gui/popup/button-list-popup-initialization.js" },
				{ path: "scripts/game/modules/gui/popup/list-popup-initialization.js" },
				{ path: "scripts/game/modules/gui/popup/gui-button-list-logic.js" },
				{ path: "scripts/game/modules/gui/popup/gui-list-popup-logic.js" },
				{ path: "scripts/game/modules/gui/popup/gui-popup-renderer.js" },
				{ path: "scripts/game/modules/gui/text/gui-text-logic.js" },
				{ path: "scripts/game/modules/gui/text/gui-text-renderer.js" },
				{ path: "scripts/game/modules/gui/text/gui-text-scale-logic.js" },
				{ path: "scripts/game/modules/gui/text/gui-text-fade-logic.js" },
				{ path: "scripts/game/modules/gui/text/gui-text-float-logic.js" },
				{ path: "scripts/game/modules/gui/text/gui-text-countdown-logic.js" },
				{ path: "scripts/game/modules/gui/text/gui-text-rotate-logic.js" },
				{ path: "scripts/game/modules/gui/text/gui-text-button-input.js" },
				{ path: "scripts/game/modules/gui/text/gui-extended-text-renderer.js" },
				{ path: "scripts/game/modules/gui/text/gui-extended-text-renderer-initialization.js" },
				{ path: "scripts/game/modules/gui/transitions/fade-to-black-logic.js" },
				{ path: "scripts/game/modules/gui/transitions/fade-to-black-renderer.js" },

				{ path: "scripts/game/modules/meteor/meteor-launcher-logic.js" },
				{ path: "scripts/game/modules/meteor/meteor-logic.js" },
				{ path: "scripts/game/modules/meteor/meteor-renderer.js" },
				{ path: "scripts/game/modules/meteor/meteor-hp-logic.js" },
				{ path: "scripts/game/modules/meteor/meteor-hp-renderer.js" },
				{ path: "scripts/game/modules/meteor/meteor-hp-collider.js" },
				{ path: "scripts/game/modules/meteor/meteor-parabolic-logic.js" },
				{ path: "scripts/game/modules/meteor/meteor-split-logic.js" },

				{ path: "scripts/game/modules/missile/missile-logic.js" },
				{ path: "scripts/game/modules/missile/missile-renderer.js" },
				{ path: "scripts/game/modules/missile/missile-collider.js" },
				{ path: "scripts/game/modules/missile/missile-sound.js" },

				{ path: "scripts/game/modules/missile-launcher/missile-launcher-logic.js" },
				{ path: "scripts/game/modules/missile-launcher/missile-launcher-renderer.js" },
				{ path: "scripts/game/modules/missile-launcher/missile-launcher-input.js" },

				{ path: "scripts/game/modules/ufo/ufo-base-initialization.js" },
				{ path: "scripts/game/modules/ufo/ufo-coordinator-logic.js" },
				{ path: "scripts/game/modules/ufo/ufo-base-logic.js" },
				{ path: "scripts/game/modules/ufo/ufo-slow-logic.js" },
				{ path: "scripts/game/modules/ufo/ufo-teleport-logic.js" },
				{ path: "scripts/game/modules/ufo/ufo-scroll-logic.js" },
				{ path: "scripts/game/modules/ufo/ufo-laser-logic.js" },
				{ path: "scripts/game/modules/ufo/ufo-collider.js" },
				{ path: "scripts/game/modules/ufo/ufo-renderer.js" },

				{ path: "scripts/game/modules/bomb/bomb-logic.js" },
				{ path: "scripts/game/modules/bomb/bomb-renderer.js" },
				{ path: "scripts/game/modules/bomb/bomb-collider.js" },

				{ path: "scripts/game/modules/laser/laser-logic.js" },
				{ path: "scripts/game/modules/laser/laser-renderer.js" },

				{ path: "scripts/game/modules/bosses/boss-creator-logic.js" },
				{ path: "scripts/game/modules/bosses/pyramid-boss/pyramid-boss-logic.js" },
				{ path: "scripts/game/modules/bosses/pyramid-boss/pyramid-boss-renderer.js" },
				{ path: "scripts/game/modules/bosses/pyramid-boss/pyramid-boss-collider.js" },
				{ path: "scripts/game/modules/bosses/pyramid-boss/initialization/pyramid-boss-logic-initialization.js" },
				{ path: "scripts/game/modules/bosses/pyramid-boss/initialization/pyramid-boss-renderer-initialization.js" },
				{ path: "scripts/game/modules/bosses/pyramid-boss/attacks/attack-state.js" },
				{ path: "scripts/game/modules/bosses/pyramid-boss/attacks/bomb-attack.js" },
				{ path: "scripts/game/modules/bosses/pyramid-boss/attacks/laser-attack.js" },
				{ path: "scripts/game/modules/bosses/pyramid-boss/attacks/meteor-attack.js" },
				{ path: "scripts/game/modules/bosses/pyramid-boss/states/pyramid-boss-state.js" },
				{ path: "scripts/game/modules/bosses/pyramid-boss/states/pyramid-damage.js" },
				{ path: "scripts/game/modules/bosses/pyramid-boss/states/pyramid-scroll.js" },
				{ path: "scripts/game/modules/bosses/pyramid-boss/states/pyramid-teleport.js" },

				{ path: "scripts/game/modules/screen-cover/screen-cover-logic.js" },

				{ path: "scripts/game/message-getter.js" },
				{ path: "scripts/game/save-data.js" },
				{ path: "scripts/game/score-counter.js" },

				{ path: "scripts/game/states/game-state.js" },
				{ path: "scripts/game/states/splash-state.js" },
				{ path: "scripts/game/states/level-select-state.js" },
				{ path: "scripts/game/states/victory-state.js" },
				{ path: "scripts/game/states/gameover-state.js" },
				{ path: "scripts/game/states/epilogue-state.js" },
				{ path: "scripts/game/states/options-state.js" },
				{ path: "scripts/game/states/main-game/single-level-game-state.js" },
				{ path: "scripts/game/states/main-game/endurance-level-game-state.js" },
				{ path: "scripts/game/states/main-game/sub-main-game-state.js" },
				{ path: "scripts/game/states/main-game/intro.js" },
				{ path: "scripts/game/states/main-game/outro.js" },
				{ path: "scripts/game/states/main-game/pause.js" },

				{ path: "scripts/engine/particle-system/initialization/particle-system-initialization-arguments.js" },
				{ path: "scripts/engine/particle-system/initialization/particle-system-initialization-manager.js" },
				{ path: "scripts/engine/particle-system/particle-system-manager.js" },
				{ path: "scripts/engine/particle-system/system-controller.js" },
				
				{ path: "scripts/engine/particle-system/systems/base-system.js" },
				{ path: "scripts/engine/particle-system/systems/batch.js" },
				{ path: "scripts/engine/particle-system/systems/circle-area.js" },
				{ path: "scripts/engine/particle-system/systems/circle-perimeter.js" },
				{ path: "scripts/engine/particle-system/systems/square-area.js" },
				{ path: "scripts/engine/particle-system/systems/straight-line.js" },
				
				{ path: "scripts/engine/particle-system/particles/base-particle.js" },
				{ path: "scripts/engine/particle-system/particles/axis.js" },
				{ path: "scripts/engine/particle-system/particles/constrain-radial.js" },
				{ path: "scripts/engine/particle-system/particles/cubic-bezier.js" },
				{ path: "scripts/engine/particle-system/particles/out-radial.js" },
				{ path: "scripts/engine/particle-system/particles/radial.js" },
				{ path: "scripts/engine/particle-system/particles/vacum.js" },
				{ path: "scripts/engine/particle-system/particles/vortex.js" },

				{ path: "scripts/game/particle-initializer.js" },

				{ path: "scripts/init.js" }
			],

			"sounds": [
				{ path: "assets/GAMEOVER_VICTORY.wav" },
				{ path: "assets/MAINGAME_1.wav" },
				{ path: "assets/MAINGAME_2.wav" },
				{ path: "assets/MAINGAME_3.wav" },
				{ path: "assets/MAINGAME_4.wav" },
				{ path: "assets/SPLASH_GAMEOVER.wav" },
				{ path: "assets/BOSS.wav" }
			],

			"blobs": [
				
			]
		}

		const canvas = document.getElementById("canvas");
		const rect = canvas.getBoundingClientRect();

		document.body.style.setProperty("--canvas-width", Math.floor(rect.width) + "px");
		document.body.style.setProperty("--canvas-height", Math.floor(rect.height) + "px");
		
		const loadingBackground = document.createElement("div");
		const loadingMidground = document.createElement("div");
		const loadingForeground = document.createElement("div");
		const loadingText = document.createElement("div");

		loadingBackground.classList.add("loader", "back");
		loadingMidground.classList.add("loader", "middle");
		loadingForeground.classList.add("loader", "front");
		loadingText.classList.add("loader", "text");

		loadingText.textContent = "LOADING 0%";

		const canvasWrapper = document.getElementById("canvas-wrapper");
		canvasWrapper.appendChild(loadingBackground);
		canvasWrapper.appendChild(loadingMidground);
		canvasWrapper.appendChild(loadingForeground);
		canvasWrapper.appendChild(loadingText);

		const totalResources = loadData["scripts"].length + loadData["sounds"].length + loadData["blobs"].length;
		let totalReceived = 0;

		const allResources = await GetAllResources(loadData, () =>
		{
			totalReceived++;

			let percent = (totalReceived / totalResources);
			
			if (percent >= 1)
				percent = 1;

			loadingMidground.style.width = ((rect.width / 2) * percent) + "px";
			loadingText.textContent = "LOADING " + (percent * 100) + "%";

			if (percent === 1)
			{
				if (getComputedStyle(loadingBackground).opacity === "1")
				{
					loadingBackground.addEventListener("transitionend", function()
					{
						canvasWrapper.removeChild(loadingBackground);
						canvasWrapper.removeChild(loadingMidground);
						canvasWrapper.removeChild(loadingForeground);
						canvasWrapper.removeChild(loadingText);
					});
				}

				loadingBackground.style.opacity = 0;
				loadingMidground.style.opacity = 0;
				loadingForeground.style.opacity = 0;
				loadingText.style.opacity = 0;
			}
		});

		LoadBlobs(allResources["blobs"]);
		LoadSounds(allResources["sounds"]);
		LoadScripts(allResources["scripts"]);
	}

	function LoadScripts(allScripts)
	{
		if (!allScripts.length)
			return;

		const script = allScripts.shift();

		const s = document.createElement("script");

		s.type = "text/javascript";
		s.textContent = script.script;

		console.log(script.url);

		document.body.appendChild(s);

		LoadScripts(allScripts);
	}

	function LoadSounds(allSounds)
	{
		window.SoundBuffers = new Map();

		for (const sound of allSounds)
			window.SoundBuffers.set(sound.url, sound.sound);
	}

	function LoadBlobs(allBlobs)
	{
		window.BlobUrls = new Map();

		for (const blob of allBlobs)
			window.BlobUrls.set(blob.url, blob.blobUrl);
	}

	function GetAllResources(resources, progressCallback)
	{
		const scripts = resources["scripts"];
		const sounds = resources["sounds"];
		const blobs = resources["blobs"];

		const scriptRet = new Array(scripts.length);
		const soundRet = new Array(sounds.length);
		const blobRet = new Array(blobs.length);

		const p = [];

		for (let i = 0; i < scripts.length; i++)
			p.push(GetScript(scripts[i].path, progressCallback, i));

		for (let i = 0; i < sounds.length; i++)
			p.push(GetSound(sounds[i].path, progressCallback, i));

		for (let i = 0; i < blobs.length; i++)
			p.push(GetBlob(blobs[i].path, progressCallback, i));

		return Promise.all(p).then((results) =>
		{
			for (const result of results)
			{
				if (result.type === "script")
				{
					scriptRet[result.index] = {
						url: scripts[result.index].path,
						index: result.index,
						script: result.text
					};
				}

				if (result.type === "sound")
				{
					soundRet[result.index] = {
						url: sounds[result.index].path,
						index: result.index,
						sound: result.buffer
					};
				}

				if (result.type === "blob")
				{
					blobRet[result.index] = {
						url: blobs[result.index].path,
						index: result.index,
						blobUrl: result.url
					};
				}
			}

			return {
				"scripts": scriptRet,
				"sounds": soundRet,
				"blobs": blobRet
			};
		});
	}

	async function GetScript(url, scriptReadCallback, index)
	{
		const cacheBust = document.body.getAttribute("data-cache-bust");

		const response = await fetch(`${url}?b=${cacheBust}`, { method: "GET" });
		const scriptText = await response.text();

		scriptReadCallback();

		return {
			type: "script",
			index: index,
			text: scriptText
		}
	}

	async function GetSound(url, soundReadCallback, index)
	{
		const cacheBust = document.body.getAttribute("data-cache-bust");

		const response = await fetch(`${url}?b=${cacheBust}`, { method: "GET" });
		const buffer = await response.arrayBuffer();

		soundReadCallback();

		return {
			type: "sound",
			index: index,
			buffer: buffer
		}
	}

	async function GetBlob(url, blobReadCallback, index)
	{
		const cacheBust = document.body.getAttribute("data-cache-bust");

		const response = await fetch(`${url}?b=${cacheBust}`, { method: "GET" });
		const blob = await response.blob();

		blobReadCallback();

		return {
			type: "blob",
			index: index,
			url: URL.createObjectURL(blob)
		}
	}

})();
