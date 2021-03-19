"use strict";

{
	class UfoBaseInitialization
	{
		constructor(hp, moves, moveWaitTime, speed, attackWaitTime, heightLimit, actorManager)
		{
			this._hp 			= hp;
			this._moves 			= moves;
			this._moveWaitTime 	= moveWaitTime;
			this._speed 			= speed;
			this._attackWaitTime = attackWaitTime;
			this._heightLimit 	= heightLimit;
			this._actorManager 	= actorManager;
		}
		
		isDestroyable()
		{
			return true;
		}
		
		destroy()
		{
			this._actorManager = null;
		}
	}

	window.UfoBaseInitialization = UfoBaseInitialization;
}