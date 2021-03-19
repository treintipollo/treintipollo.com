"use strict"

{
	class Wire
	{
		constructor(event, nextState)
		{
			this._nextState = nextState;
			this._event = event;
		}
	}

	window.Wire = Wire;
}

