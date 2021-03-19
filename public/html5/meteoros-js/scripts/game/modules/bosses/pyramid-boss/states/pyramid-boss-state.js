"use strict";

{
	class PyramidBossState extends State
	{
		constructor(stage, owner)
		{
			super(stage, owner);
			
			this._nextRandomAttackId = 0;
			this._attackPattern = null;
			this._attackInitiated = false;
			this._externalParameters = null;
			this._attackCompletedCallback = null;
			this._on_attack_complete = (e) => this.onAttackComplete(e);
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			this._nextRandomAttackId = NumberUtils.randRange(0, this._owner._attacks.length - 1, true);
			this._externalParameters = this._owner.ExternalParameters;
			this._attackInitiated    = false;
			
			this._owner._moves	   		 = NumberUtils.randRange(1, this._owner._maxMovesBeforeAttack, true);
			this._owner._moving	   		 = false;
			this._owner._moveWaitTimer 	 = 0;
			this._owner._attackWaitTimer = 0;
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);
			
			if (this._attackPattern)
			{
				if (this._attackPattern.hasEventListener(State.COMPLETED))
				{
					this._attackPattern.removeEventListener(State.COMPLETED, this._on_attack_complete);
				}
			}
			
			this._attackPattern 		  = null;
			this._externalParameters 	  = null;
			this._attackCompletedCallback = null;
		}
		
		initiateAttack(onAttackCompleteCallback = null)
		{
			if (!this._attackInitiated)
			{
				this._attackPattern = this._owner._attackStateMachine.setCurrent(this._nextRandomAttackId);
				this._attackInitiated = true;
				
				if (onAttackCompleteCallback)
				{
					this._attackCompletedCallback = onAttackCompleteCallback;
				}
				
				this._attackPattern.addEventListener(State.COMPLETED, this._on_attack_complete);
				
				return true;
			}
			
			return false;
		}
	
		onAttackComplete(e)
		{
			e.target.removeEventListener(State.COMPLETED, this._on_attack_complete);
			
			if (this._attackCompletedCallback)
			{
				this._attackCompletedCallback();
			}
			
			this._attackInitiated = false;
		}
	}

	window.PyramidBossState = PyramidBossState;
}