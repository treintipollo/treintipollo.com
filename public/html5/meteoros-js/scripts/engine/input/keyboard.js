"use strict";

{
	let initialized = false;

	class KeyObject
	{
		constructor(stage)
		{
			this._stage = stage;
			this._keysDown = new Map();

			this._releaseCallbacks = new Object();

			document.addEventListener("keydown", (event) => this._OnKeyDown(event));
			document.addEventListener("keyup", (event) => this._OnKeyUp(event));
			
			window.addEventListener("blur", (event) => this._OnBlur(event));
		}

		addReleaseCallback(key, callback)
		{
			this._releaseCallbacks[key] = callback;
		}
		
		removeReleaseCallbacks()
		{
			for (let k in this._releaseCallbacks)
			{
				delete this._releaseCallbacks[k];
			}
		}

		isDown(key)
		{
			return this._keysDown.has(key);
		}

		_OnKeyDown(event)
		{
			if (!this._HandlesKey(event))
				return;

			this._keysDown.set(event.key, true);

			event.preventDefault();
		}

		_OnKeyUp(event)
		{
			if (this._releaseCallbacks[event.key])
				this._releaseCallbacks[event.key]();

			this._keysDown.delete(event.key);

			event.preventDefault();
		}
		
		_OnBlur(event)
		{
			this._keysDown.clear();
		}

		_HandlesKey(event)
		{
			for (const k in window.Keyboard)
			{
				if (window.Keyboard[k] === event.key)
					return true;
			}

			return false;
		}
	}

	window.KeyObject = KeyObject;

	window.Keyboard = {
		ESCAPE: "Escape",
		T: "t",
		W: "w",
		A: "a",
		S: "s",
		D: "d",
		P: "p",
		ARROW_UP: "ArrowUp",
		ARROW_DOWN: "ArrowDown",
		ARROW_LEFT: "ArrowLeft",
		ARROW_RIGHT: "ArrowRight",
		SPACEBAR: " ",
		NUM_1: "1",
		NUM_2: "2",
		NUM_3: "3",
		NUM_4: "4",
		NUM_5: "5"
	}
}