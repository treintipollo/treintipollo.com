"use strict";

{
	let ISAPPEARING = false;

	class ExplodeBoss extends State
	{
		constructor(stage, teleportTimesRange, stopTimeRange)
		{
			super(stage);
			
			this._bulletStats = null;
			this._smithereens = null;
			this._color = 0;
			
			this._teleportTimes = 0;
			this._teleportTimesRange = null;
			this._stopTime = 0;
			this._stopTimeRange = null;
			this._invisibleWaitTime = 0;

			ISAPPEARING = false;
			
			this._teleportTimesRange = teleportTimesRange;
			this._stopTimeRange = stopTimeRange;
			this._teleportTimes = NumberUtils.randRange(teleportTimesRange.x, teleportTimesRange.y, true);
		}
		
		Init()
		{
			if (this._bulletStats === null)
			{
				this._bulletStats = new BaddyParameters();
				this._bulletStats.SetDrawParameters(3, 0xffffffff, 0xffff6a02);
				this._bulletStats.SetSegmentParameters(new Point(1, 5), new Point(10, 15), 50);
				this._bulletStats.SetOptions(false, true);
				this._bulletStats.SetUpdateParameters(12, 2, this._owner._collisionRadius, 500);
				this._bulletStats.SetSound(true);
			}
		
			this._owner._originalColor.redMultiplier = 0.7;
			this._owner._originalColor.greenMultiplier = 0.7;
			this._owner._originalColor.blueMultiplier = 0.1;
			
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
				
				if (DifficultySelect._difficulty === DifficultySelect.HARD)
				{
					this._smithereens.SetOptions(false, true);
					this._smithereens.SetUpdateParameters(40, 2, 8, 300);
				}
				else
				{
					this._smithereens.SetOptions(true, true);
					this._smithereens.SetUpdateParameters(40, 2, 8, 1);
				}


				this._smithereens.SetSound(false);
			}
		}
		
		Run()
		{
			let i;
			
			if (this._owner._currentMovement != 666)
			{
				if (!this._owner._wasHitByBomb)
				{
					if (!this._owner._doFinalAttack)
					{
						switch (this._owner._currentMovement)
						{
							// Slow Movement
							case 0:
								if (this._owner._frameCounter % 80 === 0)
								{
									BaddyManager.SetType("ExplodingBullet");
							 		BaddyManager.SetStatsByName("BossBullet");
							 		BaddyManager.SetSpecificParams(false, 3);
							 		
									for (i = 0; i < this._owner._vertexCount; i++)
									{
							 			BaddyManager.Add(this._owner._attackPoint[i], this._owner._target, this._owner._center);
									}

									BaddyManager.CleanForNextType();
								}
								break;
							// Corner Movement
							case 1:
								if (this._owner._isAttacking)
								{
									if (this._owner._frameCounter % 70 === 0)
									{
										BaddyManager.SetType("ExplodingBullet");
								 		BaddyManager.SetStatsByClass(this._bulletStats, "BombBossBullet");
								 		BaddyManager.SetSpecificParams(true, 0, 8);
										
					 					BaddyManager.Add(this._owner._center, this._owner._target);
										BaddyManager.CleanForNextType();
									}
								}
								break;
							// Special Attack
							default:
								this.SpecialAttack();
								break;
						}
					}
					else
					{
						// Spam stronger special attack
						this.SpecialAttack()
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
			if (this._bulletStats != null)
			{
				this._bulletStats.Clean();
				this._bulletStats = null;
			}
			
			if (this._smithereens != null)
			{
				this._smithereens.Clean();
				this._smithereens = null;
			}
			
			this._teleportTimesRange = null;
		}
		
		static ResetStaticVariables()
		{
			ISAPPEARING = false
		}
		
		DeathAttack()
		{
			let shrapnelPos = new Point();
			let explodeAmount = 8;
			let explosionAngle;
			let clockwise;
			let rateOfFire = 15;
			
			ParticleSystemMessages.Send("boss-2", {
				x: this._owner._center.x,
				y: this._owner._center.y,
				radius: this._owner._starRadius,
				color: this._color
			});
			
			if (this._owner._frameCounter % rateOfFire === 0)
			{
				explosionAngle = (360 / explodeAmount) * (Math.PI / 180);
				
				if (this._owner._frameCounter % (rateOfFire * 2) === 0)
				{
					clockwise = true;
				}
				else
				{
					clockwise = false;
				}
				
				if (this._owner._frameCounter % (rateOfFire * 6) === 0)
				{
					BaddyManager.SetType("SpiralBullet");
					BaddyManager.SetStatsByName("BossBullet");
					BaddyManager.SetSpecificParams(3, 2, clockwise);
				}
				else
				{
					if (DifficultySelect._difficulty === DifficultySelect.HARD)
					{
						BaddyManager.SetType("SpiralBullet");
						BaddyManager.SetStatsByClass(this._smithereens, "BossBullet");
						BaddyManager.SetSpecificParams(3, 2, clockwise);
					}
					else
					{
						BaddyManager.SetType("SpiralBullet");
						BaddyManager.SetStatsByClass(this._smithereens, "ExplodeBossSmithereen");
						BaddyManager.SetSpecificParams(3, 2, clockwise);
					}
				}
			 	
				for (let i = 0; i < explodeAmount; i++)
				{
					shrapnelPos.x = this._owner._center.x + Math.cos(explosionAngle * i) * 5;
					shrapnelPos.y = this._owner._center.y + Math.sin(explosionAngle * i) * 5;
					
		 			BaddyManager.Add(shrapnelPos, null, this._owner._center.clone());
				}
				
				BaddyManager.CleanForNextType();
			}
			
			shrapnelPos = null;
		}
		
		SpecialAttack()
		{
			if (ISAPPEARING)
			{
				this.Appear();
			}
			else
			{
				this.Disappear();
			}
			
			this._owner._center.x += this._owner._moveVector.x + (Math.sin(this._owner._frameCounter / 10) * 5);
			this._owner._center.y += this._owner._moveVector.y;
		}
		
		Disappear()
		{
			this.SlowDown();
			
			if (this._owner._originalColor.alphaMultiplier > 0)
			{
				this._owner._originalColor.alphaMultiplier -= 0.03;
			}
			else
			{
				this._owner._originalColor.alphaMultiplier = 0;
				this._owner._isVisible = false;
				
				this._owner._moveVector.x = 0;
				this._owner._moveVector.y = 0;
				
				do
				{
					this._owner._center.x = NumberUtils.randRange(this._owner._starRadius, this._stage.stageWidth-this._owner._starRadius, true);
					this._owner._center.y = NumberUtils.randRange(this._owner._starRadius, this._stage.stageHeight-this._owner._starRadius, true);
				}
				while(VectorUtils.inRange(new Point(this._stage.mouseX, this._stage.mouseY), this._owner._center, this._owner._starRadius * 4));
				
				this._invisibleWaitTime = NumberUtils.randRange(this._stopTimeRange.x/50, this._stopTimeRange.y/50, true);
				
				if (this._teleportTimes > 0)
				{
					this._teleportTimes--;
					this._stopTime = NumberUtils.randRange(this._stopTimeRange.x/50, this._stopTimeRange.y/50, true);
				}
				else
				{
					this._teleportTimes = NumberUtils.randRange(this._teleportTimesRange.x, this._teleportTimesRange.y, true);
					this._stopTime = NumberUtils.randRange(this._stopTimeRange.x, this._stopTimeRange.y, true);
				}
				
				if (this._owner._doFinalAttack)
				{
					if (BaddyManager.GetBaddyCount() < 10)
					{
						BaddyManager.SetType("ExplodingBaddy");
						BaddyManager.SetStatsByName("RandomFillColor");
						BaddyManager.SetSpecificParams(7, 7);
						
			 			BaddyManager.Add(this._owner._center, this._owner._target, this._owner._center);
						BaddyManager.CleanForNextType();
						
						SoundManager.Play(Sounds.EXPLODE_BADDY);
					}
				}
				
				ISAPPEARING = true;
			}
		}
		
		Appear()
		{
			if (this._invisibleWaitTime > 0)
			{
				this._invisibleWaitTime--;
			}
			else
			{
				this._owner._isVisible = true;
				
				if (this._owner._originalColor.alphaMultiplier < 1)
				{
					this._owner._originalColor.alphaMultiplier += 0.03;
				}
				else
				{
					if (this._stopTime > 0)
					{
						this._stopTime--;
						this._owner._originalColor.alphaMultiplier = 1;
						
						this.Attack();
					}
					else
					{
						ISAPPEARING = false;
					}
				}
			}
		}
		
		Attack()
		{
			if (this._owner._frameCounter % 40 === 0)
			{
				BaddyManager.SetType("ExplodingBullet");
				BaddyManager.SetStatsByClass(this._bulletStats, "BombBossBullet");
		 		BaddyManager.SetSpecificParams(true, 0, 3);
				
 				BaddyManager.Add(this._owner._center, this._owner._target);
				BaddyManager.CleanForNextType();
			}
		}
		
		SlowDown()
		{
			let rotationMultiplier;
			
			this._owner._radius = this._owner._collisionRadius;
			
			if (this._owner._rotationSpeed > this._owner._rotationSpeedInit + 1)
			{
				rotationMultiplier = NumberUtils.normalize(this._owner._rotationSpeed, this._owner._rotationSpeedInit, this._owner._maxRotation);
				this._owner._rotationSpeed -= rotationMultiplier;
			}
		}
	}

	window.ExplodeBoss = ExplodeBoss;
}