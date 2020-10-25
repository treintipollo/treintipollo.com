"use strict";

{
	class ExplodingBullet extends Baddy
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(stage, isGenerator, isHitable, isVisible, hasDeathSound);
			
			this._isBomb = false;
			this._isSeeking = false;
			this._stopSeeking = false;
			
			this._moveVector = null;
			this._tmpValues = null;
			this._frameCounter = 0;
			
			this._messingTime = 0;
			this._stopSeekingRadius = 0;
			this._speedIncrease = 0;
			
			this._distanceToTarget = 0;
			this._explodeAmount = 0;
			this._explosionAngle = 0;

			this._typeVertexCount = 5;
		}

		static GetVertexCount()
		{
			return 5;
		}
		
		SpecificInit(specificProps)
		{
			this._isBomb = specificProps[0];
			this._messingTime = specificProps[1];
			this._explodeAmount = specificProps[2];
		
			this._stopSeeking = false;
			this._isSeeking = false;
			this._frameCounter = 0;
			this._stopSeekingRadius = 100;
			this._speedIncrease = 0;
			
			if (this._isBomb)
			{
				this._tmpValues = VectorUtils.normalize(this._target, this._center, this._maxSpeed);
			}
			else
			{
				this._tmpValues = VectorUtils.normalize(this._center, this._parentPos, this._maxSpeed);
			}
			
			this._moveVector = this._tmpValues[0];
			this._distanceToTarget = this._tmpValues[1] / 2;
			
			specificProps = null;
		}
		
		SpecificMovement()
		{
			let speed;
			
			if (this._isBomb)
			{
				if (this._distanceToTarget > 0)
				{
					this._distanceToTarget -= this._maxSpeed;
				}
				else
				{
					let shrapnelPos = new Point();
					let clockwise;
					
					if (this._frameCounter % 2 === 0)
					{
						clockwise = true;
					}
					else
					{
						clockwise = false;
					}
					
					this._life = 0;
			
					this._explosionAngle = (360 / this._explodeAmount) * (Math.PI / 180)
					
					BaddyManager.SetType("SpiralBullet");
			 		BaddyManager.SetStatsByName("BossBullet");
			 		BaddyManager.SetSpecificParams(3, 2, clockwise);
			 		
					for(let i = 0; i < this._explodeAmount; i++)
					{
						shrapnelPos.x = this._center.x + Math.cos(this._explosionAngle * i) * 5;
						shrapnelPos.y = this._center.y + Math.sin(this._explosionAngle * i) * 5;
						
			 			BaddyManager.Add(shrapnelPos, null, this._center.clone());
					}

					BaddyManager.CleanForNextType();
				}
			}
			else
			{
				if (!this._stopSeeking)
				{
					if (this._isSeeking)
					{
						if (!VectorUtils.inRange(this._center, this._target, this._stopSeekingRadius))
						{
							this._speedIncrease += 0.01;
							speed = NumberUtils.interpolate(this._speedIncrease, 0, this._maxSpeed);
							this._tmpValues = VectorUtils.normalize(this._target, this._center, speed);
							this._moveVector = this._tmpValues[0];
						}
						else
						{
							this._stopSeeking = true;
						}
						
						// Woobling motion.
						this._center.x += (Math.cos(this._frameCounter / 5));
						this._center.y += (-Math.sin(this._frameCounter / 5));
					}
					else
					{
						this._messingTime > 0 ? this._messingTime-- : this._isSeeking = true;
					}
				}
				else
				{
					const diameter = this._radius * 2;

					// Kill when off screen and not following player
					if (this._center.x + diameter >= 0 && this._center.x - diameter <= this._stage.stageWidth)
					{
						if (this._center.y + diameter >= 0 && this._center.y - diameter <= this._stage.stageHeight)
						{

						}
						else
						{
							this._life = 0;
						}
					}
					else
					{
						this._life = 0;
					}
				}
			}
			
			if (this._moveVector != null)
			{
				this._center.x += this._moveVector.x;
				this._center.y += this._moveVector.y;
			}
		
			this._frameCounter++;
		}
		
		SpecificClean()
		{
			this._moveVector = null;
			this._tmpValues = null;
		}
	}

	window.ExplodingBullet = ExplodingBullet;
}