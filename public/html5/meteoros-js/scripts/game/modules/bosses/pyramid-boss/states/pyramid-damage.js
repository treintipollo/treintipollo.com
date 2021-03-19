"use strict";

{
	const Event = GameEvent;

	class PyramidDamage extends PyramidBossState
	{
		constructor(stage, owner)
		{
			super(stage, owner);
			
			this._damageTime = 0;
			this._damageTimer = 0;
			this._damageAngle = 0;
			this._damageDirX = 0;
			this._damageDirY = 0;
			this._initX = 0;
			this._initY = 0;
			this._exit = false;
			this._rotationAmount = 0;

			this._damageTime = 4;
			this._interStateConnection = new Object();
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			this._externalParameters["shielding"] = false;
			this._externalParameters["active"] = false;
			
			this._damageTimer = 0;
			this._exit		  = true;
			this._initX 	  = this._owner._x;
			this._initY 	  = this._owner._y;
			
			this._owner._hitTaken = false;
			
			this._damageAngle = NumberUtils.randRange(120, 60, true) * NumberUtils.TO_RADIAN;
			this._damageDirX  = Math.cos(this._damageAngle) * 50;
			this._damageDirY  = Math.sin(this._damageAngle) * 50;
			
			this._rotationAmount = NumberUtils.randRange(10, 20, true);
		}
		
		run(deltaTime)
		{
			if (this._damageTimer < this._damageTime)
			{
				this._damageTimer += deltaTime * 5;

				this._owner._x = this._initX + (this._damageDirX * this._damageTimer);
				this._owner._y = this._initY - (this._damageDirY * this._damageTimer) + (9.8 * 0.5 * this._damageTimer * this._damageTimer);
				
				this._owner.Rotation += this._rotationAmount;
			}
			else
			{
				this._externalParameters["shielding"] = true;
				this._externalParameters["active"] 	= true;
				
				if (this._owner._attackWaitTimer <= this._owner._attackWaitTime / 5)
				{
					this._owner._attackWaitTimer += deltaTime;
				}
				else
				{
					if (this._exit)
					{
						this._exit = false;
						this._interStateConnection["Shielding"] = true;
						
						this.dispatchEvent(new Event(PyramidBossLogic.TO_TELEPORT_MOTION));
					}
				}
			}
		}
	}

	window.PyramidDamage = PyramidDamage;
}