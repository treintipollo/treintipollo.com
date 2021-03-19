"use strict";

{
	const Event = GameEvent;

	class PyramidScroll extends PyramidBossState
	{
		constructor(stage, owner)
		{
			super(stage, owner);

			this._distance = 0;
			this._justStarted = false;
			this._enteredAttackRange = false;

			this._dirInfo 	  = [new Point(), 0];
			this._attackRange = new Point();
			this._lastDir	  = new Point();

			this._on_attack_complete = () => this.onAttackComplete();
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			let raiseShield = false;
			
			if (interStateConnection)
			{
				raiseShield = interStateConnection["Shielding"];
			}
			
			this._externalParameters["shielding"] = raiseShield;
			this._externalParameters["active"] 	= true;
			
			this.setNextPos(this._owner._y, true);
		}
		
		run(deltaTime)
		{
			if (!this._owner._moving)
			{
				if (this._owner._moveWaitTimer <= this._owner._moveWaitTime)
				{
					this._owner._moveWaitTimer += deltaTime;
				}
				else
				{
					this._owner._moves--;
					
					this.setNextPos(NumberUtils.randRange(this._owner.getParent().Collider._shieldRadius * 2, this._owner._hightLimit), false);
				}
			}
			else
			{
				if (this._distance > 0)
				{
					if (!this._owner._hitTaken)
					{
						if (this.inAttackRange() && !this._justStarted && !this._enteredAttackRange)
						{
							this._enteredAttackRange = true;
							this._lastDir.x    = this._dirInfo[0].x;
							this._lastDir.y    = this._dirInfo[0].y;
							this._dirInfo[0].x = 0;
							this._dirInfo[0].y = 0;
							
							this.initiateAttack(this._on_attack_complete);
						}
						
						if (this._dirInfo[0].x !== 0)
						{
							this._distance -= this._owner._speed * deltaTime;
							this._owner._x += this._dirInfo[0].x * deltaTime;
						}
					}
				}
				else
				{
					this._dirInfo[0].x = 0;
					this._dirInfo[0].y = 0;
					
					if (this._owner._moves === 0)
					{
						this.dispatchEvent(new Event(this._owner._movements[NumberUtils.randRange(0, this._owner._movements.length - 1, true)]));
					}
					else
					{
						this._owner._moving 		 = false;
						this._owner._moveWaitTimer 	 = 0;
					}
				}
			}
		}
		
		clean()
		{
			super.clean();
			
			CollectionUtils.nullVector(this._dirInfo);
			
			this._attackRange = null;
			this._lastDir	  = null;
		}
		
		setNextPos(height, firstMove)
		{
			this._justStarted = firstMove;
			
			if (!firstMove)
			{
				this._externalParameters["shielding"] = false;
				this._owner.Rotation = 0;
			}
			
			this._owner._moving      = true;
			this._enteredAttackRange = false;
			this._nextRandomAttackId = NumberUtils.randRange(0, this._owner._attacks.length - 1, true);
			
			if (this._owner._x < 0)
			{
				this._owner._nextPos.x = (this._owner.getParent().Collider)._shieldRadius * 2 + this._stage.stageWidth;
			}
			else if (this._owner._x > (this._owner.getParent().Collider)._shieldRadius * 2 + this._stage.stageWidth)
			{
				this._owner._nextPos.x = -(this._owner.getParent().Collider)._shieldRadius * 2;
			}
			else
			{
				if (this._owner._x < this._stage.stageWidth / 2)
				{
					this._owner._nextPos.x = -(this._owner.getParent().Collider)._shieldRadius * 2;
				}
				else
				{
					this._owner._nextPos.x = (this._owner.getParent().Collider)._shieldRadius * 2 + this._stage.stageWidth;
				}
			}
			
			this._owner._y  	  = height;
			this._owner._nextPos.y = this._owner._y;
			
			this._dirInfo   = VectorUtils.normalizeXY(this._owner._nextPos.x, this._owner._nextPos.y, this._owner._x, this._owner._y, this._dirInfo, this._owner._speed);
			this._distance  = this._dirInfo[1];
			
			this._attackRange.x = NumberUtils.randRange((this._owner.getParent().Collider)._shieldRadius * 4, this._stage.stageWidth / 2);
			this._attackRange.y = NumberUtils.randRange(this._stage.stageWidth / 2, this._stage.stageWidth - (this._owner.getParent().Collider)._shieldRadius * 4);
		}
		
		inAttackRange()
		{
			return (this._owner._x > this._attackRange.x && this._owner._x < this._attackRange.y);
		}
		
		onAttackComplete()
		{
			this._dirInfo[0].x = this._lastDir.x;
			this._dirInfo[0].y = this._lastDir.y;
		}
	}

	window.PyramidScroll = PyramidScroll;
}