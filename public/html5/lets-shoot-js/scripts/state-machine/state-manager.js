"use strict";

{
	class StateMachine
	{
		constructor(owner = null)
		{
			this._owner = owner;

			this._currentState = null;
			this._currentIndex = -1;
			this._states = [];
			this._firstCall = false;
		}

		CurrentStateFirstCall()
		{
			return this._firstCall;
		}

		Add(state)
		{
			this._states.push(state);

			return this._states.length - 1;
		}

		SetFirst(index = 0)
		{
			this._firstCall = true;
			this._currentState = this._states[index];
			this._currentIndex = index;
		}

		EndCurrent(next)
		{
			this._currentState._isCompleted = true;
			this._currentState._nextState = next;
		}

		Update()
		{
			if (this._firstCall)
			{
				this._currentState.SetOwner(this._owner);
				this._currentState.Init();
				this._firstCall = false;
			}
			else
			{
				this._currentState.Run();
			}
			
			if (this._currentState._isCompleted)
			{
				this._currentState._isCompleted = false;
				this._currentState.Completed();

				this.SetCurrent(this._currentState._nextState);
			}
		}

		GetCurrentState()
		{
			return this._currentIndex;
		}

		Clean()
		{
			for (let i = 0; i < this._states.length; i++)
				this._states[i].Clean();

			this._currentState.Clean();
			
			this._currentState = null;
			this._states = null;
			this._owner = null;
		}

		SetCurrent(current)
		{
			this._firstCall = true;
			this._currentIndex = current;
			this._currentState = this._states[current];
		}
	}

	window.StateMachine = StateMachine;
}