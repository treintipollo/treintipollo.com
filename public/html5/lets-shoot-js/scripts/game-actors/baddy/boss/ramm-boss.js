"use strict";

{
	let ISRAMMING = false;

	class RammBoss extends State
	{
		constructor(stage, wrapTimesRange)
		{
			super(stage);
			
			this._currentShotPoint = 0;
			this._sameSpotShots = 0;
			this._wrapTimes = 0;
			this._maxWrapTimes = 0;
			this._wrapTimesRange = null;
			this._oldSpawnPos = null;
			this._smithereens = null;
			this._color = 0;

			this._currentShotPoint = 0;
			this._sameSpotShots = 0;
			this._wrapTimesRange = wrapTimesRange;
			
			ISRAMMING = false;
		}
		
		Init()
		{
			this._owner._originalColor.redMultiplier = 0.1;
			this._owner._originalColor.greenMultiplier = 0.9;
			this._owner._originalColor.blueMultiplier = 0.5;
			
			if (this._smithereens === null)
			{
				let red =  0xFF * this._owner._originalColor.redMultiplier;
				let green = 0xFF * this._owner._originalColor.greenMultiplier;
				let blue = 0xFF * this._owner._originalColor.blueMultiplier;
				let color = red << 16 | green << 8 | blue;
				
				this._color = 0xFF << 24 | color;
				
				this._smithereens = new BaddyParameters();
				this._smithereens.SetDrawParameters(1, color, 0xff000000);
				this._smithereens.SetSegmentParameters(new Point(1, 5), new Point(10, 15), 50);
				this._smithereens.SetOptions(true, true);
				this._smithereens.SetUpdateParameters(40, 2, 8, 1);
				this._smithereens.SetSound(false);
			}
		}
		
		Run()
		{
			let i;
			
			if (this._owner._currentMovement !== 666)
			{
				if (!this._owner._wasHitByBomb)
				{
					if (!this._owner._doFinalAttack)
					{
						switch(this._owner._currentMovement)
						{
							// Slow Movement
							case 0:
								if (this._owner._frameCounter % 15 === 0)
								{
									BaddyManager.SetType("StraightBullet");
							 		BaddyManager.SetStatsByName("BossBullet");
							 		BaddyManager.SetSpecificParams(null, this._owner._center);
							 		
									for (i = 0; i < this._owner._vertexCount; i++)
									{
							 			BaddyManager.Add(this._owner._attackPoint[i]);
									}

									BaddyManager.CleanForNextType();
								}
								break;
							// Corner Movement
							case 1:
								if (this._owner._isAttacking)
								{
									if (this._owner._frameCounter % 7 === 0)
									{
										BaddyManager.SetType("StraightBullet");
								 		BaddyManager.SetStatsByName("BossBullet");
								 		BaddyManager.SetSpecificParams(null, null);
										
					 					BaddyManager.Add(this._owner._attackPoint[this._currentShotPoint], this._owner._target);
										BaddyManager.CleanForNextType();
										
										if (this._currentShotPoint < this._owner._vertexCount - 1)
										{
											if (this._sameSpotShots < 3)
											{
												this._sameSpotShots++;
											}
											else
											{
												this._sameSpotShots = 0;
												this._currentShotPoint++;
											}
										}
										else
										{
											this._currentShotPoint = 0
										}
									}
								}
								break;
							// Special Attack
							default:
								this.SpecialAttack(2);
								break;
						}
					}
					else
					{
						// Spam stronger special attack
						this.SpecialAttack();
					}
				}
				else
				{
					ParticleSystemMessages.Send("boss-1", {
						x: this._owner._center.x,
						y: this._owner._center.y,
						radius: this._owner._starRadius,
						color: this._color
					});
				}
			}
			else
			{
				this.DeathAttack();
			}
		}
		
		Completed()
		{

		}
		
		CleanSpecific()
		{
			if (this._smithereens !== null)
			{
				this._smithereens.Clean();
				this._smithereens = null;
			}
		}
		
		static ResetStaticVariables()
		{
			ISRAMMING = false
		}
		
		DeathAttack()
		{
			ParticleSystemMessages.Send("boss-2", {
				x: this._owner._center.x,
				y: this._owner._center.y,
				radius: this._owner._starRadius,
				color: this._color
			});
			
			if (this._owner._frameCounter % 5 === 0)
			{
				BaddyManager.SetType("StraightBullet");
				BaddyManager.SetStatsByClass(this._smithereens, "RamBossSmithereen");
				BaddyManager.SetSpecificParams(null, this._owner._center);
				
				for (let i = 0; i < this._owner._vertexCount; i++)
				{
					BaddyManager.Add(this._owner._attackPoint[i], null, this._owner._center);
				}
				
				BaddyManager.CleanForNextType();
			}
		}
		
		SpecialAttack(wrapTimes = 0)
		{
			if (ISRAMMING)
			{
				this.Ram();
			}
			else
			{
				this.Charge(wrapTimes);
			}
		}
		
		Ram()
		{
			ParticleSystemMessages.Send("boss-3", {
				x: this._owner._center.x,
				y: this._owner._center.y,
				radius: this._owner._starRadius,
				color: this._color
			});
			
			// Actual movement
			this._owner._center.x += this._owner._moveVector.x;
			this._owner._center.y += this._owner._moveVector.y;
			
			if (this._wrapTimes < this._maxWrapTimes)
			{
				if (this.CheckBorders())
				{
					this._wrapTimes++;

					if (this._owner._doFinalAttack)
					{
						if (BaddyManager.GetBaddyCount() < 10)
						{
							BaddyManager.SetType("RammingBaddy");
							BaddyManager.SetStatsByName("RandomFillColor");
							BaddyManager.SetSpecificParams(new Point(10, 30));
							
				 			BaddyManager.Add(this._oldSpawnPos, this._owner._target, this._owner._center);
							BaddyManager.CleanForNextType();
							
							SoundManager.Play(Sounds.RAMM_BADDY);
						}
					}
				}
			}
			else
			{
				ISRAMMING = false;
			}
		}
		
		Charge(wrapTimes)
		{
			let rotationMultiplier;
			
			// Start rotating fast in a suspicious manner
			if (this._owner._rotationSpeed < this._owner._maxRotation)
			{
				// Adding 1 to avoid 0 as the initial value
				rotationMultiplier = NumberUtils.normalize(this._owner._rotationSpeed + 1, this._owner._rotationSpeedInit, this._owner._maxRotation);
				this._owner._rotationSpeed += rotationMultiplier;
			}
			else
			{
				this._owner._radius = this._owner._starRadius;
				ISRAMMING = true;
				this.SetMoveParams(wrapTimes);
			}
		}
		
		SetMoveParams(wrapTimes)
		{
			this._owner._tmpValues = VectorUtils.normalize(this._owner._target, this._owner._center, this._owner._maxSpeed);
			this._owner._moveVector = this._owner._tmpValues[0];
			this._owner._tmpValues = null;
			
			this._wrapTimes = 0;
			
			if (wrapTimes === 0)
			{
				this._maxWrapTimes = NumberUtils.randRange(this._wrapTimesRange.x, this._wrapTimesRange.y, true);
			}
			else
			{
				this._maxWrapTimes = wrapTimes;
			}
		}
		
		CheckBorders()
		{
			if (this._owner._center.x + this._owner._starRadius < -this._owner._starRadius)
			{
				this._oldSpawnPos = this._owner._center.clone();
				this._owner._center.x = this._stage.stageWidth + this._owner._starRadius;
				return true;
			}
			else if (this._owner._center.y + this._owner._starRadius < -this._owner._starRadius)
			{
				this._oldSpawnPos = this._owner._center.clone();
				this._owner._center.y = this._stage.stageHeight + this._owner._starRadius;
				return true;
			}
			else if (this._owner._center.x - this._owner._starRadius > this._stage.stageWidth + this._owner._starRadius)
			{
				this._oldSpawnPos = this._owner._center.clone();
				this._owner._center.x = -this._owner._starRadius;
				return true
			}
			else if (this._owner._center.y - this._owner._starRadius > this._stage.stageHeight + this._owner._starRadius)
			{
				this._oldSpawnPos = this._owner._center.clone();
				this._owner._center.y = -this._owner._starRadius;
				return true;
			}
			else
			{
				return false;
			}
		}
	}

	window.RammBoss = RammBoss;
}