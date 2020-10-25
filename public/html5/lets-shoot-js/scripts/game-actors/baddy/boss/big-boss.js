"use strict";

{
	class BigBoss extends State
	{
		constructor(stage, bitAmount, bitSpeed, slowAttackShotsPerFrame, bombTimer, chargeUpTime, baseBaddyAmount)
		{
			super(stage);
			
			this._createBits = false;
			this._attack = false;
			this._canAttack = false;
			this._moveBitsBack = false;
			this._killBits = false;
			this._takeVectorToCenter = false;
			this._chargingUp = false;
			this._finalAttackA = false;
			this._backOff = false;
			this._bitInitPos = null;
			this._bitAngle = 0;
			this._bitAmount = 0;
			this._bitCenter = null;
			this._bitPosModifier = 0;
			this._distanceToShootPos = 0;
			this._distanceToShootPosInit = 0;
			this._bitRadiusModifier = 0;
			this._bitIdleRadius = 0;
			this._bitSpeed = 0;
			this._initBitSpeed = 0;
			this._realDistance = 0;
			this._targetAngle = 0;
			this._bombColorIndex = 0;
			this._bombColors = null;
			this._attackBit = null;
			this._bombBit = null;
			this._shootingTime = 0;
			this._shootingInterval = 0;
			this._slowAttackShotsPerFrame = 0;
			this._lastMovement = 0;
			this._bombTimer = 0;
			this._currentBombIndex = 0;
			this._bombCount = 0;
			this._moveDistance = 0;
			this._attackBitCount = 0;
			this._chargeUpTime = 0;
			this._chargeUpTimeInit = 0;
			this._baseBaddyAmount = 0;
			this._currentBaddyCount = 0;
			this._bombBitParameters = null;
			this._attackBitParameters = null;
			this._bigBossBullets = null;
			this._powerShot = null;
			this._smithereens = null;
			this._color = 0;
			this._backOffAngle = 0;
			this._backOffPos = null;
			this._backOffModifier = 0;
			this._backOffDistance = 0;
			this._backOffDistanceInit = 0;
			this._baddyType = null;
			this._baddyStrenght = null;
			this._specificProperties = null;
			this._spawnSound = null;

			this._attackBit = [];
			this._bombBit = [];
			
			this._bombStrengths = [];

			if (DifficultySelect._difficulty === DifficultySelect.HARD)
			{
				this._bombColors = [0xff00ff00, 0xffffff00, 0xffff0000, 0xffffff00];
				this._bombStrengths = ["Weak", "Strong", "Invinsible", "Strong"];
			}
			else
			{
				this._bombColors = [0xff00ff00, 0xffffff00, 0xffff6a03, 0xffffff00];
				this._bombStrengths = ["Weak", "Strong", "Fast", "Strong"];
			}
			
			this._bitInitPos = new Point();
			
			this._bitPosModifier = 0;
			this._distanceToShootPos = 0;
			this._bitRadiusModifier = 1;
			this._currentBaddyCount = 0;
			this._bombColorIndex = 0;
			this._currentBombIndex = 0;
			this._bombCount = 0;
			this._moveDistance = 0;
			this._attackBitCount = 0;
			
			this._createBits = true;
			this._attack = false;
			this._canAttack = false;
			this._moveBitsBack = true;
			this._takeVectorToCenter = true;
			this._chargingUp = true;
			this._finalAttackA = true;
			this._backOff = false;
			this._killBits = true;
			
			this._slowAttackShotsPerFrame = slowAttackShotsPerFrame;
			this._initBitSpeed = bitSpeed;
			
			this._bitAmount = bitAmount;
			this._bombTimer = bombTimer;
			this._baseBaddyAmount = baseBaddyAmount;
			this._bitAngle = (360 / bitAmount) * (Math.PI / 180);
			this._chargeUpTime = chargeUpTime;
			
			this._bitSpeed = this._initBitSpeed;
			this._chargeUpTimeInit = this._chargeUpTime;
			
			this._bombBitParameters = new BaddyParameters();
			this._bombBitParameters.SetSegmentParameters(new Point(1, 5), new Point(10, 15), 80);
			this._bombBitParameters.SetOptions(true, true);
			this._bombBitParameters.SetUpdateParameters(12, 2, 20, 250000);
			this._bombBitParameters.SetSound(true, Sounds.EXPLOSION);
			
			this._attackBitParameters = new BaddyParameters();
			this._attackBitParameters.SetDrawParameters(3, 0xffffffff, 0xff000000);
			this._attackBitParameters.SetSegmentParameters(new Point(1, 5), new Point(10, 15), 50);
			this._attackBitParameters.SetOptions(true, true);
			this._attackBitParameters.SetUpdateParameters(12, 2, 20, 500000);
			this._attackBitParameters.SetSound(true, Sounds.EXPLOSION2);
			
			this._bigBossBullets = new BaddyParameters();
			this._bigBossBullets.SetDrawParameters(1, 0xffffffff, 0xff000000);
			this._bigBossBullets.SetSegmentParameters(new Point(1, 5), new Point(10, 15), 50);
			this._bigBossBullets.SetOptions(true, true);
			this._bigBossBullets.SetUpdateParameters(11, 20, 8, 1);
			this._bigBossBullets.SetSound(false);
			
			this.CreateBaddyArrays();
			this.CreateSpecificProps();
		
			stage = null;
		}
		
		Init()
		{
			this._owner._originalColor.redMultiplier = 0.7;
			this._owner._originalColor.greenMultiplier = 0.0;
			this._owner._originalColor.blueMultiplier = 1.0;
			
			if (this._createBits)
			{
				this._owner._isHitable = true;
				this._bitCenter = this._owner._center.clone();
				this._distanceToShootPosInit = this._owner._collisionRadius * 5;
				// See Change Radius in BossBaddy for the reason to this shit
				this._bitIdleRadius = this._owner._starRadius + 15;
				
				for (let i = 0; i < this._bitAmount; i++)
				{
					this._bitInitPos.x = this._owner._center.x + Math.cos(this._bitAngle * i);
					this._bitInitPos.y = this._owner._center.y + Math.sin(this._bitAngle * i);
					
					if (i % 2 === 0)
					{
						this._attackBitCount++;
						
						BaddyManager.SetType("AttackBitBaddy");
						BaddyManager.SetStatsByClass(this._attackBitParameters, "AttackBit");
						BaddyManager.SetSpecificParams();
						
						this._attackBit.push(BaddyManager.Add(this._bitInitPos, null, this._owner._center, true));
					}
					else
					{
						const bombStrength = this._bombStrengths[this._bombColorIndex];

						this._bombBitParameters.SetDrawParameters(3, 0xffffffff, this._bombColors[this._bombColorIndex]);
						this._bombColorIndex++;
						this._bombCount++;

						BaddyManager.SetType("BombBitBaddy");
						BaddyManager.SetStatsByClass(this._bombBitParameters, bombStrength + "BombBit");
						BaddyManager.SetSpecificParams();
						
						this._bombBit.push(BaddyManager.Add(this._bitInitPos, this._owner._target, this._owner._center, true));
					}
					
					BaddyManager.CleanForNextType();
				}
				
				// This special bullet goes here because for some reason that I will not take care of now
				// this._owner is not available in the constructor.
				this._powerShot = new BaddyParameters();
				this._powerShot.SetDrawParameters(3, 0xffffffff, 0xff000000);
				this._powerShot.SetSegmentParameters(new Point(1, 5), new Point(10, 15), 50);
				this._powerShot.SetOptions(true, true);
				this._powerShot.SetUpdateParameters(10, 20, this._owner._collisionRadius, 50000);
				this._powerShot.SetSound(false);
				
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
					this._smithereens.SetUpdateParameters(9, 2, 8, 200);
					this._smithereens.SetSound(false);
				}
				
				this._createBits = false;
			}
		}
		
		Run()
		{
			this._targetAngle = TrigUtils.calcAngleAtan2(this._owner._target.x, this._owner._target.y, this._owner._center.x, this._owner._center.y);
			
			if (this._owner._currentMovement !== 666)
			{
				if (this._canAttack && !SoundManager.SoundPlaying(Sounds.LIGHT_SABER))
				{
					if (!this._owner._doFinalAttack)
					{
						if (!this._owner._wasHitByBomb)
						{
							switch (this._owner._currentMovement)
							{
								// Slow Movement
								case 0:
									this.RegularAttack();
									break;
								// Corner Movement
								case 1:
									if (this._owner._isAttacking)
									{
										this.RegularAttack(7, 3, false);
									}
									else
									{
										this._moveBitsBack = true;
									}
									break;
								// Special Attack
								default:
									this.SpecialAttack();
									break;
							}
							
							this.BombUsage();
						}
						else
						{
							ParticleSystemMessages.Send("boss-1", {
								x: this._owner._center.x,
								y: this._owner._center.y,
								radius: this._owner._starRadius,
								color: this._color
							});
				
							this._moveBitsBack = true;
						}
					}
					else
					{
						if (!this._owner._wasHitByBomb)
						{
							this.MainFinalAttack();
						}
					}
				}
				else
				{
					this._targetAngle = TrigUtils.calcAngleAtan2(this._owner._target.x, this._owner._target.y, this._owner._center.x, this._owner._center.y);
				}
				
				// When all bits die, the Boss dies aswell. Not without a shower of bullets ofcourse :P
				if (this._bombCount + this._attackBitCount <= 0)
				{
					this._owner._life = 1;
				}
			}
			else
			{
				this.DeathAttack();
			}
			
			this.BitMovement();
			
			this._lastMovement = this._owner._currentMovement;
		}
		
		Completed()
		{
			
		}
		
		CleanSpecific()
		{
			if (this._bombBitParameters !== null)
			{
				this._bombBitParameters.Clean();
			}
			if (this._attackBitParameters !== null)
			{
				this._attackBitParameters.Clean();
			}
			if (this._bigBossBullets !== null)
			{
				this._bigBossBullets.Clean();
			}
			if (this._powerShot !== null)
			{
				this._powerShot.Clean();
			}
			if (this._smithereens !== null)
			{
				this._smithereens.Clean();
			}
			
			if (this._attackBit !== null)
			{
				for (let i = 0; i < this._attackBit.length; i++)
				{
					if (this._attackBit[i] !== null)
					{
						this._attackBit[i].Clean();
						this._attackBit[i] = null;
					}
				}
			}
			
			if (this._bombBit !== null)
			{
				for (let i = 0; i < this._bombBit.length; i++)
				{
					if (this._bombBit[i] !== null)
					{
						this._bombBit[i].Clean();
						this._bombBit[i] = null;
					}
				}
			}
			
			this._smithereens = null;
			this._powerShot = null;
			this._bigBossBullets = null;
			this._bitCenter = null;
			this._attackBit = null;
			this._bombBit = null;
			this._bombBitParameters = null;
			this._attackBitParameters = null;
			this._bitInitPos = null;
			this._spawnSound = null;
		}
		
		DeathAttack()
		{
			this._moveBitsBack = true;
			let i = 0;
			
			ParticleSystemMessages.Send("boss-2", {
				x: this._owner._center.x,
				y: this._owner._center.y,
				radius: this._owner._starRadius,
				color: this._color
			});
			
			if (this._killBits)
			{
				for (i = 0; i < this._bombBit.length; i++)
				{
					if (this._bombBit[i] !== null)
					{
						if (!this._bombBit[i]._timeToDie)
						{
							this._bombBit[i].Kill();
						}
						else
						{
							this._bombBit[i].Clean();
							this._bombBit[i] = null;
						}
					}
				}
				
				for (i = 0; i < this._attackBit.length; i++)
				{
					if (this._attackBit[i] !== null)
					{
						if (!this._attackBit[i]._timeToDie)
						{
							this._attackBit[i].Kill();
						}
						else
						{
							this._attackBit[i].Clean();
							this._attackBit[i] = null;
						}
					}
				}
				
				this._killBits = false;
			}
			else
			{
				if (this._owner._frameCounter % 5 === 0)
				{
					BaddyManager.SetType("ShotgunBullet");
					BaddyManager.SetStatsByName("BossBullet");
					BaddyManager.SetSpecificParams(360, 0);
					
					for (i = 0; i < this._owner._vertexCount; i++)
					{
						BaddyManager.Add(this._owner._center, this._owner._target, this._owner._center);
					}
					
					BaddyManager.CleanForNextType();
				}
				
				if (this._owner._frameCounter % 15 === 0)
				{
					BaddyManager.SetType("StraightBullet");	
					BaddyManager.SetStatsByName("BossBullet");
					BaddyManager.SetSpecificParams(null, this._owner._center);
					
					for (i = 0; i < this._owner._vertexCount; i++)
					{
						BaddyManager.Add(this._owner._attackPoint[i], null, this._owner._center);
					}
					
					BaddyManager.CleanForNextType();
				}
				
				if (this._owner._frameCounter % 20 === 0)
				{
					BaddyManager.SetType("SnakeBaddy");
					BaddyManager.SetStatsByClass(this._smithereens, "BigBossBossChunk");
			 		BaddyManager.SetSpecificParams(true);
			 		
			 		BaddyManager.Add(this._owner._center, this._owner._target, this._owner._center);
					BaddyManager.CleanForNextType();
				}
			}
		}
		
		MainFinalAttack()
		{
			this._moveBitsBack = true;
			this._bitSpeed = (this._initBitSpeed - this._attackBitCount);
			this._owner._radius = this._owner._collisionRadius;
			
			this.SlowDown();
			
			if (this._takeVectorToCenter)
			{
				this.CalcMoveVector(new Point(this._stage.stageWidth / 2, this._stage.stageHeight / 2), this._owner._maxSpeed / 3);
				
				this._takeVectorToCenter = false;
				this._finalAttackA = true;
			}
			else
			{
				if (this._moveDistance > 0)
				{
					this._moveDistance -= this._owner._maxSpeed / 3;
					
					this._owner._center.x += this._owner._moveVector.x;
					this._owner._center.y += this._owner._moveVector.y;
				}
				else
				{
					if (this._finalAttackA)
					{
						this.SpawnRandomBaddies();
						
						if (this._chargingUp)
						{
							this._owner._isHitable = true;
							this._chargeUpTime > 0 ? this._chargeUpTime-- : this._chargingUp = false;
							
							ParticleSystemMessages.Send("big-boss-1", {
								x: this._owner._center.x,
								y: this._owner._center.y,
								radius: this._owner._starRadius * 3,
								color: this._color
							});
							
							// If the Boss is hit while charging it's Attack it will go into it's other pattern.
							// This will also kill any Baddies that where spawned
							if (this._owner._wasHit)
							{
								this._chargeUpTime = this._chargeUpTimeInit * 2;
								this._finalAttackA = false;
								this._chargingUp = false;
								
								// If the Boss is hit by a regular shot it should back off a bit before attacking.
								// Otherwise, it will wait until it can move again to start attacking.
								if (this._owner._wasHitByBomb)
								{
									this._backOff = false;
								}
								else
								{
									this._backOff = true;
									
									this._backOffAngle = this._targetAngle + (180 * (Math.PI / 180));
									this._backOffPos = new Point();
									this._backOffPos.x = this._owner._center.x + Math.cos(this._backOffAngle) * 100;
									this._backOffPos.y = this._owner._center.y + Math.sin(this._backOffAngle) * 100;;
									
									this.CalcMoveVector(this._backOffPos.clone(), this._owner._maxSpeed);
									
									this._backOffPos = null;
								}
							}
						}
						else
						{
							if (this._distanceToShootPos === 0)
							{
								this._owner._isHitable = false;
								
								this.FinalAttackA();
								
								if (this._chargeUpTime < this._chargeUpTimeInit)
								{
									this._chargeUpTime++;
								}
								else
								{
									this._chargingUp = true;
									this._currentBaddyCount = 0;
								}
							}
						}
					}
					else
					{
						if (this._backOff)
						{
							this._backOff = this.BackOff();
						}
						else
						{
							this.RegularAttack(0, 0, true, true);
							
							this._chargeUpTime > 0 ? this._chargeUpTime-- : this._takeVectorToCenter = true;
						}
					}
				}
			}
		}
		
		FinalAttackA()
		{
			let moveVector;
			let initPos;
			
			for (let i = 0; i < this._attackBit.length; i++)
			{
				if (this._owner._frameCounter % 5 === 0)
				{
					if (this._attackBit[i] !== null)
					{
						if (this._attackBit[i]._initializingBlowUp)
						{
							if (!this._attackBit[i]._timeToDie && this._attackBit[i]._center !== null && this._attackBit[i]._interpolator === 1)
							{
								this._owner._tmpValues = VectorUtils.normalize(this._attackBit[i]._center, this._owner._center);
								moveVector = this._owner._tmpValues[0];
								
								BaddyManager.SetType("StraightBullet");
								BaddyManager.SetStatsByName("BossBullet");
								BaddyManager.SetSpecificParams(moveVector.clone(), null);
								
								for (let j = 0; j < this._bitSpeed + 1; j++)
								{
									initPos = this.CalcBulletInitPos(this._attackBit[i]._center.clone(), 50);
									BaddyManager.Add(initPos);
								}
								
								BaddyManager.CleanForNextType();
							}
						}
					}
				}
			}
			
			initPos = null;
			moveVector = null;
		}
		
		SpawnRandomBaddies()
		{
			let baddy;
			let strength;
			let initPos;
			
			if (this._currentBaddyCount < (this._baseBaddyAmount * (this._bitSpeed + 1)))
			{
				if (this._owner._frameCounter % 15 === 0)
				{
					baddy = NumberUtils.randRange(0, this._baddyType.length - 1, true);
					strength = NumberUtils.randRange(0, this._baddyStrenght.length - 1, true);
					
					BaddyManager.SetType(this._baddyType[baddy]);
					BaddyManager.SetStatsByName(this._baddyStrenght[strength]);
					BaddyManager.SetSpecificParamsAsArray(this._specificProperties[this._baddyType[baddy]]);
					
					initPos = this.CalcSpawnPos(0, 0, this._stage.stageWidth, this._stage.stageHeight, this._owner._target, 150);
					
					BaddyManager.Add(initPos, this._owner._target, this._owner._center);
					BaddyManager.CleanForNextType();
					
					SoundManager.Play(this._spawnSound[this._baddyType[baddy]]);
					
					this._currentBaddyCount++;
				}
			}
		}
		
		BackOff()
		{
			if (this._backOffDistance > 0)
			{
				this._backOffDistance -= this._owner._maxSpeed;
				this._backOffModifier = NumberUtils.normalize(this._backOffDistance, 0, this._backOffDistanceInit);
				
				this._owner._center.x += this._owner._moveVector.x * this._backOffModifier;
				this._owner._center.y += this._owner._moveVector.y * this._backOffModifier;
				
				return true;
			}
			else
			{
				return false;
			}
		}
		
		SpecialAttack()
		{
			let moveVector;
			let initPos;
			
			this._bitSpeed = this._initBitSpeed / 2;
			this._moveBitsBack = true;
			
			this.SlowDown();
			
			if (this._distanceToShootPos === 0)
			{
				for (let i = 0; i < this._bombBit.length; i++)
				{
					if (this._bombBit[i] !== null)
					{
						if (!this._bombBit[i]._timeToDie && !this._bombBit[i]._wasShot)
						{
							if (this._owner._frameCounter % 6 === 0)
							{
								this._owner._tmpValues = VectorUtils.normalize(this._bombBit[i]._center, this._owner._center);
								moveVector = this._owner._tmpValues[0];
								
								BaddyManager.SetType("StraightBullet");
								BaddyManager.SetStatsByName("BossBullet");
								BaddyManager.SetSpecificParams(moveVector.clone(), null);
								
								BaddyManager.Add(this._bombBit[i]._center, null, this._bombBit[i]._center);
								BaddyManager.CleanForNextType();
							}
						}
					}
				}
				
				for (let i = 0; i < this._attackBit.length; i++)
				{
					if (this._attackBit[i] !== null)
					{
						if (this._attackBit[i]._initializingBlowUp)
						{
							if (!this._attackBit[i]._timeToDie && this._attackBit[i]._center !== null && this._attackBit[i]._interpolator === 1)
							{
								if (this._owner._frameCounter % 6 === 0)
								{
									this._owner._tmpValues = VectorUtils.normalize(this._attackBit[i]._center, this._owner._center);
									moveVector = this._owner._tmpValues[0];
									
									BaddyManager.SetType("StraightBullet");
									BaddyManager.SetStatsByClass(this._bigBossBullets, "BossWeakBullet");
									BaddyManager.SetSpecificParams(moveVector.clone(), null);
									
									initPos = this.CalcBulletInitPos(this._attackBit[i]._center.clone(), 10);
									BaddyManager.Add(initPos , null, this._attackBit[i]._center);
									BaddyManager.CleanForNextType();
								}
							}
						}
					}
				}
			}
		}

		RegularAttack(shootingTime = 0, shootingInterval = 0, longShot = true, powerUp = false)
		{
			let initPos;
			let moveVector;
			
			this._moveBitsBack = false;
			
			if (this._lastMovement !== this._owner._currentMovement)
			{
				this._shootingTime = shootingTime;
				this._shootingInterval = shootingInterval;
			}
			
			this._bitSpeed = this._initBitSpeed;
			
			if (this._attack)
			{
				if (this._distanceToShootPos >= this._distanceToShootPosInit)
				{
					this._distanceToShootPos = this._distanceToShootPosInit;
					
					if (shootingTime !== 0)
					{
						this._shootingTime > 0 ? this._shootingTime-- : this._attack = false;
					}
					
					if (longShot)
					{
						this._owner._tmpValues = VectorUtils.normalize(this._owner._target, this._bitCenter);
						moveVector = this._owner._tmpValues[0];
						
						BaddyManager.SetType("StraightBullet");
						BaddyManager.SetStatsByClass(this._bigBossBullets, "BossWeakBullet");
						BaddyManager.SetSpecificParams(moveVector.clone(), null);
						
						for (let i = 0; i < this._slowAttackShotsPerFrame; i++)
						{
							let frameWait;
							
							powerUp ? frameWait = 3 : frameWait = 2;
							
							if (this._owner._frameCounter % frameWait === 0)
							{
								initPos = this.CalcBulletInitPos(this._bitCenter.clone(), 50);
								BaddyManager.Add(initPos);
							}
						}
					}
					else
					{
						this._owner._tmpValues = VectorUtils.normalize(this._bitCenter, this._owner._center);
						moveVector = this._owner._tmpValues[0];
						
						BaddyManager.SetType("StraightBullet");
						BaddyManager.SetStatsByName("BossBullet");
						BaddyManager.SetSpecificParams(moveVector.clone(), null);
						
						initPos = this.CalcBulletInitPos(this._bitCenter.clone(), 50);
						BaddyManager.Add(initPos);
					}
					
					BaddyManager.CleanForNextType();
					
					if (powerUp)
					{
						if (this._owner._frameCounter % 20 === 0)
						{
							BaddyManager.SetType("StraightBullet");
							BaddyManager.SetStatsByClass(this._powerShot, "BossPowerBullet");
							BaddyManager.SetSpecificParams(moveVector.clone(), null);
							
							BaddyManager.Add(this._bitCenter);
							BaddyManager.CleanForNextType();
							
							SoundManager.Play(Sounds.MISSILE);
						}
					}
				}
			}
			else
			{
				if (shootingInterval !== 0)
				{
					if (this._shootingInterval > 0)
					{
						this._shootingInterval--;
					}
					else
					{
						this._shootingTime = shootingTime;
						this._shootingInterval = shootingInterval;
						
						this._targetAngle = TrigUtils.calcAngleAtan2(this._owner._target.x, this._owner._target.y, this._owner._center.x, this._owner._center.y);
						
						this._attack = true;
					}
				}
				else
				{
					this._attack = true;
				}
			}
			
			initPos = null;
			moveVector = null;
		}
		
		BombUsage()
		{
			if (this._currentBombIndex >= this._bombBit.length - 1)
				this._currentBombIndex = this._bombBit.length - 1;

			const bomb = this._bombBit[this._currentBombIndex];

			// If the current bomb to throw does not exist anymore, skip to next.
			if ((bomb !== null) && (bomb._center !== null))
			{
				if (this._owner._frameCounter % this._bombTimer === 0)
				{
					bomb.Fire();
					this._currentBombIndex++;
				}
			}
			else
			{
				this._currentBombIndex++;
			}
			
			// When all bombs are gone, trigger final attack.
			if (this._bombCount <= 0)
			{
				this._owner._doFinalAttack = true;
				this._owner._currentMovement = -1;
			}
		}
		
		BitMovement()
		{
			let actualBitSpeed;
			
			this.BitMiscStuff();
			
			this._bitPosModifier = NumberUtils.normalize(this._distanceToShootPos, 0, this._distanceToShootPosInit);
			this._bitRadiusModifier = NumberUtils.normalize(this._distanceToShootPos, this._bitIdleRadius * 4, 0);
			actualBitSpeed = NumberUtils.map(this._distanceToShootPos, 0, this._distanceToShootPosInit, this._bitSpeed, this._initBitSpeed * 3);
			
			this._realDistance = this._distanceToShootPosInit * this._bitPosModifier;
			this._bitCenter.x = this._owner._center.x + Math.cos(this._targetAngle) * this._realDistance;
			this._bitCenter.y = this._owner._center.y + Math.sin(this._targetAngle) * this._realDistance;
			
			for (let i = 0; i < this._bombBit.length; i++)
			{
				if (this._bombBit[i] !== null)
				{
					if (!this._bombBit[i]._timeToDie)
					{
						this._canAttack = this._bombBit[i].OuterUpdate(this._bitCenter, this._bitIdleRadius * this._bitRadiusModifier, actualBitSpeed);
					}
					else
					{
						this._bombBit[i].Clean();
						this._bombBit[i] = null;
						
						if (this._bombCount > 0)
						{
							this._bombCount--;
						}
					}
				}
			}
			
			for (let i = 0; i < this._attackBit.length; i++)
			{
				if (this._attackBit[i] !== null)
				{
					if (!this._attackBit[i]._timeToDie)
					{
						this._canAttack = this._attackBit[i].OuterUpdate(this._bitCenter, this._bitIdleRadius * this._bitRadiusModifier, actualBitSpeed);
					}
					else
					{
						this._attackBit[i].Clean();
						this._attackBit[i] = null;
						
						if (this._attackBitCount > 0)
						{
							this._attackBitCount--;
						}
					}
				}
			}
		}
		
		BitMiscStuff()
		{
			if (this._attack)
			{
				this._distanceToShootPos += this._initBitSpeed * 2;
			}
			else
			{
				this._distanceToShootPos -= this._initBitSpeed * 2;
			}
			
			if (this._moveBitsBack)
			{
				this._attack = false;
			}
			
			if (this._distanceToShootPos <= 0 )
			{
				this._distanceToShootPos = 0;
			}
			if (this._distanceToShootPos >= this._distanceToShootPosInit)
			{
				this._distanceToShootPos = this._distanceToShootPosInit;
			}
		}
		
		CalcBulletInitPos(center, maxRange)
		{
			let res = new Point();
			let angle;
			let shootRadius;
			
			angle = NumberUtils.randRange(0, (Math.PI * 2));
			shootRadius = NumberUtils.randRange(-maxRange / 2, maxRange / 2, true);
			
			res.x = center.x + Math.cos(angle) * shootRadius;
			res.y = center.y + Math.sin(angle) * shootRadius;
			
			center = null;
			
			return res;
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
			else
			{
				return true;
			}
			
			return false;
		}
		
		CalcMoveVector(target, speed)
		{
			this._owner._tmpValues = VectorUtils.normalize(target, this._owner._center, speed);
			this._owner._moveVector = this._owner._tmpValues[0];
			this._moveDistance = this._owner._tmpValues[1];
			
			this._backOffDistance = this._owner._tmpValues[1];
			this._backOffDistanceInit = this._backOffDistance;
			
			this._owner._tmpValues = null;
		}

		CreateBaddyArrays()
		{
			this._baddyType = ["RammingBaddy", "BouncingBaddy", "ExplodingBaddy", "SnakeBaddy"];
			
			if (DifficultySelect._difficulty === DifficultySelect.HARD)
			{
				this._baddyStrenght = ["Weak", "Strong", "Invinsible"];
			}
			else
			{
				this._baddyStrenght = ["Weak", "Strong", "Fast"];
			}
		}
		
		CreateSpecificProps()
		{
			this._specificProperties = {};
			this._spawnSound = {};
			
			this._specificProperties["RammingBaddy"] = [new Point(20, 40)];
			this._specificProperties["BouncingBaddy"] = [5, 0.30];
			this._specificProperties["ExplodingBaddy"] = [7, 7];
			this._specificProperties["SnakeBaddy"] = [true];
			
			this._spawnSound["RammingBaddy"] = Sounds.RAMM_BADDY;
			this._spawnSound["BouncingBaddy"] = Sounds.BOUNCE_BADDY;
			this._spawnSound["ExplodingBaddy"] = Sounds.EXPLODE_BADDY;
			this._spawnSound["SnakeBaddy"] = Sounds.SNAKE_BADDY;
		}
		
		CalcSpawnPos(x, y, maxWidth, maxHeight, avoidPos = null, avoidRadius = 0)
		{
			let res = new Point();
			
			if (avoidPos !== null)
			{
				do
				{
					res.x = NumberUtils.randRange(x, x + maxWidth, true);
					res.y = NumberUtils.randRange(y, y + maxHeight, true);
				}
				while(VectorUtils.inRange(avoidPos, res, avoidRadius));
			}
			else
			{
				res.x = NumberUtils.randRange(x, x + maxWidth, true);
				res.y = NumberUtils.randRange(y, y + maxHeight, true);
			}
			
			avoidPos = null;
			
			return res;
		}
	}

	window.BigBoss = BigBoss;
}