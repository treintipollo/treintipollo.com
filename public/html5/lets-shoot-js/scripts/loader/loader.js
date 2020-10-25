(async function()
{
	if (!window.OffscreenCanvas)
	{
		window.OffscreenCanvas = function(width, height)
		{
			const canvas = document.createElement("canvas");

			canvas.width = width;
			canvas.height = height;

			return canvas;
		}
	}

	const supportFail = [];

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
				{ path: "scripts/utils/shape-utils.js" },
				{ path: "scripts/utils/number-utils.js" },
				{ path: "scripts/utils/trig-utils.js" },
				{ path: "scripts/utils/vector-utils.js" },
				{ path: "scripts/utils/transform.js" },
				{ path: "scripts/utils/color-transform.js" },
				{ path: "scripts/utils/timer.js" },
				{ path: "scripts/utils/shared-point.js" },
				{ path: "scripts/sound/sound.js" },
				{ path: "scripts/sound/sound-channel.js" },
				{ path: "scripts/sound/sound-transform.js" },
				{ path: "scripts/sound/game-sound.js" },
				{ path: "scripts/sound/game-sound-channel.js" },
				{ path: "scripts/sound/sound-manager.js" },
				{ path: "scripts/collision/grid.js" },
				{ path: "scripts/collision/node.js" },
				{ path: "scripts/ui/button.js" },
				{ path: "scripts/ui/custom-pointer.js" },
				{ path: "scripts/ui/menu-frame.js" },
				{ path: "scripts/ui/splash-button-manager.js" },
				{ path: "scripts/ui/splash-button.js" },
				{ path: "scripts/ui/splash-image.js" },
				{ path: "scripts/ui/splash-manager.js" },
				{ path: "scripts/ui/splash-text.js" },
				{ path: "scripts/ui/text.js" },
				{ path: "scripts/ui/chain-counter.js" },
				{ path: "scripts/ui/stop-light.js" },
				{ path: "scripts/ui/sound/slider.js" },
				{ path: "scripts/ui/sound/sound-manager-ui.js" },
				{ path: "scripts/ui/sound/volume-control.js" },
				{ path: "scripts/ui/sound/sound-test-ui.js" },
				{ path: "scripts/ui/level-select/level-select-ui.js" },
				{ path: "scripts/ui/level-select/select-rectangle.js" },
				{ path: "scripts/input/keyboard.js" },
				{ path: "scripts/input/gamepad.js" },
				{ path: "scripts/state-machine/state-manager.js" },
				{ path: "scripts/state-machine/state.js" },
				{ path: "scripts/game-states/splash-screen.js" },
				{ path: "scripts/game-states/difficulty-select.js" },
				{ path: "scripts/game-states/practice.js" },
				{ path: "scripts/game-states/quit.js" },
				{ path: "scripts/game-states/sound-test.js" },
				{ path: "scripts/game-states/level-select.js" },
				{ path: "scripts/game-states/level-intro.js" },
				{ path: "scripts/game-states/main-game.js" },
				{ path: "scripts/game-states/stage-complete.js" },
				{ path: "scripts/game-states/game-over.js" },
				{ path: "scripts/game-states/boss-level.js" },
				{ path: "scripts/game-states/free-upgrade.js" },
				{ path: "scripts/game-states/all-clear.js" },
				{ path: "scripts/game-actors/player/player.js" },
				{ path: "scripts/game-actors/player/bit.js" },
				{ path: "scripts/game-actors/player/bullet.js" },
				{ path: "scripts/game-actors/player/bullet-manager.js" },
				{ path: "scripts/game-logic/level.js" },
				{ path: "scripts/game-logic/warning-sign.js" },
				{ path: "scripts/game-logic/level-end-sign.js" },
				{ path: "scripts/game-actors/baddy/baddy.js" },
				{ path: "scripts/game-actors/baddy/baddy-segment.js" },
				{ path: "scripts/game-actors/baddy/baddy-manager.js" },
				{ path: "scripts/game-actors/baddy/generator.js" },
				{ path: "scripts/game-actors/baddy/boss-baddy.js" },
				{ path: "scripts/game-actors/baddy/parameters/baddy-parameters.js" },
				{ path: "scripts/game-actors/baddy/parameters/generator-parameters.js" },
				{ path: "scripts/game-actors/baddy/parameters/weak.js" },
				{ path: "scripts/game-actors/baddy/parameters/strong.js" },
				{ path: "scripts/game-actors/baddy/parameters/fast.js" },
				{ path: "scripts/game-actors/baddy/parameters/invinsible.js" },
				{ path: "scripts/game-actors/baddy/parameters/random-fill-color.js" },
				{ path: "scripts/game-actors/baddy/parameters/weak-generator.js" },
				{ path: "scripts/game-actors/baddy/parameters/strong-generator.js" },
				{ path: "scripts/game-actors/baddy/parameters/fast-generator.js" },
				{ path: "scripts/game-actors/baddy/parameters/invinsible-generator.js" },
				{ path: "scripts/game-actors/baddy/parameters/boss-bullet.js" },
				{ path: "scripts/game-actors/baddy/concrete/ramming-baddy.js" },
				{ path: "scripts/game-actors/baddy/concrete/bouncing-baddy.js" },
				{ path: "scripts/game-actors/baddy/concrete/exploding-baddy.js" },
				{ path: "scripts/game-actors/baddy/concrete/snake-baddy.js" },
				{ path: "scripts/game-actors/baddy/concrete/fill-generator.js" },
				{ path: "scripts/game-actors/baddy/concrete/center-generator.js" },
				{ path: "scripts/game-actors/baddy/concrete/straight-bullet.js" },
				{ path: "scripts/game-actors/baddy/concrete/shotgun-bullet.js" },
				{ path: "scripts/game-actors/baddy/concrete/exploding-bullet.js" },
				{ path: "scripts/game-actors/baddy/concrete/spiral-bullet.js" },
				{ path: "scripts/game-actors/baddy/concrete/snake-bullet.js" },
				{ path: "scripts/game-actors/baddy/concrete/attack-bit.js" },
				{ path: "scripts/game-actors/baddy/concrete/bomb-bit.js" },
				{ path: "scripts/game-actors/baddy/boss/ramm-boss.js" },
				{ path: "scripts/game-actors/baddy/boss/bounce-boss.js" },
				{ path: "scripts/game-actors/baddy/boss/explode-boss.js" },
				{ path: "scripts/game-actors/baddy/boss/snake-boss.js" },
				{ path: "scripts/game-actors/baddy/boss/big-boss.js" },
				{ path: "scripts/asset-handlers/dynamic-graphics.js" },
				{ path: "scripts/asset-handlers/static-graphics.js" },
				{ path: "scripts/asset-handlers/static-sounds.js" },
				{ path: "scripts/effects/shooting-star.js" },
				{ path: "scripts/effects/rocket.js" },
				{ path: "scripts/effects/rocket-launcher.js" },
				{ path: "scripts/particle-system/particle-system-messages.js" },

				{ path: "scripts/init.js" }
			],

			"sounds": [
				{ path: "assets/IntroBGM.mp3" },
				{ path: "assets/MainBGM.mp3" },
				{ path: "assets/BossBGM.mp3" },
				{ path: "assets/BigBossBGM.mp3" },
				{ path: "assets/Test.mp3" },
				{ path: "assets/FreeUpgradeBGM.mp3" },
				{ path: "assets/Missile.mp3" },
				{ path: "assets/Explosion2.mp3" },
				{ path: "assets/SplashButtonOver.mp3" },
				{ path: "assets/SplashButtonPress.mp3" },
				{ path: "assets/MenuButtonOver.mp3" },
				{ path: "assets/MenuOff.mp3" },
				{ path: "assets/MenuOn.mp3" },
				{ path: "assets/Cash.mp3" },
				{ path: "assets/Negative.mp3" },
				{ path: "assets/LevelSelected.mp3" },
				{ path: "assets/Alarm.mp3" },
				{ path: "assets/RocketBlow.mp3" },
				{ path: "assets/RocketBlow2.mp3" },
				{ path: "assets/RocketBlow3.mp3" },
				{ path: "assets/RocketBlow4.mp3" },
				{ path: "assets/RocketBlow5.mp3" },
				{ path: "assets/RocketBlow6.mp3" },
				{ path: "assets/Pop.mp3" },
				{ path: "assets/Pop2.mp3" },
				{ path: "assets/Pop3.mp3" },
				{ path: "assets/StopLight.mp3" },
				{ path: "assets/RammBaddy.mp3" },
				{ path: "assets/BounceBaddy.mp3" },
				{ path: "assets/ExplodeBaddy.mp3" },
				{ path: "assets/SnakeBaddy.mp3" },
				{ path: "assets/ScreenSpawnAlarm.mp3" },
				{ path: "assets/LightSaber.mp3" },
				{ path: "assets/Regen.mp3" },
				{ path: "assets/Spark.mp3" },
				{ path: "assets/Spark1.mp3" },
				{ path: "assets/Explosion.mp3" },
				{ path: "assets/Complete.mp3" },
				{ path: "assets/Laugh.mp3" }
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

		loadingText.textContent = "Loading 0%";

		const canvasWrapper = document.getElementById("canvas-wrapper");
		canvasWrapper.appendChild(loadingBackground);
		canvasWrapper.appendChild(loadingMidground);
		canvasWrapper.appendChild(loadingForeground);
		canvasWrapper.appendChild(loadingText);

		const scriptsLength = await GetAllResourcesSize(loadData["scripts"]);
		const soundsLength = await GetAllResourcesSize(loadData["sounds"]);
		let receivedLength = 0;

		const allResources = await GetAllResources(loadData, (chunckAmount) =>
		{
			receivedLength += chunckAmount;

			let percent = (receivedLength / (scriptsLength + soundsLength));
			
			if (percent >= 1)
				percent = 1;
			
			loadingMidground.style.width = ((rect.width / 2) * percent) + "px";
			loadingText.textContent = "Loading " + (percent * 100) + "%";

			if (percent === 1)
			{
				if (loadingBackground.style.opacity === 1)
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

		document.body.appendChild(s);

		LoadScripts(allScripts);
	}

	function LoadSounds(allSounds)
	{
		window.SoundBuffers = new Map();

		for (const sound of allSounds)
			window.SoundBuffers.set(sound.url, sound.sound);
	}

	async function GetAllResourcesSize(urls)
	{
		let ret = 0;

		for (const url of urls)
		{
			const size = await GetResourceSize(url.path);

			ret += Number(size);
		}

		return ret;
	}

	async function GetResourceSize(url)
	{
		const response = await fetch(url, { method: "HEAD" });
		
		return response.headers.get("content-length");
	}

	function GetAllResources(resources, progressCallback)
	{
		const scripts = resources["scripts"];
		const sounds = resources["sounds"];

		const scriptRet = new Array(scripts.length);
		const soundRet = new Array(sounds.length);

		const p = [];

		for (let i = 0; i < scripts.length; i++)
			p.push(GetScript(scripts[i].path, progressCallback, i));

		for (let i = 0; i < sounds.length; i++)
			p.push(GetSound(sounds[i].path, progressCallback, i));

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

				
			}

			return {
				"scripts": scriptRet,
				"sounds": soundRet
			};
		});
	}

	async function GetScript(url, chunkReadCallback, index)
	{
		const response = await fetch(url, { method: "GET" });

		const reader = response.body.getReader();

		const chunks = [];
		const readAmount = await ReadChunk(reader, chunks, 0, chunkReadCallback)

		let chunksAll = new Uint8Array(readAmount);
		let position = 0;
		
		for (let chunk of chunks)
		{
			chunksAll.set(chunk, position);
			position += chunk.length;
		}

		return {
			type: "script",
			index: index,
			text: new TextDecoder("utf-8").decode(chunksAll)
		}
	}

	async function GetSound(url, chunkReadCallback, index)
	{
		const response = await fetch(url, { method: "GET" });

		const reader = response.body.getReader();

		const chunks = [];
		const readAmount = await ReadChunk(reader, chunks, 0, chunkReadCallback)

		let chunksAll = new Uint8Array(readAmount);
		let position = 0;
		
		for (let chunk of chunks)
		{
			chunksAll.set(chunk, position);
			position += chunk.length;
		}

		return {
			type: "sound",
			index: index,
			buffer: chunksAll.buffer
		}
	}

	async function ReadChunk(reader, chunksResult, readAmount, chunckReadCallback)
	{
		const chunck = await reader.read();

		// Exit when done
		if (chunck.done)
			return readAmount;

		// Push the chunck into a result array
		chunksResult.push(chunck.value);

		// Notify the outside that a chunk has been read
		chunckReadCallback(chunck.value.length);

		readAmount += chunck.value.length;

		// Read another chunk
		return await ReadChunk(reader, chunksResult, readAmount, chunckReadCallback);
	}
})();
