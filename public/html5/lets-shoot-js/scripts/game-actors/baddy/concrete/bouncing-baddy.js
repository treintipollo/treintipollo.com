"use strict";
{
	class BouncingBaddy extends Baddy
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(stage, isGenerator, isHitable, isVisible, hasDeathSound);
			
			this._typeVertexCount = 4;
			
			this._moveVector = null;
			this._distanceToTarget = 0;
			this._tmpValues = null;
			
			this._currentBoost = 0;
			this._isBoosting = false;
			
			this._isLoosingSpeed = false;
			this._looseAmount = 0;
			this._looseSpeedRate = 0;
			
			this._waitBeforeBoost = 0;
			this._waitTime = 0;
			this._maxRotation = 0;
			this._isCharging = false;
			
			this._isInLimits = false;
		}

		static GetVertexCount()
		{
			return 4;
		}
		
		SpecificInit(specificProps)
		{
			this._waitBeforeBoost = specificProps[0];
			this._looseSpeedRate = specificProps[1];
			this._maxRotation = this._rotationSpeedInit * 5;
			
			this._isInLimits = this.CheckIfInLimits();
			// Making this function for the sake of cleaness.
			this.Reset();
		}
		
		SpecificMovement()
		{
			if (this._moveVector !== null)
			{
				if (this._isInLimits)
				{
					if (this.CheckScreenBorderCollision())
					{
						this._isLoosingSpeed = true;
					}
				}
				else
				{
					if (this._distanceToTarget > 0)
					{
						this._distanceToTarget -= this._currentBoost;
					}
					else
					{
						this._isInLimits = true;
					}
				}
				
				this._center.x += this._moveVector.x * this._currentBoost;
				this._center.y += this._moveVector.y * this._currentBoost;
			}
			
			// Happens initially, and later each time _currentBoost goes down to 1
			if (this._isBoosting)
			{
				// Actual Boost
				if (!this._isCharging)
				{
					this.Boost();
				}
				else
				{
					// Getting ready to boost!
					this.Charge();
				}
			}
			else
			{
				// Don't want to loose speed if I am currently boosting
				if (this._isLoosingSpeed)
				{
					this.LooseSpeed();
				}
			}
		}
		
		SpecificClean()
		{
			this._tmpValues = null;
			this._moveVector = null;
		}
		
		Reset()
		{
			this._isBoosting = true;
 			this._isCharging = true;
 			this._isLoosingSpeed = false;
 			this._looseAmount = 1;
 			this._currentBoost = 1;
 			this._rotationSpeed = this._rotationSpeedInit;
 			this._waitTime = 0;
		}
		
		CheckIfInLimits()
		{
			if ((this._center.x > this._radius * 2) && (this._center.x < this._stage.stageWidth-(this._radius * 2)))
			{
				if ((this._center.y > this._radius * 2) && (this._center.y < this._stage.stageHeight-(this._radius * 2)))
				{
					return true;
				}
			}
			
			return false;
		}
		
		CheckScreenBorderCollision()
		{
			if (this._center.x - this._radius - this._currentBoost <= 0)
			{
				this._moveVector.x *= -1;
				return true;
			}
			else if (this._center.y - this._radius - this._currentBoost <= 0)
			{
				this._moveVector.y *= -1;
				return true;
			}
			else if (this._center.x + this._radius + this._currentBoost >= this._stage.stageWidth)
			{
				this._moveVector.x *= -1;
				return true
			}
			else if (this._center.y + this._radius + this._currentBoost >= this._stage.stageHeight)
			{
				this._moveVector.y *= -1;
				return true;
			}
			else
			{
				return false;
			}
		}
		
		Boost()
		{
			let addBoost = NumberUtils.normalize(this._currentBoost, 0, this._maxSpeed);
			
			if (addBoost < 1)
			{
				this._currentBoost += addBoost;
			}
			else
			{
				this._isBoosting = false;
				this._currentBoost = this._maxSpeed;
			}
		}
		
		LooseSpeed()
		{
 			if (this._currentBoost > 1)
 			{
	 			let looseBoost = NumberUtils.normalize(this._currentBoost, 0, this._maxSpeed);
				
				if (looseBoost > this._looseAmount)
				{
					this._currentBoost -= looseBoost;
				}
				else
				{
					this._rotationSpeed -= this._maxRotation*this._looseSpeedRate;
					this._looseAmount -= this._looseSpeedRate;
					this._isLoosingSpeed = false;
				}
 			}
 			else
 			{
 				this.Reset();
 			}
		}
		
		CalcMoveVector()
		{
			this._tmpValues = VectorUtils.normalize(this._target, this._center);
			this._moveVector = this._tmpValues[0];
			this._distanceToTarget = this._tmpValues[1];
			this._tmpValues = null;
		}
		
		Charge()
		{
			let rotationMultiplier;
			
			// Wait for the perfect moment to attack
			if (this._waitTime <= this._waitBeforeBoost)
			{
				this._waitTime++;
			}
			else
			{
				// Start rotating fast in a suspicious manner
				if (this._rotationSpeed < this._maxRotation)
				{
					// Adding 1 to avoid 0 as the initial value
					rotationMultiplier = NumberUtils.normalize(this._rotationSpeed + 1, this._rotationSpeedInit, this._maxRotation);
					this._rotationSpeed += rotationMultiplier;
				}
				else
				{
					// Upon reaching max rotation speed, hang in there looking menacing
					// Note: By multiplying this._waitBeforeRam by 2 and not resetting to 0 this._waitTime, 
					// I avoid using a diferent set of variables for this counter. Pretty nifty.
					if (this._waitTime <= this._waitBeforeBoost * 2)
					{
						this._waitTime++;
					}
					else
					{
						// When time is up, change code flow to the actual boosting
						this._isCharging = false;
						// Doing this here so that the move vector is calculated at the last possible moment.
						// Getting target's best last position.
						this.CalcMoveVector();
					}
				}
			}
		}
	}

	window.BouncingBaddy = BouncingBaddy;
}