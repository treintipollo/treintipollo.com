"use strict";

{
	const STOP_STATE = -1;
	
	class StateManager
	{
		constructor(owner = null)
		{
			this._currentState = null;
			this._currentIndex = 0;
			this._onSubState = false;
			this._interStateData = null;

			this._owner = owner;
			this._states = [];
		}

		static get STOP_STATE()
		{
			return STOP_STATE;
		}
		
		set SubState(value)
		{
			this._onSubState = value;
		}
		
		getCurrentStateInstance()
		{
			return this._currentState;
		}
		
		add(state)
		{
			this._states.push(state);
			this._states[this._states.length - 1].setStateMachine(this);
			this._states[this._states.length - 1]._stateIndex = this._states.length - 1;
			
			return this._states.length - 1;
		}
		
		setCurrent(stateIndex = 0, data = null)
		{
			if (this._currentState !== null)
			{
				this.endCurrent();
				
				if (data === null)
				{
					this._interStateData = this._currentState.getInterStateData();
				}
				else
				{
					this._interStateData = data;
				}
			}
			
			if (stateIndex !== -1)
			{
				this._currentState   = this._states[stateIndex];
				this._currentIndex   = stateIndex;
				this._currentState.init(this._interStateData);
			}
			else
			{
				this._currentState = null;
			}
			
			return this._currentState;
		}
		
		endCurrent()
		{
			if (this._onSubState)
			{
				this._currentState._subState.completed();
				this._onSubState = false;
			}
			
			this._currentState.completed();
		}
		
		wireStates(currentState, event, nextState)
		{
			if (nextState < 0 || nextState >= this._states.length)
				throw new Error("missing next state");
			
			this._states[currentState].doWiring(event, nextState);
		}
		
		update(deltaTime)
		{
			if (this._currentState !== null)
			{
				if (this._onSubState)
				{
					this._currentState._subState.run(deltaTime);
				}
				else
				{
					this._currentState.run(deltaTime);
				}
			}
		}
		
		clean()
		{
			for (let i = 0; i < this._states.length; i++)
			{
				this._states[i].clean();
				this._states[i] = null;
			}
			
			this._currentState.clean();
			this._currentState = null;
			
			this._states 		 = null;
			this._owner 		 = null;
			this._interStateData = null;
		}
	}

	window.StateManager = StateManager;
}