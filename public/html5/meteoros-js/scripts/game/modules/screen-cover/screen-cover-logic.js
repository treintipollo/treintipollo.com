"use strict";

{
	class ScreenCoverLogic extends Logic
	{
		constructor()
		{
			super();
			
			this._actorManager = null;
			this._actorsToCollideAgainstIds = null;
			this._collideCount = 0;
			this._waitFrames = 0;

			this._actorsToCollideAgainst = new Array();
			this._particlePos			 = new Array();
		}
		
		childInit(params)
		{
			this._actorManager 		        = params[0];
			this._actorsToCollideAgainstIds = params[1];
			
			this._collideCount = 0;
			
			for (let i = 0; i < this._actorsToCollideAgainstIds.length; i++)
			{
				this._actorsToCollideAgainst = this._actorsToCollideAgainst.concat(this._actorManager.getModulesOfType(this._actorsToCollideAgainstIds[i]));
			}
			
			for (let j = 0; j < this._actorsToCollideAgainst.length; j++)
			{
				if (this._actorsToCollideAgainst[j]._active)
				{
					this._collideCount++;
					this._particlePos.push(new SharedPoint());
				}
			}
		}
		
		initComplete()
		{
			this._waitFrames = 10;
		}
		
		update(deltaTime)
		{
			if (this._waitFrames > 0)
			{
				this._waitFrames--;
			}
			else
			{
				this._parent.Active = false;
			}
		}
		
		concreteRelease()
		{
			this._actorManager 		        = null;
			this._actorsToCollideAgainstIds = null;
		}
		
		concreteDestroy()
		{
			this._actorsToCollideAgainst = null;
			CollectionUtils.nullVector(this._particlePos);
		}
		
		onCollide(opponent, deltaTime)
		{
			this._collideCount--;
			
			if (this._collideCount >= 0)
			{
				this._particlePos[this._collideCount].x = opponent._x;
				this._particlePos[this._collideCount].y = opponent._y;
				
				ParticleSystemManager.GetSystem("MissileExplosion", this._particlePos[this._collideCount]);
			}
		}
	}

	window.ScreenCoverLogic = ScreenCoverLogic;
}