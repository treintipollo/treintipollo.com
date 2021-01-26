"use strict";

{
	let TARGETPLAYER = false;
	let GOTOCORNER = false;
	let SPAWNREGULARTRAIL = false;

	class SnakeBoss extends State
	{
		constructor(stage)
		{
			super(stage);
			
			TARGETPLAYER = true;
			GOTOCORNER = true;
			SPAWNREGULARTRAIL = true;

			this._bulletStats = null;
			this._currentShotPoint = 0;
			this._cardinalPoint = null;
			this._wasOffLimits = false;
			this._distanceToTarget = 0;
			this._currentCorner = 0;
			this._specificProperties = null;
			this._baddyType = null;
			this._baddyStrenght = null;
			this._spawnSound = null;
			this._currentBaddy = 0;
			this._currentStrenght = 0;
			this._smithereens = null;
			this._color = 0;

			this._currentShotPoint = 0;
			this._wasOffLimits = false;
			this._distanceToTarget = 0;
			this._currentBaddy = 0;
			this._currentStrenght = 0;
			
			this.CreateBaddyArrays();
			this.CreateSpecificProps();
		}
		
		Init()
		{
			this._owner._originalColor.redMultiplier = 0.5;
			this._owner._originalColor.greenMultiplier = 0.5;
			this._owner._originalColor.blueMultiplier = 0.5;
			
			if (this._cardinalPoint === null)
			{
				this._cardinalPoint = new Array();
				// North
				this._cardinalPoint.push(new Point(this._stage.stageWidth / 2, -this._owner._starRadius));
				// South
				this._cardinalPoint.push(new Point(this._stage.stageWidth / 2, this._stage.stageHeight + this._owner._starRadius));
				// West
				this._cardinalPoint.push(new Point(-this._owner._starRadius, this._stage.stageHeight / 2));
				// East
				this._cardinalPoint.push(new Point(this._stage.stageWidth + this._owner._starRadius, this._stage.stageHeight / 2));
			}

			if (this._bulletStats === null)
			{
				this._bulletStats = new BaddyParameters();
				this._bulletStats.SetDrawParameters(3, 0xffffffff, 0xffff6a02);
				this._bulletStats.SetSegmentParameters(new Point(1, 5), new Point(10, 15), 50);
				this._bulletStats.SetOptions(false, true);
				this._bulletStats.SetUpdateParameters(9, 2, this._owner._radius, 500);
				this._bulletStats.SetSound(false);
			}
			
			if (this._smithereens === null)
			{
				let red =  0xFF * this._owner._originalColor.redMultiplier;
				let green = 0xFF * this._owner._originalColor.greenMultiplier;
				let blue = 0xFF * this._owner._originalColor.blueMultiplier;
				let color = red << 16 | green << 8 | blue;
				
				this._color = 0xFF << 24 | color;
				
				this._smithereens = new BaddyParameters();
				this._smithereens.SetDrawParameters(3, color, 0xff000000);
				this._smithereens.SetSegmentParameters(new Point(1, 5), new Point(10, 15), 50);
				this._smithereens.SetOptions(true, true);
				this._smithereens.SetUpdateParameters(MainBody._speed + 5, 2, this._owner._collisionRadius, 5000);
				this._smithereens.SetSound(true);
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
							// Slow Movement
							case 0:
								if (this._owner._frameCounter % 50 === 0)
								{
									BaddyManager.SetType("SnakeBullet");
							 		BaddyManager.SetStatsByName("BossBullet");
							 		BaddyManager.SetSpecificParams(
							 			new Point(10, 50),
							 			new Point(6, 10),
							 			new Point(10, 15),
							 			150,
							 			this._owner._center,
							 			DifficultySelect._difficulty === DifficultySelect.HARD
							 		);
							 		
									for(i = 0; i < this._owner._vertexCount; i++)
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
									if (this._owner._frameCounter % 20 === 0)
									{
										BaddyManager.SetType("SnakeBullet");
								 		BaddyManager.SetStatsByName("BossBullet");
								 		BaddyManager.SetSpecificParams(
								 			new Point(10, 50),
								 			new Point(3, 5),
								 			new Point(10, 10),
								 			120,
								 			this._owner._center,
								 			DifficultySelect._difficulty === DifficultySelect.HARD
								 		);
										
					 					BaddyManager.Add(this._owner._attackPoint[this._currentShotPoint], this._owner._target);
										BaddyManager.CleanForNextType();
										
										if (this._currentShotPoint < this._owner._vertexCount - 1)
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
							// Special Attack
							default:
								this.SpecialAttack();
								break;
						}
					}
					else
					{
						// Spam stronger special attack
						this.FinalAttack();
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
			if (this._bulletStats !== null)
			{
				this._bulletStats.Clean();
				this._bulletStats = null;
			}
			
			if (this._smithereens !== null)
			{
				this._smithereens.Clean();
				this._smithereens = null;
			}
			
			this._cardinalPoint = null;
			this._specificProperties = null;
			this._baddyType = null;
			this._baddyStrenght = null;
			this._spawnSound = null
		}
		
		static ResetStaticVariables()
		{
			TARGETPLAYER = true;
			GOTOCORNER = true;
			SPAWNREGULARTRAIL = true;
		}
		
		DeathAttack()
		{
			ParticleSystemMessages.Send("boss-2", {
				x: this._owner._center.x,
				y: this._owner._center.y,
				radius: this._owner._starRadius,
				color: this._color
			});
			
			if (this._owner._frameCounter % 15 === 0)
			{
				BaddyManager.SetType("SnakeBaddy");
		 		BaddyManager.SetStatsByClass(this._smithereens, "SnakeBossChunk");
		 		BaddyManager.SetSpecificParams(true);
		 		
		 		BaddyManager.Add(this._owner._center, this._owner._target, this._owner._center);
				BaddyManager.CleanForNextType();
			}
		}
		
		SpecialAttack()
		{
			this.SlowDown();
			
			if (TARGETPLAYER)
			{
				this.CalcMoveVector(this._owner._target);
				
				TARGETPLAYER = false;
			}
			
			if (!this.CheckIfInLimits())
			{
				if (!this._wasOffLimits)
				{
					let rand = NumberUtils.randRange(0, this._cardinalPoint.length - 1, true);
					
					this._owner._center.x = this._cardinalPoint[rand].x;
					this._owner._center.y = this._cardinalPoint[rand].y;
					
					TARGETPLAYER = true;
				}
				
				this._wasOffLimits = true;
			}
			else
			{
				this._wasOffLimits = false;
			}
			
			if (this._owner._frameCounter % 10 === 0)
			{
				BaddyManager.SetType("SnakeBaddy");
		 		BaddyManager.SetStatsByClass(this._bulletStats, "BossSnakeTrail");
		 		BaddyManager.SetSpecificParams(false);
		 		BaddyManager.Add(this._owner._center, null, this._owner._center);
				BaddyManager.CleanForNextType();
			}
			
			this._owner._center.x += this._owner._moveVector.x;
			this._owner._center.y += this._owner._moveVector.y;
		}
		
		FinalAttack()
		{
			this.SlowDown();
			
			if (GOTOCORNER)
			{
				this._currentCorner = NumberUtils.randRange(0, this._owner._corners.length - 1, true);
				
				this.CalcMoveVector(this._owner._corners[this._currentCorner]);
				GOTOCORNER = false;
			}
			else
			{
				if (this._distanceToTarget > 0)
				{
					this._distanceToTarget -= this._owner._maxSpeed / 2;
				}
				else
				{
					SPAWNREGULARTRAIL = false;
					this._currentCorner < this._owner._corners.length - 1 ? this._currentCorner++ : this._currentCorner = 0;
					
					this.CalcMoveVector(this._owner._corners[this._currentCorner]);
				}
			}
			
			if (this._owner._frameCounter % 10 === 0)
			{
				if (SPAWNREGULARTRAIL)
				{
					BaddyManager.SetType("SnakeBaddy");
			 		BaddyManager.SetStatsByClass(this._bulletStats, "BossSnakeTrail");
			 		BaddyManager.SetSpecificParams(false);
			 		BaddyManager.Add(this._owner._center, null, this._owner._center);
					BaddyManager.CleanForNextType();
				}
				else
				{
					BaddyManager.SetType(this._baddyType[this._currentBaddy]);
			 		BaddyManager.SetStatsByName(this._baddyStrenght[this._currentStrenght]);
			 		BaddyManager.SetSpecificParamsAsArray(this._specificProperties[this._baddyType[this._currentBaddy]]);
			 		
			 		BaddyManager.Add(this._owner._center, this._owner._target, this._owner._center);
					BaddyManager.CleanForNextType();
					
					SoundManager.Play(this._spawnSound[this._baddyType[this._currentBaddy]]);
					
					this._currentBaddy < this._baddyType.length - 1 ? this._currentBaddy++ : this._currentBaddy = 0;
					this._currentStrenght < this._baddyStrenght.length - 1 ? this._currentStrenght++ : this._currentStrenght = 0;		
				}
			}
			
			this._owner._center.x += this._owner._moveVector.x;
			this._owner._center.y += this._owner._moveVector.y;
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
		
		CalcMoveVector(target)
		{
			this._owner._tmpValues = VectorUtils.normalize(target, this._owner._center, this._owner._maxSpeed / 2);
			this._owner._moveVector = this._owner._tmpValues[0];
			this._distanceToTarget = this._owner._tmpValues[1];
			this._owner._tmpValues = null;
		}
		
		CheckIfInLimits()
		{
			if ((this._owner._center.x >= -this._owner._starRadius) && (this._owner._center.x <= this._stage.stageWidth + this._owner._starRadius))
			{
				if ((this._owner._center.y >= -this._owner._starRadius) && (this._owner._center.y <= this._stage.stageHeight + this._owner._starRadius))
				{
					return true;
				}
			}
			
			return false;
		}
		
		CreateBaddyArrays()
		{
			this._baddyType = new Array("RammingBaddy", "BouncingBaddy", "ExplodingBaddy", "SnakeBaddy");
			
			if (DifficultySelect._difficulty === DifficultySelect.HARD)
			{
				this._baddyStrenght = new Array("Weak", "Strong", "Invinsible");
			}
			else
			{
				this._baddyStrenght = new Array("Weak", "Strong", "Fast");
			}
		}
		
		CreateSpecificProps()
		{
			this._specificProperties = new Object();
			
			this._specificProperties["RammingBaddy"] = new Array(new Point(20, 40));
			this._specificProperties["BouncingBaddy"] = new Array(5, 0.30);
			this._specificProperties["ExplodingBaddy"] = new Array(7, 7);
			this._specificProperties["SnakeBaddy"] = new Array(true);
			
			this._spawnSound = new Object();
			
			this._spawnSound["RammingBaddy"] = Sounds.RAMM_BADDY;
			this._spawnSound["BouncingBaddy"] = Sounds.BOUNCE_BADDY;
			this._spawnSound["ExplodingBaddy"] = Sounds.EXPLODE_BADDY;
			this._spawnSound["SnakeBaddy"] = Sounds.SNAKE_BADDY;
		}
	}

	window.SnakeBoss = SnakeBoss;
}