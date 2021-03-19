"use strict"

{
	const SUB_STATE = "SubState";
	const MAIN_STATE = "MainState";
	const COMPLETED = "Completed";

	const Event = GameEvent;

	class State extends EventDispatcher
	{
		constructor(stage, owner)
		{
			super();

			this._stateIndex = 0;
			this._subState = null;
			
			this._stage = null;
			this._owner = null;
			this._readyToExit = false;
			this._interStateConnection = null;
			
			this._stateMachine = null;
			this._wire = null;
			this._completed = false;
			
			this._completedEvent = null;
			
			this._stage = stage;
			this._owner = owner;
			this._wire  = [];
			
			this._wireCallbacks = new Map();
			this._on_sub_state = (e) => this.onSubState(e);
			this._on_main_state = (e) => this.onMainState(e);

			this._completedEvent = new Event(COMPLETED);
		}

		static get SUB_STATE()
		{
			return SUB_STATE;
		}

		static get MAIN_STATE()
		{
			return MAIN_STATE;
		}

		static get COMPLETED()
		{
			return COMPLETED;
		}
		
		setStateMachine(stateMachine)
		{
			this._stateMachine = stateMachine;
		}
		
		setSubState(subState)
		{
			this._subState = new subState(this._stage, this);
			this._subState.setStateMachine(this._stateMachine);
		}
		
		getInterStateData()
		{
			return this._interStateConnection;
		}
		
		stop()
		{
			if (!this._completed)
			{
				this._stateMachine.setCurrent(-1);
			}
			
			this._completed = true;
		}
		
		doWiring(event, nextState)
		{
			this._wire.push(new Wire(event, nextState));
		}
		
		init(interStateConnection)
		{
			this.addListeners();

			this._completed = false;
			this._readyToExit = false;
		}
		
		run(deltaTime)
		{

		}
		
		completed(dispatchCompletedEvent)
		{
			this.removeListeners();
			
			if (dispatchCompletedEvent)
				this.dispatchEvent(this._completedEvent);
		}
		
		clean()
		{
			this.completed(false);
			
			if (this._subState !== null)
				this._subState.clean();
			
			this._completedEvent = null;
			this._subState 		 = null;
			this._stage 		 = null;
			this._owner 		 = null;
			this._stateMachine	 = null;
		}
		
		backFromSubState(interStateConnection)
		{

		}
		
		toSubState()
		{

		}
		
		addListeners()
		{
			for (let i = 0; i < this._wire.length; i++)
			{
				const wire = this._wire[i];
				const event = this._wire[i]._event;

				if (!this.hasEventListener(event))
				{
					const callback = Callback.create((e, nextState) =>
					{
						this.done(e, nextState);
					}, wire._nextState);

					this._wireCallbacks.set(event, callback);

					this.addEventListener(event, callback);
				}
			}
			
			if (this._subState)
			{
				if (!this.hasEventListener(SUB_STATE))
					this.addEventListener(SUB_STATE, this._on_sub_state);

				if (!this.hasEventListener(MAIN_STATE))
					this.addEventListener(MAIN_STATE, this._on_main_state);
			}
		}
		
		removeListeners()
		{
			for (let i = 0; i < this._wire.length; i++)
			{
				const wire = this._wire[i];
				const event = this._wire[i]._event;

				if (this.hasEventListener(event))
					this.removeEventListener(event, this._wireCallbacks.get(event));
			}
			
			if (this.hasEventListener(SUB_STATE))
				this.removeEventListener(SUB_STATE, this._on_sub_state);

			if (this.hasEventListener(MAIN_STATE))
				this.removeEventListener(MAIN_STATE, this._on_main_state);
		}
		
		done(e, nextState)
		{
			if (nextState !== this._stateIndex)
			{
				if (!this._completed)
				{
					this._stateMachine.setCurrent(nextState);
				}
				
				this._completed = true;
			}
			else
			{
				this.completed();
				this.init(this._interStateConnection);
			}
		}
		
		onSubState(e)
		{
			this.toSubState();

			this._subState.init(this._interStateConnection);
			this._stateMachine.SubState = true;
		}
		
		onMainState(e)
		{
			this._subState.completed();

			this.backFromSubState(this._subState._interStateConnection);
			this._stateMachine.SubState = false;
			this.addListeners();
		}
	}

	window.State = State;
}