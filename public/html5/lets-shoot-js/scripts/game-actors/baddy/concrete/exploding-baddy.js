"use strict";

{
	class ExplodingBaddy extends Baddy
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(stage, isGenerator, isHitable, isVisible, hasDeathSound);
			
			this._typeVertexCount = 5;
			
			this._isCharging = false;
			this._isFollowing = false;
			this._isBoosting = false;
			this._isLoosingBoost = false;
			this._isBursting = false;
			
			this._waitBeforeFollow = 0;
			this._waitTime = 0;
			
			this._moveVector = null;
			this._tmpValues = null;
			this._distanceToTarget = 0;
			
			this._maxRotation = 0;
			this._currentBoost = 0;
			this._boostRadius = 0;
			this._blastRadius = 0;
			
			this._angle = 0;
			this._angleVariation = 0;
			
			this._frameCounter = 0;
		}

		static GetVertexCount()
		{
			return 5;
		}
		
		SpecificInit(specificProps)
		{
			this.Reset();
			
			this._waitBeforeFollow = specificProps[0];
			this._angleVariation = 0.017 * specificProps[1];
			this._blastRadius = this._radius * 3;
			this._boostRadius = this._blastRadius * 5;
			this._maxRotation = this._rotationSpeedInit * 5;
			this._angle = 0;
			this._frameCounter = 0;
			
			this.Follow();
			
			this._center.x = this._pos.x + Math.cos(this._angleVariation) * this._radiusInit;
			this._center.y = this._pos.y + Math.sin(this._angleVariation) * this._radiusInit;
		}
		
		SpecificMovement()
		{
			if (!this._isBursting)
			{
				if (this._isCharging)
				{
					this.Charge();
				}
				else
				{
					if (this._isFollowing)
					{
						if (this._isBoosting)
						{
							if (!this._isLoosingBoost)
							{
								this.Boost();
							}
							else
							{
								this.LooseBoost();
							}
						}
						else
						{
							if (++this._frameCounter % 20 == 0)
							{
								this.Follow();
							}
						}
						
						if (!this._isBoosting)
						{
							this._angle += this._angleVariation;
						}
						this._pos.x += this._moveVector.x * this._currentBoost;
						this._pos.y += this._moveVector.y * this._currentBoost;
						
						this._center.x = this._pos.x + Math.cos(this._angle) * this._radiusInit;
						this._center.y = this._pos.y + Math.sin(this._angle) * this._radiusInit;
					}
				}
				
				if (VectorUtils.inRange(this._center, this._target, this._blastRadius))
				{
					this._isBursting = true;
					this._waitTime = 0;
					this._radius /= 2;
				}
			}
			else
			{
				this.Burst();
			}
		}
		
		SpecificClean()
		{
			this._moveVector = null;
			this._tmpValues = null;
		}
		
		Reset()
		{
			this._isCharging = true;
			this._isFollowing = true;
			this._isBoosting = false;
			this._isLoosingBoost = false;
			this._isBursting = false;
			this._currentBoost = 1;
			this._waitTime = 0;
			this._rotationSpeed = this._rotationSpeedInit;
		}
		
		Charge()
		{
			let rotationMultiplier;
			
			// Wait for the perfect moment to attack
			if (this._waitTime <= this._waitBeforeFollow)
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
					if (this._waitTime <= this._waitBeforeFollow * 2)
					{
						this._waitTime++;
					}
					else
					{
						// Moving to boost state
						this._isCharging = false;
						this._isFollowing = true;
						this._isBoosting = false;
						this._isLoosingBoost = false;
					}
				}
			}
		}
		
		Follow()
		{
			this._tmpValues = VectorUtils.normalize(this._target, this._pos);
			this._moveVector = this._tmpValues[0];
			this._tmpValues = null;
			
			// Checking if we are in range to go for a boost!
			if (VectorUtils.inRange(this._center, this._target, this._boostRadius))
			{
				this._isBoosting = true;
				this.CalcDistanceToTargetTimes(1);
			}
		}
		
		Burst()
		{
			let scaleModifier;
			
			if (this._radius < this._radiusInit)
			{
				this._radius++;
				scaleModifier = NumberUtils.normalize(this._radius, 0, this._radiusInit);
				this.scaleX = scaleModifier;
				this.scaleY = scaleModifier;
			}
			else
			{
				if (this._radius < this._blastRadius)
				{
					this._radius++;
					scaleModifier = NumberUtils.normalize(this._radius + 1, this._radiusInit, this._blastRadius);
					this.scaleX = scaleModifier * 4;
					this.scaleY = scaleModifier * 4;
				}
				else
				{
					this._life = 0;
				}
			}
		}
		
		Boost()
		{
			if (this._currentBoost !== this._maxSpeed)
			{
				let addBoost = NumberUtils.normalize(this._currentBoost, 0, this._maxSpeed);
				
				if (addBoost < 1)
				{
					this._currentBoost += addBoost;
				}
				else
				{
					this._currentBoost = this._maxSpeed;
				}
			}
			
			// Keep boosting until target is reached, only then start to slow down.
			if (this._distanceToTarget > 0)
			{
				this._distanceToTarget -= this._currentBoost;
			}
			else
			{
				this._isLoosingBoost = true;
			}
		}
		
		LooseBoost()
		{
			if (this._currentBoost > 1)
			{
	 			let looseBoost = NumberUtils.normalize(this._currentBoost, 0, this._maxSpeed);
				
				if (looseBoost > 0)
				{
					this._currentBoost -= looseBoost;
				}
			}
			else
			{
				// Rutine ends here, resetting al booleans to initial values.
				this.Reset();
			}
		}
		
		CalcDistanceToTargetTimes(value)
		{
			this._tmpValues = VectorUtils.calcDistance(this._target, this._center);
			this._distanceToTarget = this._tmpValues[2] * value;
			this._tmpValues = null;
		}
	}

	window.ExplodingBaddy = ExplodingBaddy;
}