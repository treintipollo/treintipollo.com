"use strict";

{
	class BaseGenerator extends Baddy
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(stage, isGenerator, isHitable, isVisible, hasDeathSound);
			
			this._coolDown = 0;
			this._timeTillNextGet = 0;
			this._sameTimeAmount = 0;
			this._maxMinions = 0;
			this._minionsLimit = 0;
			this._spawnRadiusRange = null;
			this._autonomy = 0;
			this._canRegenerate = false;
			this._regenRate = 0;
			this._regenTimer = 0;
			
			this._nulledMinionsAmount = 0;
			this._totalMinionsDead = 0;
			
			this._currentMinionAmount = 0;
			this._totalMinionsGenerated = 0;
			this._aliveMinions = 0;
			
			this._baddyPool = null;
			this._baddyObject = null;
			this._baddyName = "";
			this._baddyStatsName = "";
			this._spawnSound = null;
			
			this.SPLICELIMIT = 5;
			
			this._naturalDeath = false;
			this._allMinionsDead = false;
			
			//
			// All variables below are the ones the Generator uses to initialize it's minions.
		    //
			this._baddyRadius = 0;
			this._baddyRotationSpeed = 0;
			this._baddyMaxSpeed = 0;
			this._baddyLineWidth = 0;
			this._baddyLineColor = 0;
			this._baddyFillColor = 0;
			this._baddySegmentSpeedRange = null;
			this._baddySegmentRotSpeed = null;
			this._baddySegmentLife = 0;
			this._baddyLife = 0;
			this._baddyIsGenerator = false;
			this._baddyIsVisible = false;
			this._baddyIsHitable = false;
			this._baddyHasDeathSound = false;
			this._baddyDeathSoundIndex = 0;
			this._baddySpecificParams = null;

			this._baddyPool = new Array();
			
			this._timeTillNextGet = 0;
			this._currentMinionAmount = 0;
			this._nulledMinionsAmount = 0;
			this._totalMinionsGenerated = 0;
			this._totalMinionsDead = 0;
			this._aliveMinions = 0;
			this._regenTimer = 0;
			this._naturalDeath = false;
			this._allMinionsDead = false;
			
			this._typeVertexCount = 8;
			
			this.CreateSoundIndexes();
		}

		static GetVertexCount()
		{
			return 8;
		}
		
		InitGenerator(stats)
		{
			this._coolDown = stats._coolDown;
			this._sameTimeAmount = stats._sameTimeAmount;
			this._maxMinions = stats._maxMinions;
			this._spawnRadiusRange = stats._spawnRadiusRange;
			this._autonomy = stats._autonomy;
			this._canRegenerate = stats._canRegenerate;
			this._regenRate = stats._regenRate;
		}
		
		SetBaddyStats(stats)
		{
			this._baddyRadius 			 = stats._radius;
			this._baddyRotationSpeed 	 = stats._rotationSpeed;
			this._baddyMaxSpeed      	 = stats._maxSpeed;
			this._baddyLife 		     = stats._life;
			this._baddyLineWidth 		 = stats._lineWidth;
			this._baddyLineColor 		 = stats._lineColor;
			this._baddyFillColor 		 = stats._fillColor;
			this._baddySegmentSpeedRange = stats._segmentSpeedRange;
			this._baddySegmentRotSpeed   = stats._segmentRotSpeedRange;
			this._baddySegmentLife 	     = stats._segmentLife;
			this._baddyIsHitable     	 = stats._isHitable;
			this._baddyIsVisible     	 = stats._isVisible;
			this._baddyHasDeathSound 	 = stats._hasDeathSound;
			this._baddyDeathSoundIndex   = stats._deathSoundIndex;
		}

		SetBaddyType(baddyType, statsName)
		{
			this._baddyName = baddyType;
			this._baddyStatsName = statsName;
			this._baddyObject = getDefinitionByName(this._baddyName);
			
			if ((baddyType.search("Generator")) !== -1)
			{
				this._baddyIsGenerator = true;
			}
			else
			{
				this._baddyIsGenerator = false;
			}
		}
		
		SetBaddySpecificParams(specificParams)
		{
			this._baddySpecificParams = specificParams;
		}
		
		GeneratorUpdate()
		{
			if (this._currentMinionAmount !== 0)
			{
				for (let i = 0; i < this._currentMinionAmount; i++)
				{
					if (this._baddyPool[i] !== null)
					{
						if (!this._baddyPool[i]._timeToDie)
						{
							this._baddyPool[i].Update();
							
							if (this._baddyPool[i]._isGenerator)
							{
								this._baddyPool[i].GeneratorUpdate();
							}
						}
						else
						{
							this._baddyPool[i].Clean();
							this._baddyPool[i] = null;
							
							this._nulledMinionsAmount++;
							this._totalMinionsDead++;
							this._aliveMinions--;
						}
					}
				}
			}
			
			this.BasicGeneration();
		}
		
		CleanGenerator()
		{
			// Cleaning and nulling any baddy that will need to be cut loose once the generator dies
			for (let i = 0; i < this._currentMinionAmount; i++)
			{
		 		if (this._baddyPool[i] !== null)
		 		{
					this._baddyPool[i].Clean();
					this._baddyPool[i] = null;
		 		}
		 	}
		 	
			// Nulling possible loose refences
			this._baddyObject = null;
			this._baddyPool = null;
		 	this._baddySegmentSpeedRange = null;
		 	this._baddySegmentRotSpeed = null;
		 	this._baddySpecificParams = null;
		 	this._spawnRadiusRange = null;
		 	this._spawnSound = null;
		 	
		 	// Calling Baddy's Clean method, because we don't have to forget that Generator is a special kind of Baddy.
		 	this.Clean();
		}
		
		KillAllChildren()
		{
			for (let i = 0; i < this._baddyPool.length; i++)
			{
				if (this._baddyPool[i] !== null )
				{
					if (!this._baddyPool[i]._timeToDie)
					{
						this._baddyPool[i]._life = 0;
						this._baddyPool[i]._doDeathSound = false;
					}
				}
			}
		}
		
		BasicGeneration()
		{
			// If the generator dies, no further baddies have to be created until the manager removes it.
			if (this._life > 0)
			{
				// This chunk prevents new minions from being generated if max is reached
				if (this._totalMinionsGenerated < this._maxMinions)
				{
					if (this._aliveMinions < this._autonomy)
					{
						if (this._timeTillNextGet < this._coolDown)
						{
							this._timeTillNextGet++;
						}
						else
						{
							// Here it is checked if the amount of minions to add next will exceed the 
							// total amount that was set previously. If it doesn't they are
							// added, if it does, the difference of the maximum alowed and the currently
							// generated, is added.
							this._minionsLimit = this._totalMinionsGenerated + this._sameTimeAmount;
							
							if (this._minionsLimit < this._maxMinions)
							{
								SoundManager.Play(this._spawnSound[this._baddyName]);
								this.Add(this._sameTimeAmount);
							}
							else
							{
								this._minionsLimit = this._maxMinions - this._totalMinionsGenerated;
								SoundManager.Play(this._spawnSound[this._baddyName]);
								this.Add(this._minionsLimit);
							}
							
							this._timeTillNextGet = 0;
						}
					}
				}
				
				// Life regeneration.
				if (this._canRegenerate)
				{
					if (this._life < this._maxLife)
					{
						if (this._regenTimer < this._regenRate)
						{
							this._regenTimer++;
							
							let color = 0xFF << 24 | this._lineColor;
							
							ParticleSystemMessages.Send("generator-regen", {
								x: this._center.x,
								y: this._center.y,
								radius: this._radiusInit * 2,
								color: color
							});
						}
						else
						{
							let lifeIncrease = this._life + this._regenRate;
							lifeIncrease < this._maxLife ? this._life += this._regenRate : this._life = this._maxLife;
							this._regenTimer = 0;
						}
					}
				}
			}
			
			// If the generator is not hitable, it will die on it's own once it has launched all it's minions
			if (!this._isHitable)
			{
				if (this._totalMinionsGenerated >= this._maxMinions)
				{
					this._life = 0;
				}
				this._naturalDeath = true;
			}
			
			// This kills any minions currently alive when their Generator dies by action of player.
			// If it dies on it's own, it's minions won't die. They will fight to the bitter end!
			if (!this._naturalDeath)
			{
				if (this._life <= 0)
				{
					for (let i = 0; i < this._currentMinionAmount; i++)
					{
			 			if (this._baddyPool[i] !== null)
			 			{
			 				this._baddyPool[i]._life = 0;
			 			}
			 		}
				}
			}
			
			// If All it's minions are dead, the generator dies aswell
			if (this._totalMinionsDead >= this._maxMinions)
			{
				this._life = 0;
				this._allMinionsDead = true;
			}
			
			// This is checking if the limit to splice out nulled minions has been reached.
			// Should be more efficient to splice in bulk rather than splice out minions as they die.
			if (this._nulledMinionsAmount >= this.SPLICELIMIT)
			{
				this.SortNSpliceNulls();
			}
		}
		
		Add(baddyAmount)
		{
			let spawnPos;
			
			for (let i = 0; i < baddyAmount; i++)
			{
				Baddy.SetSpriteSheetAndAnimation(DynamicGraphics.GetSpriteSheet(), this._baddyStatsName + this._baddyName);

				const baddy = new this._baddyObject(this._stage, this._baddyIsGenerator, this._baddyIsHitable, this._baddyIsVisible, this._baddyHasDeathSound);

				this._baddyPool.push(baddy);

				baddy.SetNames(this._baddyName, this._baddyStatsName);
				baddy.SetSpecificParams(this._baddySpecificParams);
				baddy.SetMovementParams(this._baddyMaxSpeed, this._baddyRotationSpeed);
				baddy.SetDrawParams(this._baddyLineWidth, this._baddyLineColor, this._baddyFillColor);
				baddy.SetSegmentParams(this._baddySegmentSpeedRange, this._baddySegmentRotSpeed, this._baddySegmentLife);
				
				spawnPos = this.CalcSpawnPos();
				
				baddy.Init(
					spawnPos,
					this._pos,
					this._baddyRadius,
					baddy._typeVertexCount,
					this._baddyLife,
					this._target,
					this._baddyDeathSoundIndex
				);
			}
			
			this._currentMinionAmount += baddyAmount;
			this._totalMinionsGenerated += baddyAmount;
			this._aliveMinions += baddyAmount;
		}
		
		SortNSpliceNulls()
		{
			// Calculate de starting index to splice.
			let startIndex = this._baddyPool.length - this._nulledMinionsAmount;
			
			// Sort so that all null values are put together at the end of the array.
			this._baddyPool.sort();
			
			// Splice them all out in one fell sweep.
			this._baddyPool.splice(startIndex, this._nulledMinionsAmount);
			
			// Setting letibles to meaningful values after the splicing
			this._currentMinionAmount -= this._nulledMinionsAmount;
			this._nulledMinionsAmount = 0;
		}
		
		CalcSpawnPos()
		{
			let res = new Point();
			let initAngle = NumberUtils.randRange(0, Math.PI * 2);
			
			res.x = this._pos.x + Math.cos(initAngle) * (NumberUtils.randRange(this._spawnRadiusRange.x, this._spawnRadiusRange.y));
			res.y = this._pos.y + Math.sin(initAngle) * (NumberUtils.randRange(this._spawnRadiusRange.x, this._spawnRadiusRange.y));
			
			return res;
		}
		
		CreateSoundIndexes()
		{
			this._spawnSound = {};
			
			this._spawnSound["RammingBaddy"] = Sounds.RAMM_BADDY;
			this._spawnSound["BouncingBaddy"] = Sounds.BOUNCE_BADDY;
			this._spawnSound["ExplodingBaddy"] = Sounds.EXPLODE_BADDY;
			this._spawnSound["SnakeBaddy"] = Sounds.SNAKE_BADDY;
		}
	}

	window.BaseGenerator = BaseGenerator;
}