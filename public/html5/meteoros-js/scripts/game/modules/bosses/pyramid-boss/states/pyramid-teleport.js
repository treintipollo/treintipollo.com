"use strict";

{
	const Event = GameEvent;
	
	class PyramidTeleport extends PyramidBossState
	{
		constructor(stage, owner)
		{
			super(stage, owner);

			this._on_attack_complete = () => this.onAttackCompleted();
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			this._externalParameters["shielding"] = true;
			this._externalParameters["active"] 	= true;
		}
		
		run(deltaTime)
		{
			if (!this._owner._moving)
			{
				if (this._owner._moves !== -1)
				{
					if (this._owner.ScaleX < 1)
					{
						this._owner.ScaleX += this._owner._vanishingSpeed * deltaTime;
					}
					else
					{
						this._owner.ScaleX 				   = 1;
						this._externalParameters["active"] = true;
						
						if (this._owner._moveWaitTimer <= this._owner._moveWaitTime)
						{
							this._owner._moveWaitTimer += deltaTime;
						}
						else
						{
							this._owner._moving = true;
							this._owner._moves--;
							this._owner._nextPos.x = NumberUtils.randRange((this._owner.getParent().Collider)._shieldRadius * 2, (this._stage.stageWidth - (this._owner.getParent().Collider)._shieldRadius * 2));
							this._owner._nextPos.y = NumberUtils.randRange((this._owner.getParent().Collider)._shieldRadius * 2, this._owner._hightLimit);
						}
					}
				}
				else
				{
					if (this._owner.ScaleX < 1)
					{
						this._owner.ScaleX += this._owner._vanishingSpeed * deltaTime;
					}
					else
					{
						this._owner.ScaleX 				   = 1;
						this._externalParameters["active"] = true;
						
						this._owner._nextPos.x = -9001;
						this._owner._nextPos.y = -9001;

						this.initiateAttack(this._on_attack_complete);
					}
				}
			}
			else
			{
				if (this._owner.ScaleX > 0)
				{
					this._externalParameters["active"] = false;
					this._owner.ScaleX 				   -= this._owner._vanishingSpeed * deltaTime;
				}
				else
				{
					if (this._owner._moves === 0)
					{
						this._owner._moves = -1;
					}
					
					this._owner.Rotation 	     = 0;
					this._owner._x			     = this._owner._nextPos.x;
					this._owner._y 			     = this._owner._nextPos.y;
					this._owner._moving 		 = false;
					this._owner._moveWaitTimer   = 0;
					this._owner._attackWaitTimer = 0;
				}
			}
		}
		
		onAttackCompleted()
		{
			const movement = NumberUtils.randRange(0, this._owner._movements.length - 1, true);

			this.dispatchEvent(new Event(this._owner._movements[movement]));
		}
	}

	window.PyramidTeleport = PyramidTeleport;
}