"use strict";

{
	let INTRO_STATE = NaN;
	let OUTRO_STATE = NaN;
	let PAUSE_STATE = NaN;
	let QUIT_PRESSED = NaN;

	class SubMainGame extends GameSate
	{
		constructor(stage, owner)
		{
			super(stage, owner);
			
			this._nextSubState = null;
			
			this._subMainStateMachine = new StateManager(this._owner);
			
			const intro = new Intro(stage, this._owner);
			const outro = new Outro(stage, this._owner);
			const pause = new Pause(stage, this._owner);
			
			intro.MousePointer = MousePointerInitializaer.CROSSHAIR_POINTER;
			outro.MousePointer = MousePointerInitializaer.CROSSHAIR_POINTER;
			pause.MousePointer = MousePointerInitializaer.ARROW_POINTER;
			
			intro.BGM = -1;
			outro.BGM = -1;
			pause.BGM = Sounds.SPLASH_BGM;
			
			INTRO_STATE = this._subMainStateMachine.add(intro);
			OUTRO_STATE = this._subMainStateMachine.add(outro);
			PAUSE_STATE = this._subMainStateMachine.add(pause);
			
			QUIT_PRESSED = 9000;
		}

		static get INTRO_STATE()
		{
			return INTRO_STATE;
		}

		static get OUTRO_STATE()
		{
			return OUTRO_STATE;
		}

		static get PAUSE_STATE()
		{
			return PAUSE_STATE;
		}

		static get QUIT_PRESSED()
		{
			return QUIT_PRESSED;
		}
		
		init(interStateConnection)
		{
			this._interStateConnection = interStateConnection;
			this._subMainStateMachine.setCurrent(interStateConnection["SubStateIndex"], this._interStateConnection);
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);
			
			this._subMainStateMachine.endCurrent();
		}
		
		run(deltaTime)
		{
			this._subMainStateMachine.update(deltaTime);
		}
	}

	window.SubMainGame = SubMainGame;
}