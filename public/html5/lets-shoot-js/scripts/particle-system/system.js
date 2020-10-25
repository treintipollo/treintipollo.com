"use strict";

{
	class Base_System
	{
		constructor()
		{
			this._systemLife = 0;
			this._maxLife = 0;
			this._parentPos = null;
			this._resultPos = null;
			this._isEmitting = false;
			this._emitTime = null;
			this._onTimeInit = 0;
			this._offTimeInit = 0;

			this._isEmitting = true;
		}

		ProcessInitPos(x, y)
		{
			this._resultPos = new Point(x, y);
			
			return this._resultPos;
		}

		CheckLife()
		{
			if (this._systemLife !== -1)
			{
				if (this._systemLife > 0)
				{
					if (this._isEmitting)
					{
						this._systemLife--;
					}
				}
				else
				{
					return false;
				}
			}
			else
			{
				if (!this._parentPos.IsAlive())
				{
					return false;
				}
			}
			
			return true;
		}

		Emit()
		{
			if (this._isEmitting)
			{
				if (this._emitTime.x > 0)
				{
					this._emitTime.x--;
				}
				else
				{
				 	this._isEmitting = false;
				 	this._emitTime.x = this._onTimeInit;
				}
			}
			else
			{
				if (this._emitTime.y > 0)
				{
					this._emitTime.y--;
				}
				else
				{
				 	this._isEmitting = true;
				 	this._emitTime.y = this._offTimeInit;
				}
			}
			
			return this._isEmitting;
		}
		
		Clean()
		{
			this._resultPos = null;
			this._emitTime = null;
			this._parentPos = null;
			
			this.CleanSpecific();
		}
		
		CleanSpecific()
		{
		
		}
	}

	self.Base_System = Base_System;
}