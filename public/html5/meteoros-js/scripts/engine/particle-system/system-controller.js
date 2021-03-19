"use strict";

{
	class SystemController
	{
		constructor(system)
		{
			this._system = system;

			this._pos = null;
			this._life = 0;
			this._maxLife = 0;
			this._clear = false;
			this._rotation = 0;
			this._stop = false;
		}
		
		canProduceParticles()
		{
			return this._pos && this._pos.IsAlive() && !this._clear;
		}
		
		clean()
		{
			this._pos = null;
		}
		
		destroy()
		{
			this._pos = null;
			this._system = null;
		}

		get system()
		{
			return this._system;
		}
	}

	window.SystemController = SystemController;
}