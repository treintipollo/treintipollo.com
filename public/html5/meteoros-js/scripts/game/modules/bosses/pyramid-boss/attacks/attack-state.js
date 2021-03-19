"use strict";

{
	class AttackState extends State
	{
		constructor(stage, owner)
		{
			super(stage, owner);
			
			this._particleSystemArgument = null;
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			this._owner._attackWaitTimer = 0;
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);
			
			this._particleSystemArgument = null;
		}
	}

	window.AttackState = AttackState;
}