"use strict";

{
	let initialized = false;

	const keysDown = new Map();

	const on_keydown = (event) => Key._OnKeyDown(event);
	const on_keyup = (event) => Key._OnKeyUp(event);
	const on_blur = (event) => Key._OnBlur(event);

	class Key
	{
		constructor()
		{
			
		}

		static Initialize()
		{
			if (initialized)
				return;

			initialized = true;

			document.addEventListener("keydown", on_keydown);
			document.addEventListener("keyup", on_keyup);
			window.addEventListener("blur", on_blur);
		}

		static isDown(key)
		{
			return keysDown.has(key);
		}

		static _OnKeyDown(event)
		{
			if (!this._HandlesKey(event))
				return;

			keysDown.set(event.key, true);

			event.preventDefault();
		}

		static _OnKeyUp(event)
		{
			keysDown.delete(event.key);

			event.preventDefault();
		}
		
		static _OnBlur(event)
		{
			keysDown.clear();
		}

		static _HandlesKey(event)
		{
			for (const k in window.Keyboard)
			{
				if (window.Keyboard[k] === event.key)
					return true;
			}

			return false;
		}
	}

	window.Key = Key;

	window.Keyboard = {
		ESCAPE: "Escape",
		T: "t",
		W: "w",
		A: "a",
		S: "s",
		D: "d",
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