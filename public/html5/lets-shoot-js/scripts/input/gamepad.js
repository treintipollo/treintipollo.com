"use strict";

{
	let leftThumbStick = null;
	let rigthThumbStick = null;

	let leftDigitalShoulderButton = null;
	let rightDigitalShoulderButton = null;

	let leftDigitalUpButton = null;
	let leftDigitalRightButton = null;
	let leftDigitalDownButton = null;
	let leftDigitalLeftButton = null;

	let rightDigitalUpButton = null;
	let rightDigitalRightButton = null;
	let rightDigitalDownButton = null;
	let rightDigitalLeftButton = null;

	let gamepad = null;

	const GAME_PAD_INDEX = 0;

	class Gamepad
	{
		static Initialize()
		{
			gamepad = null;

			window.addEventListener("gamepadconnected", (e) =>
			{
				if (e.gamepad.index !== GAME_PAD_INDEX)
					return;

				gamepad = e.gamepad;

				this.OnGameInputDeviceAdded(e.gamepad);
			});

			window.addEventListener("gamepaddisconnected", (e) =>
			{
				if (e.gamepad.index !== GAME_PAD_INDEX)
					return;

				this.OnGameInputDeviceRemoved(e.gamepad);
			});
		}

		static Update()
		{
			if (gamepad && !gamepad.connected)
				this.OnGameInputDeviceRemoved();

			if (!gamepad)
				return;

			const gp = navigator.getGamepads()[GAME_PAD_INDEX];

			if (leftThumbStick)
				leftThumbStick.Update(gp);
			
			if (rigthThumbStick)
				rigthThumbStick.Update(gp);

			if (leftDigitalShoulderButton)
				leftDigitalShoulderButton.Update(gp);
			
			if (rightDigitalShoulderButton)
				rightDigitalShoulderButton.Update(gp);

			if (leftDigitalUpButton)
				leftDigitalUpButton.Update(gp);
			
			if (leftDigitalRightButton)
				leftDigitalRightButton.Update(gp);
			
			if (leftDigitalDownButton)
				leftDigitalDownButton.Update(gp);
			
			if (leftDigitalLeftButton)
				leftDigitalLeftButton.Update(gp);

			if (rightDigitalUpButton)
				rightDigitalUpButton.Update(gp);
			
			if (rightDigitalRightButton)
				rightDigitalRightButton.Update(gp);
			
			if (rightDigitalDownButton)
				rightDigitalDownButton.Update(gp);
			
			if (rightDigitalLeftButton)
				rightDigitalLeftButton.Update(gp);
		}

		static Available()
		{
			return leftThumbStick && rigthThumbStick;
		}

		static GetLeftThumbStick()
		{
			return leftThumbStick;
		}

		static GetRigthThumbStick()
		{
			return rigthThumbStick;
		}

		static GetLeftDigitalShoulderButton()
		{
			return leftDigitalShoulderButton;
		}

		static GetRightDigitalShoulderButton()
		{
			return rightDigitalShoulderButton;
		}

		static GetLeftDigitalUpButton()
		{
			return leftDigitalUpButton;
		}

		static GetLeftDigitalRightButton()
		{
			return leftDigitalRightButton;
		}

		static GetLeftDigitalDownButton()
		{
			return leftDigitalDownButton;
		}

		static GetLeftDigitalLeftButton()
		{
			return leftDigitalLeftButton;
		}

		static GetRightDigitalUpButton()
		{
			return rightDigitalUpButton;
		}

		static GetRightDigitalRightButton()
		{
			return rightDigitalRightButton;
		}

		static GetRightDigitalDownButton()
		{
			return rightDigitalDownButton;
		}

		static GetRightDigitalLeftButton()
		{
			return rightDigitalLeftButton;
		}

		static OnGameInputDeviceAdded(gp)
		{
			if (gp.mapping === "standard")
			{
				leftThumbStick = new GamepadThumbStick(0, 1);
				rigthThumbStick = new GamepadThumbStick(2, 3);

				leftDigitalShoulderButton = new GamepadButton(4);
				rightDigitalShoulderButton = new GamepadButton(5);

				leftDigitalUpButton = new GamepadButton(12);
				leftDigitalRightButton = new GamepadButton(14);
				leftDigitalDownButton = new GamepadButton(13);
				leftDigitalLeftButton = new GamepadButton(15);

				rightDigitalUpButton = new GamepadButton(3);
				rightDigitalRightButton = new GamepadButton(2);
				rightDigitalDownButton = new GamepadButton(0);
				rightDigitalLeftButton = new GamepadButton(1);
			}
		}

		static OnGameInputDeviceRemoved(gp)
		{
			if (leftThumbStick)
				leftThumbStick.Release();
			
			leftThumbStick = null;

			if (rigthThumbStick)
				rigthThumbStick.Release();

			rigthThumbStick = null;

			if (leftDigitalShoulderButton)
				leftDigitalShoulderButton.Release();

			leftDigitalShoulderButton = null;

			if (rightDigitalShoulderButton)
				rightDigitalShoulderButton.Release();

			rightDigitalShoulderButton = null;

			if (leftDigitalUpButton)
				leftDigitalUpButton.Release();

			leftDigitalUpButton = null;

			if (leftDigitalRightButton)
				leftDigitalRightButton.Release();

			leftDigitalRightButton = null;

			if (leftDigitalDownButton)
				leftDigitalDownButton.Release();

			leftDigitalDownButton = null;

			if (leftDigitalLeftButton)
				leftDigitalLeftButton.Release();

			leftDigitalLeftButton = null;

			if (rightDigitalUpButton)
				rightDigitalUpButton.Release();

			rightDigitalUpButton = null;

			if (rightDigitalRightButton)
				rightDigitalRightButton.Release();

			rightDigitalRightButton = null;

			if (rightDigitalDownButton)
				rightDigitalDownButton.Release();

			rightDigitalDownButton = null;

			if (rightDigitalLeftButton)
				rightDigitalLeftButton.Release();

			rightDigitalLeftButton = null;

			gamepad = null;
		}
	}

	window.Gamepad = Gamepad;

	const ORIGIN = new Point();

	class GamepadThumbStick
	{
		constructor(xAxisIndex, yAxisIndex)
		{
			this._axis = new Point();

			this._neutral = true;
			this._angle = 0;

			this._xAxisIndex = xAxisIndex;
			this._yAxisIndex = yAxisIndex;
		}

		Release()
		{
			this._axis = null;
		}

		IsNeutral()
		{
			return this._neutral;
		}

		GetAngle()
		{
			return this._angle;
		}

		GetHorizontal()
		{
			return this._axis.x;
		}

		GetVertical()
		{
			return this._axis.y;
		}

		Update(gamepad)
		{
			this._axis.x = gamepad.axes[this._xAxisIndex];
			this._axis.y = gamepad.axes[this._yAxisIndex];

			const l = VectorUtils.distance(ORIGIN, this._axis);

			if (l < 0.25)
			{
				this._axis.x = 0;
				this._axis.y = 0;

				this._neutral = true;
			}
			else
			{
				this._axis.normalize(1);

				this._axis.x = this._axis.x * ((l - 0.25) / (1 - 0.25));
				this._axis.y = this._axis.y * ((l - 0.25) / (1 - 0.25));

				this._angle = Math.atan2(this._axis.y, this._axis.x);

				this._neutral = false;
			}
		}
	}

	class GamepadButton
	{
		constructor(buttonIndex)
		{
			this._buttonIndex = buttonIndex;
			this._isDown = false;
		}

		Release()
		{
			
		}

		Update(gamepad)
		{
			this._isDown = gamepad.buttons[this._buttonIndex].value > 0;
		}

		IsDown()
		{
			return this._isDown;
		}
	}
}

