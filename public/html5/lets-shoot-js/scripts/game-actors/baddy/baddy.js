"use strict";

{
	let _spriteSheet;
	let _animationName;

	class Baddy extends Sprite
	{
		constructor(stage, isGenerator = false, isHitable = true, isVisible = true, hasDeathSound = true)
		{
			super(_spriteSheet, _animationName);

			this._vertexCount = 0;
			this._segments = null;
			this._shapeAngle = 0;
			
			this._fillColor = 0;
			this._initFillColor = 0;
			this._lineColor = 0;
			this._lineWidth = 0;
			
			this._segmentLife = 0;
			this._segmentDeathCount = 0;
			this._segmentSpeedRange = null;
			this._segmentRotSpeedRange = null;

			this._radius = 0;
			this._radiusInit = 0;
			this._maxSpeed = 0;
			this._speed = 0;
			this._rotationSpeed = 0;
			this._rotationSpeedInit = 0;
			this._rotVariation = 0;
			this._life = 0;
			this._maxLife = 0;
			this._pos = null;
			this._center = null;
			this._target = null;
			this._parentPos = null;
			this._typeVertexCount = 0;
			this._name = "";
			this._strengthName = "";
			this._specificParams = null;
			this._spawningTime = 0;
			this._spawningTimeInit = 0;
			this._pulseTime = 0;
			this._pulseOscillation = 0;
			
			this._bombHitInitPos = null;
			this._bombHitEndPos = null;
			this._backOffModifier = 0;
			
			this._timeToDie = false;
			this._isHitable = false;
			this._isVisible = false;
			this._isGenerator = false;
			this._isSpawning = false;
			this._wasHit = false;
			this._wasHitByBomb = false;
			this._initializingBlowUp = false;
			this._specificParamsErrorLock = false;
			
			this._stage = null;
			this._currentNode = null;
			this._possibleNeighbors = null;
			
			this._doDeathSound = false;
			this._hasDeathSound = false;
			this._deathSoundIndex = 0;

			this._stage = stage;
			
			// These are set here just so that Init's declaration wouldn't end up being too long. 
			// Figured out the code would be sligtly easier on the eye this way.
			this._isHitable = isHitable;
			this._isVisible = isVisible;
			this._isGenerator = isGenerator;
			this._hasDeathSound = hasDeathSound;
			
			this._specificParamsErrorLock = true;
			this._isSpawning = true;
			this._wasHit = false;
			this._lastDamage = 0;
			this._wasHitByBomb = false;
			this._doDeathSound = true;
			
			this.stop();
		}
		
		SetNames(className, strengthName)
		{
			this._name = className;
			this._strengthName = strengthName;
		}
		
		Init(pos, parentPos, radius, vertexCount, life, target, deathSoundIndex = -1)
		{
			// The shape is made of these
			this._vertexCount = vertexCount;
			this._segments = [];
			
			this._parentPos = parentPos;
			this._target = target;
			this._pos = pos.clone();
			this._center = this._pos.clone();
			
			// This piece makes sure Generators are bigger than regular Baddies
			if (!this._isGenerator)
			{
				this._radius = radius;
				this._radiusInit = radius;
			}
			else
			{
				this._radius = radius * 2;
				this._radiusInit = radius * 2;
			}
			
			this._shapeAngle = (360 / this._vertexCount) * (Math.PI / 180);
			this._timeToDie = false;
			this._segmentDeathCount = 0;
			this._life = life;
			this._maxLife = life;
			this._spawningTime = 0;
			this._spawningTimeInit = radius / 4;
			this._initializingBlowUp = true;
			this._pulseTime = radius;
			this._deathSoundIndex = deathSoundIndex;
			
			// Some awesome error checking, in case someone using this decides to do something dumb.
			if (!this._specificParamsErrorLock)
			{
				this.SpecificInit(this._specificParams);
			}
			else
			{
				throw new Error("Dude! Make sure you are calling SetSpecificParams before Init when setting up a Baddy.");
			}
			
			// Calling Basic movement once before connecting the dots, so that everything will be in place
			this.Draw();
			// Changing Radius for a smoother collision
			this.ChangeRadius();
			
			// Misc settings
			this.x = this._center.x;
			this.y = this._center.y;
			this.scaleX = 0;
			this.scaleY = 0;
			this.alpha = 0;
			this._bombHitInitPos = new Point();
			this._bombHitEndPos = new Point();
			
			// Adding shape to display list
			this._stage.addChild(this);
			
			// Setting up array with possible neighboring nodes indexes
			this._possibleNeighbors = [];
			this._possibleNeighbors.push([0, 1, 3]);
			this._possibleNeighbors.push([3, 6, 7]);
			this._possibleNeighbors.push([1, 2, 5]);
			this._possibleNeighbors.push([5, 7, 8]);
            
            this._currentNode = null;
			this._currentNode = Grid_Revenge.SetObjectGridPosition(this, this._currentNode, Grid_Revenge.BADDY);
		}
		
		ChangeRadius()
		{
			const vertexes = [];

			for (let i = 0; i < this._vertexCount; i++)
			{
				const tmpX = this.x + Math.cos(this._shapeAngle * i) * this._radius;
				const tmpY = this.y + Math.sin(this._shapeAngle * i) * this._radius;
				
				vertexes.push(new Point(tmpX, tmpY));
			}

			let midPoint01 = new Point();
			
			midPoint01.x = this._center.x + (vertexes[0].x + vertexes[1].x) / 2;
			midPoint01.y = this._center.y + (vertexes[0].y + vertexes[1].y) / 2;
			
			this._radius = VectorUtils.calcDistance(this._center, midPoint01)[2];
		}
		
		SetDrawParams(lineWidth = 1, lineColor = 0xffffffff, fillColor = 0xff000000)
		{
			this._lineWidth = lineWidth;
			this._lineColor = lineColor;
			this._fillColor = fillColor;
			this._initFillColor = this._fillColor;
		}
		
		SetMovementParams(maxSpeed, rotationSpeed = 1)
		{
			this._rotationSpeed = rotationSpeed;
			this._rotationSpeedInit = rotationSpeed;
			this._maxSpeed = maxSpeed;
			this._speed = 0;
			this._rotVariation = 0;
		}
		
		SetSegmentParams(segmentSpeedRange, segmentRotSpeedRange, segmentLife)
		{
			this._segmentSpeedRange = segmentSpeedRange;
			this._segmentRotSpeedRange = segmentRotSpeedRange;
			this._segmentLife = segmentLife;
		}
		
		SetSpecificParams(specificParams = null)
		{
			this._specificParamsErrorLock = false;
			this._specificParams = specificParams;
		}
		
		SpecificSpawn()
		{

		}

		SpecificMovement()
		{

		}

		SpecificInit(specificProps)
		{

		}

		SpecificClean()
		{

		}
		
		Update()
		{
			if (this._isSpawning)
			{
				this.Spawn();

				this.SpecificSpawn();
			}
			else
			{
				// Living
				if (this._life > 0)
				{
					if (this._wasHit)
					{
						this.Hit();
					}
					
					this.BasicMovement();
					
					if (this._isVisible)
					{
						this.visible = true;
						this.CheckCollision();
					}
					else
					{
						this.visible = false;
					}
					
					this.SpecificMovement();
				}
				else
				{
					// Dieing
					if (this._initializingBlowUp)
					{
						this.InitBlowUp();
					}
					else
					{
						this.BlowUpToSmithereens();
					}
				}
			}
		}
		
		Clean()
		{
			if (this._stage !== null)
			{
				this._stage.removeChild(this);
			}
			
			if (this._segments !== null)
			{
				for (let j = 0; j < this._vertexCount; j++)
				{
				 	if (this._segments[j] !== null)
				 	{
				 		if (!this._isGenerator)
				 		{
				 			if (this._initFillColor !== 0xff000000 && this._initFillColor !== 0xffffffff && this._initFillColor !== 0xffff6a02)
				 			{
				 				this.AddBaddy(new Point(this._segments[j].x, this._segments[j].y));
				 			}
				 		}
				 		
				 		this._segments[j].Clean();
				 		this._segments[j] = null;
				 	}
				}
			}

			this._segments = null;
			
			if (this._currentNode !== null)
			{
				this._currentNode.RemoveObject(this, Grid_Revenge.BADDY);
			}

			this._currentNode = null;
			
			this.SpecificClean();
			
			this._pos = null;
			this._center = null;
			this._segmentSpeedRange = null;
			this._segmentRotSpeedRange = null;
			this._specificParams = null;
			this._target = null;
			this._parentPos = null;
			this._bombHitInitPos = null;
			this._bombHitEndPos = null;
			this._stage = null;
		}
		
		Draw()
		{
			if (this._isVisible)
			{
				this.visible = true;
			}
			else
			{
				this.visible = false;
			}

			this.regX = this._radius;
			this.regY = this._radius;
		}
		
		BasicMovement()
		{
			// This makes the actual polygon rotate
			this.rotation += this._rotationSpeed;
			
			// Position of the shape
			this.x = this._center.x;
			this.y = this._center.y;
			 
			// rotation for the vertexes
			this._rotVariation += 0.017 * this._rotationSpeed;
			
			// Baddies will die on their own when they are not hitable, but only if they are not generators.
			// Those have their own way of dieing out when they can't be hit.
			// The Boss sometimes goes invincible for a while, and it shouldn't loose health.
			if (!this._isHitable && !this._isGenerator && this._name !== "BossBaddy")
			{
				this._life--;
			}
			
			const diameter = this._radius * 2;

			// This makes Baddies outside the screen limits to stop drawing themselves.
			if (this._center.x + diameter >= 0 && this._center.x - diameter <= this._stage.stageWidth)
			{
				if (this._center.y + diameter >= 0 && this._center.y - diameter <= this._stage.stageHeight)
				{
					this._isVisible = true;
				}
				else
				{
					this._isVisible = false;
				}
			}
			else
			{
				this._isVisible = false;
			}
		}
		
		Spawn()
		{
			if (this._parentPos !== null)
			{
				if (this._name.search("Bit") !== -1 || this._name.search("Bullet") !== -1)
				{
					this.x = this._parentPos.x;
					this.y = this._parentPos.y;
					
					this._center.x = this._parentPos.x;
					this._center.y = this._parentPos.y;
				}
			}
			
			if (this.scaleX <= 1)
			{
				this.alpha = NumberUtils.normalize(this._spawningTime, 0, this._spawningTimeInit);
				this.scaleX = this.alpha;
				this.scaleY = this.alpha;
				this._spawningTime++;
			}
			else
			{
				this.alpha = 1.0;
				this.scaleX = 1.0;
				this.scaleY = 1.0;
				
				this._isSpawning = false;
			}
		}
		
		Hit()
		{
			if (this._pulseTime > 0)
			{
				this._pulseOscillation = (Math.cos(this._pulseTime)) / 5;
				this._pulseTime--;
				
				this.scaleX += this._pulseOscillation;
				this.scaleY -= this._pulseOscillation;
				
				if (this._wasHitByBomb)
				{
					this.HitByBomb();
				}
			}
			else
			{
				this.scaleX = 1.0;
				this.scaleY = 1.0;
				
				this._pulseTime = this._radiusInit;
				this._wasHit = false;
				this._lastDamage = 0;
				this._wasHitByBomb = false;
			}
		}
		
		HitByBomb()
		{
			this._isHitable = true;
			
			if (this._backOffModifier < 1)
			{
				this._backOffModifier += 0.2;
				
				this.x = NumberUtils.interpolate(this._backOffModifier, this._bombHitInitPos.x, this._bombHitEndPos.x);
				this.y = NumberUtils.interpolate(this._backOffModifier, this._bombHitInitPos.y, this._bombHitEndPos.y);
			}
			
			this._center.x = this.x;
			this._center.y = this.y;
		}
		
		CheckCollision()
		{
			let hitAngle;
			let deltaX;
			let deltaY;
			let addedRadiuses;
			let damage;
			let currentBulletPoolLength;

			this._currentNode = Grid_Revenge.SetObjectGridPosition(this, this._currentNode, Grid_Revenge.BADDY);
			
			if (this._currentNode !== null)
			{
				// Checking against player in main node
				if (this._currentNode._player !== null && this._currentNode._player._isHitable)
				{
					deltaX = this._center.x - this._currentNode._player._body.x;
					deltaY = this._center.y - this._currentNode._player._body.y;
					addedRadiuses = this._radius + this._currentNode._player._radius;
					
					// We are in!
					if ((deltaX * deltaX) + (deltaY * deltaY) <= addedRadiuses * addedRadiuses)
					{
						this._currentNode._player._isAlive = false;
					}
				}
				
				if (this._isHitable)
				{
					// Checking against every bullet in the main node
					currentBulletPoolLength = this._currentNode._bulletPool.length;
					
					if (currentBulletPoolLength > 0)
					{
						for (let i = 0; i < currentBulletPoolLength; i++)
						{
							const bullet = this._currentNode._bulletPool[i];

							deltaX = this._center.x - bullet._body.x;
							deltaY = this._center.y - bullet._body.y;
							addedRadiuses = this._radius + bullet._radius;
							
							// We are in!
							if ((deltaX * deltaX) + (deltaY * deltaY) <= addedRadiuses * addedRadiuses)
							{
								damage = bullet.Kill();
								
								if (this._isGenerator)
								{
									this._life -= damage;
								}
								else
								{
									// Bombs do ubber damage!
									if (bullet._isBomb)
									{
										this._life -= damage * 5000;
									}
									else
									{
										this._life -= damage * 10;
									}
								}
								
								if (this._life <= 0)
								{
									if (this._isGenerator)
									{
										ChainCounter.Add(damage * 30, 5);
									}
									else
									{
										ChainCounter.Add(damage * 30, 1);
									}
								}
								
								// This piece checks if the Bullet that just made a hit is a Bomb
								if (bullet._isBomb)
								{
									this._bombHitInitPos.x = bullet._body.x;
									this._bombHitInitPos.y = bullet._body.y;
									
									hitAngle = TrigUtils.calcAngleAtan2(this._center.x, this._center.y, this._bombHitInitPos.x, this._bombHitInitPos.y);
									
									this._bombHitInitPos = this._center.clone();
									
									this._bombHitEndPos.x = this._center.x + Math.cos(hitAngle) * 200;
									this._bombHitEndPos.y = this._center.y + Math.sin(hitAngle) * 200;
									
									this._wasHitByBomb = true;
									this._backOffModifier = 0;
								}
								
								this._wasHit = true;
								
								if (bullet._isBomb)
								{
									this._lastDamage = damage * 5000;
								}
								else
								{
									this._lastDamage = damage * 10;
								}
							}
						}
					}
				}
				
				// Checking which is the relative position of this Baddy with the center of the main node
				let tmpNeighborsIndex;
				
				if (this._center.x <= this._currentNode._center.x)
				{
					// Left
					if (this._center.y <= this._currentNode._center.y)
					{
						// Top
						tmpNeighborsIndex = 0;
					}
					else
					{
						// Bottom
						tmpNeighborsIndex = 2;
					}
				}
				else
				{
				   // Right
				   if (this._center.y <= this._currentNode._center.y)
				   {
						// Top
						tmpNeighborsIndex = 1;
					}
					else
					{
						// Bottom
						tmpNeighborsIndex = 3;
					}
				}
				
				// Checking against bullets and player in neighboring nodes.
				// 3 is the maximun posible number of neighbors
				for (let j = 0; j < 3; j++)
				{
					const neighbors = this._currentNode._neighbors[this._possibleNeighbors[tmpNeighborsIndex][j]];

					if (neighbors !== null)
					{
						// Checking against player in neighboring nodes
						if (neighbors._player !== null && neighbors._player._isHitable)
						{
							deltaX = this._center.x - neighbors._player._body.x;
							deltaY = this._center.y - neighbors._player._body.y;
							addedRadiuses = this._radius + neighbors._player._radius;
							
							// We are in!
							if ((deltaX * deltaX) + (deltaY * deltaY) <= addedRadiuses * addedRadiuses)
							{
								neighbors._player._isAlive = false;
							}
						}
						
						if (this._isHitable)
						{
							currentBulletPoolLength = neighbors._bulletPool.length;
							
							if (currentBulletPoolLength > 0)
							{
								for (let k = 0; k < currentBulletPoolLength; k++)
								{
									const bullet = neighbors._bulletPool[k];

									if (bullet !== null)
									{
										deltaX = this._center.x - bullet._body.x;
										deltaY = this._center.y - bullet._body.y;
										addedRadiuses = this._radius + bullet._radius;
										
										// We are in!
										if ((deltaX * deltaX) + (deltaY * deltaY) <= addedRadiuses * addedRadiuses)
										{
											damage = bullet.Kill();
											
											if (this._isGenerator)
											{
												this._life -= damage;
											}
											else
											{
												// Bombs do ubber damage!
												if (bullet._isBomb)
												{
													this._life -= damage * 5000;
												}
												else
												{
													this._life -= damage * 10;
												}
											}
											
											if (this._life <= 0)
											{
												if (this._isGenerator)
												{
													ChainCounter.Add(damage * 30, 5);
												}
												else
												{
													ChainCounter.Add(damage * 30, 1);
												}
											}
											
											// This piece checks if the Bullet that just made a hit is a Bomb
											if (bullet._isBomb)
											{
												this._bombHitInitPos.x = bullet._body.x;
												this._bombHitInitPos.y = bullet._body.y;
												
												hitAngle = TrigUtils.calcAngleAtan2(this._center.x, this._center.y, this._bombHitInitPos.x, this._bombHitInitPos.y);
												
												this._bombHitInitPos = this._center.clone();
												
												this._bombHitEndPos.x = this._center.x + Math.cos(hitAngle) * 200;
												this._bombHitEndPos.y = this._center.y + Math.sin(hitAngle) * 200;
												
												this._wasHitByBomb = true;
												this._backOffModifier = 0;
											}
											
											this._wasHit = true;

											if (bullet._isBomb)
											{
												this._lastDamage = damage * 5000;
											}
											else
											{
												this._lastDamage = damage * 10;
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		
		InitBlowUp()
		{
			if (this._doDeathSound)
			{
				if (this._hasDeathSound)
				{
					if (this._deathSoundIndex === -1)
					{
						SoundManager.Play(NumberUtils.randRange(Sounds.POP, Sounds.POP_3, true));
					}
					else
					{
						SoundManager.Play(this._deathSoundIndex);
					}
				}
			}
			
			// Remove the shape as soon as possible
			this._stage.removeChild(this);
			
			this.CreateSegments();
		}

		CreateSegments()
		{
			// Until this point the shape was rotatin using it's rotation property, and the rotation
			// for the vertexes was the only thing saved.
			// Here the actual positions of the vertexes for the segments that will fly away are calculated.
			const vertexes = this.CalcVertexPositions();

			// Setting this to change flow in Update and Draw
			this._initializingBlowUp = false;

			const name = this._strengthName + this._name + "Segment";

			// Here is the creation of the segments that will fly away.
			for (let j = 0; j < this._vertexCount; j++)
			{
				const segment = new Baddy_Segment(
					DynamicGraphics.GetSpriteSheet(),
					name,
			 		this.CalcSegmentVertexes(vertexes, j),
			 		this._center,
			 		this._stage,
			 		this._isVisible
			 	);

			 	this._segments.push(segment);

			 	segment.SetUpdateParams(this._segmentSpeedRange, this._segmentRotSpeedRange, this._segmentLife);
			 	segment.SetDrawParams(this._lineColor, this._lineWidth, name);
			}
		}
		
		BlowUpToSmithereens()
		{
			for (let j = 0; j < this._vertexCount; j++)
			{
				if (this._segments[j] !== null)
				{
					if (this._segments[j]._isAlive)
					{
						this._segments[j].Update();
					}
					else
					{
						if (!this._isGenerator)
						{
							if (this._initFillColor !== 0xff000000 && this._initFillColor !== 0xffffffff && this._initFillColor !== 0xffff6a02)
							{
								this.AddBaddy(new Point(this._segments[j].x, this._segments[j].y));
							}
						}
						
						this._segments[j].Clean();
						this._segments[j] = null;
						this._segmentDeathCount++;
					}
				}
			}
			
			// This signals the generator that it is ok to recycle the object or just remove it.
			if (this._segmentDeathCount >= this._vertexCount)
			{
				this._timeToDie = true;
			}
		}
		
		CalcSegmentVertexes(vertexes, index)
		{
			let vertexA;
			let vertexB;

			let res = [];

			if (index !== this._vertexCount - 1)
			{
				vertexA = vertexes[index];
				vertexB = vertexes[index + 1];
			}
			else
			{
				vertexA = vertexes[index];
				vertexB = vertexes[0];
			}

			// Doing some cloning to avoid references to the same vertex, something which will cause the effect
			// of the polygon enlarging instead of breaking apart.
			res.push(vertexA.clone());
			res.push(vertexB.clone());

			return res;
		}
		
		CalcVertexPositions()
		{
			let res = [];

			for (let i = 0; i < this._vertexCount; i++)
			{
				const r = this._shapeAngle * i;

				res.push(new Point(
					(this._center.x + Math.cos(r + this.rotation) * this._radius),
					(this._center.y + Math.sin(r + this.rotation) * this._radius)
				));
			}

			return res;
		}
		
		AddBaddy(spawnPos)
		{
			let stats = new BaddyParameters();
			
			if (this._initFillColor === 0xff00ff00)// Green
			{
				// Baddies with a green fill color will spawn Baddies with half their parents life
				stats.SetUpdateParameters(this._maxSpeed, this._rotationSpeedInit, this._radiusInit / 2, this._maxLife / 2);
			}
			else
			{
				// Baddies with another color will have twice as much life as their parents
				stats.SetUpdateParameters(this._maxSpeed, this._rotationSpeedInit, this._radiusInit / 2, this._maxLife * 2);
			}
			
			if (this._initFillColor === 0xffff0000)
			{
				// Baddies with a red fill color will spawn invincible Baddies
				stats.SetOptions(false, this._isVisible);
			}
			else
			{
				// Other Baddies will collide normaly
				stats.SetOptions(true, this._isVisible);
			}
			
			stats.SetDrawParameters(this._lineWidth, this._initFillColor, 0xff000000);
			stats.SetSegmentParameters(this._segmentSpeedRange, this._segmentRotSpeedRange, this._segmentLife);
			stats.SetSound(true);
			
			BaddyManager.SetType(this._name);
			BaddyManager.SetStatsByClass(stats, this._strengthName + "SpawnedByBaddy");
			BaddyManager.SetSpecificParamsAsArray(this._specificParams);
			BaddyManager.Add(spawnPos, this._target, this._parentPos);
			BaddyManager.CleanForNextType();
		}

		static SetSpriteSheetAndAnimation(spriteSheet, animationName)
		{
			_spriteSheet = spriteSheet;
			_animationName = animationName;
		}
	}

	window.Baddy = Baddy;
}