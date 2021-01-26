"use strict";

{
	let ISCHARGING = false;

	class BounceBoss extends State
	{
		constructor(stage, boostRange)
		{
			super(stage);
			
			this._currentShotPoint = 0;
			this._shotGunPellets = 0;
			
			this._boostRange = null;
			this._currentBoost = 0;
			
			this._smithereens = null;
			this._color = 0;

			this._currentShotPoint = 0;
			this._shotGunPellets = 10;
			
			this._boostRange = boostRange;
			
			ISCHARGING = true;
		}
		
		Init()
		{
			this._owner._originalColor.redMultiplier = 0.1;
			this._owner._originalColor.greenMultiplier = 0.5;
			this._owner._originalColor.blueMultiplier = 0.8;
			
			if (this._smithereens == null)
			{
				let red = 0xFF * this._owner._originalColor.redMultiplier;
				let green = 0xFF * this._owner._originalColor.greenMultiplier;
				let blue = 0xFF * this._owner._originalColor.blueMultiplier;
				let color = red << 16 | green << 8  | blue;
				
				this._color = 0xFF << 24 | color;
				
				this._smithereens = new BaddyParameters();
				this._smithereens.SetDrawParameters(1, color, 0xff000000);
				this._smithereens.SetSegmentParameters(new Point(1, 5), new Point(10, 15), 50);
				
				if (DifficultySelect._difficulty === DifficultySelect.HARD)
				{
					this._smithereens.SetOptions(false, true);
					this._smithereens.SetUpdateParameters(12, 2, 8, 300);
				}
				else
				{
					this._smithereens.SetOptions(true, true);
					this._smithereens.SetUpdateParameters(12, 2, 8, 1);
				}


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
						switch (this._owner._currentMovement)
						{
							//Slow Movement
							case 0:
								if (this._owner._frameCounter % 40 == 0)
								{
									BaddyManager.SetType("ShotgunBullet");
							 		BaddyManager.SetStatsByName("BossBullet");
							 		BaddyManager.SetSpecificParams(0, 3);
							 		
							 		BaddyManager.Add(this._owner._center, this._owner._target, this._owner._center);
									BaddyManager.CleanForNextType();
								}
								break;
							//Corner Movement
							case 1:
								if (this._owner._isAttacking)
								{
									if (this._owner._frameCounter % 30 == 0)
									{
										BaddyManager.SetType("ShotgunBullet");
							 			BaddyManager.SetStatsByName("BossBullet");
							 			BaddyManager.SetSpecificParams(15, 0);
										
										for (let i = 0; i < this._shotGunPellets; i++)
										{
											BaddyManager.Add(this._owner._attackPoint[this._currentShotPoint], this._owner._target, this._owner._center);	
										}

										BaddyManager.CleanForNextType();
										
										if (this._currentShotPoint < this._owner._vertexCount-1)
										{
											this._currentShotPoint++;
										}
										else
										{
											this._currentShotPoint = 0
										}
									}
								}
								break;
							//Special Attack
							default:
								this.SpecialAttack();
								break;
						}
					}
					else
					{
						//Spam stronger special attack
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
			ISCHARGING = true;
		}
		
		DeathAttack()
		{
			ParticleSystemMessages.Send("boss-2", {
				x: this._owner._center.x,
				y: this._owner._center.y,
				radius: this._owner._starRadius,
				color: this._color
			});
			
			if (this._owner._frameCounter % 5 == 0)
			{
				if (DifficultySelect._difficulty === DifficultySelect.HARD)
				{
					BaddyManager.SetType("ShotgunBullet");
					BaddyManager.SetStatsByClass(this._smithereens, "BossBullet");
					BaddyManager.SetSpecificParams(360, 0);
				}
				else
				{
					BaddyManager.SetType("ShotgunBullet");
					BaddyManager.SetStatsByClass(this._smithereens, "BounceBossSmithereen");
					BaddyManager.SetSpecificParams(360, 0);
				}
				
				for (let i = 0; i < this._shotGunPellets; i++)
				{
					BaddyManager.Add(this._owner._center, this._owner._target, this._owner._center);
				}
				
				BaddyManager.CleanForNextType();
			}
		}
		
		SpecialAttack()
		{
			if (ISCHARGING)
			{
				this.Charge();
			}
			else
			{
				ParticleSystemMessages.Send("boss-3", {
					x: this._owner._center.x,
					y: this._owner._center.y,
					radius: this._owner._starRadius,
					color: this._color
				});
				
				if (this.CheckScreenBorderCollision())
				{
					this.CalcMoveVector();
					
					if (this._owner._doFinalAttack)
					{
						if (BaddyManager.GetBaddyCount() < 10)
						{
							BaddyManager.SetType("BouncingBaddy");
							BaddyManager.SetStatsByName("RandomFillColor");
							BaddyManager.SetSpecificParams(5, 0.30);
							
				 			BaddyManager.Add(this._owner._center, this._owner._target, this._owner._center);
							BaddyManager.CleanForNextType();
							
							SoundManager.Play(Sounds.BOUNCE_BADDY);
						}
					}
				}
				
				this._owner._center.x += this._owner._moveVector.x;
				this._owner._center.y += this._owner._moveVector.y;
			}
		}
		
		CheckIfInLimits()
		{
			if ((this._owner._center.x >= this._owner._radius) && (this._owner._center.x <= this._stage.stageWidth - this._owner._radius))
			{
				if ((this._owner._center.y >= this._owner._radius) && (this._owner._center.y <= this._stage.stageHeight - this._owner._radius))
				{
					return true;
				}
			}
			
			return false;
		}
		
		CheckScreenBorderCollision()
		{
			if (this._owner._center.x - this._owner._radius < 0)
			{
				return true;
			}
			else if (this._owner._center.y - this._owner._radius < 0)
			{
				return true;
			}
			else if (this._owner._center.x + this._owner._radius > this._stage.stageWidth)
			{
				return true
			}
			else if (this._owner._center.y + this._owner._radius > this._stage.stageHeight)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		
		CalcMoveVector()
		{
			if (!this._owner._doFinalAttack)
			{
				this._currentBoost = this._owner._maxSpeed / 2;
			}
			else
			{
				this._currentBoost = NumberUtils.randRange(this._boostRange.x, this._boostRange.y, true);
			}
			
			this._owner._tmpValues = VectorUtils.normalize(this._owner._target, this._owner._center, this._currentBoost);
			this._owner._moveVector = this._owner._tmpValues[0];
			this._owner._tmpValues = null;
		}
		
		Charge()
		{
			let rotationMultiplier;
			
			//Start rotating fast in a suspicious manner
			if (this._owner._rotationSpeed < this._owner._maxRotation)
			{
				//Adding 1 to avoid 0 as the initial value
				rotationMultiplier = NumberUtils.normalize(this._owner._rotationSpeed + 1, this._owner._rotationSpeedInit, this._owner._maxRotation);
				this._owner._rotationSpeed += rotationMultiplier;
			}
			else
			{
				this.CalcMoveVector();
				
				this._owner._center.x += this._owner._moveVector.x;
				this._owner._center.y += this._owner._moveVector.y;
				
				this._owner._radius = this._owner._starRadius;
				
				if (this.CheckIfInLimits())
				{
					ISCHARGING = false;
				}
			}
		}
	}

	window.BounceBoss = BounceBoss;
}