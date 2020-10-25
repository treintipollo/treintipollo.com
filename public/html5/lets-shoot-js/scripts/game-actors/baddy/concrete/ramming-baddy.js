"use strict"

{
	class RammingBaddy extends Baddy
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(stage, isGenerator, isHitable, isVisible, hasDeathSound);
			
			this._typeVertexCount = 3;

			this._moveVector = null;
			this._distanceToTarget = 0;
			this._tmpValues = null;
			
			this._waitBeforeRam = 0;
			this._waitTime = 0;
			
			this._isRamming = false;
			this._isCharging = false;
			
			this._speedMultiplier = 0;
			this._slowDownDistance = 0;
			this._maxSlowDownDistance = 0;
			
			this._maxRotation = 0;
		}

		static GetVertexCount()
		{
			return 3;
		}
		
		SpecificInit(specificProps)
		{
			this._waitBeforeRam = NumberUtils.randRange(specificProps[0].x, specificProps[0].y, true);
			this._maxRotation = this._rotationSpeedInit * 10;
			
			this._isRamming = false;
			this._isCharging = false;
			
			this._waitTime = 0;
		}
		
		SpecificMovement()
		{
			if (this._isRamming)
			{
				this.Ram();
			}
			else
			{
				if (this._isCharging)
				{
					this.Charge();
				}
				else
				{
					this.SlowDown();
				}
			}
		}
		
		SpecificClean()
		{
			this._moveVector = null;
			this._tmpValues = null;
		}
		
		Charge()
		{
			let rotationMultiplier;
			
			// Wait for the perfect moment to attack
			if (this._waitTime <= this._waitBeforeRam)
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
					// Note: By multiplying _waitBeforeRam by 2 and not resetting to 0 _waitTime, 
					// I avoid using a diferent set of variables for this counter. Pretty nifty.
					if (this._waitTime <= this._waitBeforeRam * 2)
					{
						this._waitTime++;
					}
					else
					{
						// When time is up, change code flow to the actual ramming
						this._isRamming = true;
						this.SetMoveParams();
					}
				}
			}
		}
		
		Ram()
		{
			let actualSpeed = this._maxSpeed *this._speedMultiplier;
			
			// Actual movement
			this._center.x += this._moveVector.x * actualSpeed;
			this._center.y += this._moveVector.y * actualSpeed;
			
			// Ram
			if (this._distanceToTarget >= 0)
			{
				// Substracting speed from distance lets us know how much has been traversed
				this._distanceToTarget -= actualSpeed;
			}
			else
			{
				// Slow down
				if (this._slowDownDistance >= 1)
				{
					// Once again interpolation saves the day!
					// The value that comes out of this operation is used to multiply the speed.
					// Initially it will be 1 or close to 1, as the loop goes by it will go closer and closer to 0.
					this._slowDownDistance -= actualSpeed;
					this._speedMultiplier = NumberUtils.normalize(this._slowDownDistance, 0, this._maxSlowDownDistance);
				}
				else
				{
					// Braking distance is complete, we can resume the patern from the begening now
					this._isRamming = false;
					this._isCharging = false;
				}
			}
		}
		
		SlowDown()
		{
			let rotationMultiplier;
			
			// In the same way as for the increase in the rotation speed, adding 1 here to avoid infinity
			if (this._rotationSpeed > this._rotationSpeedInit + 1)
			{
				rotationMultiplier = NumberUtils.normalize(this._rotationSpeed, this._rotationSpeedInit, this._maxRotation);
				this._rotationSpeed -= rotationMultiplier;
			}
			else
			{
				this._isCharging = true;
			}
		}
		
		SetMoveParams()
		{
			this._tmpValues = VectorUtils.normalize(this._target, this._center);
			this._moveVector = this._tmpValues[0];
			this._distanceToTarget = this._tmpValues[1];
			this._slowDownDistance = this._distanceToTarget / 2;
			this._maxSlowDownDistance = this._slowDownDistance;
			
			this._tmpValues = null;
			
			// Some variable resetting. This just happens to be a good place for these
			this._speedMultiplier = 1;
			this._waitTime = 0;
		}
	}

	window.RammingBaddy = RammingBaddy;
}