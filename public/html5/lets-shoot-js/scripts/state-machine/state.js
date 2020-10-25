"use strict";

{
	class State
	{
		constructor(stage)
		{
			this._stage = stage;
			this._isCompleted = false;
			
			this._nextState = -1;
			this._owner = null;
		}

		SetOwner(owner = null)
		{
			this._owner = owner;
		}

		Init()
		{
			// Override
		}

		Run()
		{
			// Override
		}

		Completed()
		{
			// Override
		}

		Clean()
		{
			this._stage = null;
			this._owner = null;
			
			this.CleanSpecific();
		}

		CleanSpecific()
		{
			// Override
		}
	}
	
	window.State = State;
}